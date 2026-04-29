const mongoose = require('mongoose');
require('dotenv').config();
const chatbotDb = require('../models/dbChatbot');
const Conversation = require('../models/Conversation');

async function check() {
    try {
        console.log('Connecting to Chatbot DB...');
        // chatbotDb is already a connection
        const convs = await Conversation.find().limit(5).sort({timestamp: -1});
        console.log('Last 5 conversations:');
        console.log(JSON.stringify(convs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Need to wait for chatbotDb to connect or just use it
if (chatbotDb.readyState === 1) {
    check();
} else {
    chatbotDb.on('connected', check);
}
