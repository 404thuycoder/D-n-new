const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const SystemLog = require('../models/SystemLog');

const LOG_FILE = path.join(__dirname, '../audit.log');

const logAction = async (userEmailOrAction, roleOrDesc, actionOrReq = {}, detailsOrExtra = {}, ip = '', userAgent = '') => {
  let userEmail, role, action, details, finalIp, finalAgent;
  const timestamp = new Date();

  // Determine which signature is being used
  // Old: (userEmail, role, action, details, ip, userAgent)
  // New: (actionName, description, reqOrUser, extraDetails)
  if (typeof actionOrReq === 'object' && (actionOrReq.headers || actionOrReq.ip || actionOrReq.user || actionOrReq.email)) {
    // Use New Signature Logic
    action = userEmailOrAction;
    const description = roleOrDesc;
    const reqOrUser = actionOrReq;
    details = detailsOrExtra;

    if (reqOrUser.user) {
      userEmail = reqOrUser.user.email || reqOrUser.user.id || 'Unknown';
      role = reqOrUser.user.role || 'Unknown';
      finalIp = reqOrUser.ip || '';
      finalAgent = reqOrUser.headers ? reqOrUser.headers['user-agent'] : '';
    } else if (reqOrUser.email) {
      userEmail = reqOrUser.email;
      role = reqOrUser.role || 'Unknown';
      finalIp = ip;
      finalAgent = userAgent;
    } else {
      userEmail = 'System';
      role = 'System';
      finalIp = ip;
      finalAgent = userAgent;
    }
    
    // Include description in details for MongoDB
    if (typeof details === 'object') {
      details.description = description;
    } else {
      details = { description, info: details };
    }
  } else {
    // Use Old Signature Logic
    userEmail = userEmailOrAction;
    role = roleOrDesc;
    action = actionOrReq;
    details = detailsOrExtra;
    finalIp = ip;
    finalAgent = userAgent;
  }

  const entry = {
    timestamp: timestamp.toISOString(),
    user: userEmail,
    role,
    action,
    details,
    ip: finalIp,
    userAgent: finalAgent
  };

  // 1. Log to File
  try {
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFile(LOG_FILE, logLine, (err) => {
      if (err) console.error('Failed to write audit log:', err);
    });
  } catch (err) {
    console.error('Failed to write audit log file:', err);
  }

  // 2. Log to MongoDB (Crucial for Admin Dashboard)
  try {
    const log = new SystemLog({
      action: action,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details),
      userName: userEmail,
      userRole: role,
      ip: finalIp,
      userAgent: finalAgent,
      timestamp
    });
    await log.save();
  } catch (err) {
    console.error('Failed to save SystemLog to DB:', err);
  }
};

module.exports = logAction;
