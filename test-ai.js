const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path: '.env.local'});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
async function run() {
  const prompt = `Respond strictly in the following JSON format:
{
  "passed": boolean
}`;
  try {
    const result = await model.generateContent(prompt);
    console.log('SUCCESS:', result.response.text());
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}
run();
