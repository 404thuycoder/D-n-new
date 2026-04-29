const Groq = require('groq-sdk');
require('dotenv').config();

async function testKey(keyName, model = 'llama-3.3-70b-versatile') {
    const key = process.env[keyName];
    if (!key) {
        console.error(`FAILURE: ${keyName} is missing in .env`);
        return;
    }
    const groq = new Groq({ apiKey: key });
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello' }],
            model: model,
        });
        console.log(`${keyName} Response:`, completion.choices[0].message.content);
        console.log(`SUCCESS: ${keyName} is working.`);
    } catch (error) {
        console.error(`FAILURE: ${keyName} error:`, error.message);
    }
}

async function runAll() {
    await testKey('GROQ_API_KEY');
    await testKey('GROQ_API_KEY_PLANNER');
    await testKey('GROQ_API_KEY_NAVIGATION');
}

runAll();
