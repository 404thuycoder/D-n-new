const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testAI() {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('AI Response:', completion.choices[0].message.content);
        console.log('SUCCESS: API Key is working.');
    } catch (error) {
        console.error('FAILURE: API Key error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testAI();
