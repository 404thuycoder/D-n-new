const { execSync, spawn } = require('child_process');

console.log('🧹 Đang dọn dẹp các cổng mạng bị kẹt (3000, 3001, 3002)...');
const ports = [3000, 3001, 3002];

ports.forEach(port => {
    try {
        const out = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = out.split('\n');
        const killedPids = new Set();
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4 && parts[1].endsWith(`:${port}`)) {
                const pid = parts[parts.length - 1];
                if (pid !== '0' && !killedPids.has(pid)) {
                    console.log(`Tiến trình PID ${pid} đang chiếm cổng ${port}. Đang tắt...`);
                    try {
                        execSync(`taskkill /F /PID ${pid} 2>NUL`);
                        killedPids.add(pid);
                        console.log(`✅ Đã giải phóng cổng ${port}`);
                    } catch (e) {
                        // ignore
                    }
                }
            }
        });
    } catch (err) {
        // No process found on this port, which is good.
    }
});

console.log('\n🚀 Đang khởi động TOÀN BỘ hệ thống (Server + Admin + Business)...');
const server = spawn('node', ['server.js'], { 
    stdio: 'inherit', 
    env: { ...process.env, NODE_OPTIONS: '--max-http-header-size=131072' }
});

server.on('exit', (code) => {
    console.log(`\n⚠️ Server đã dừng với mã thoát ${code}`);
    process.exit(code);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Đang dừng hệ thống...');
    server.kill();
    process.exit();
});

// Keep parent alive
setInterval(() => {}, 1000);
