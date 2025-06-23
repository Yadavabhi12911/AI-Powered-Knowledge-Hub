const fetch = require('node-fetch');

async function summarizeWithLLM(content) {
  if (!process.env.GEMINI_API_KEY) {
    return "Summary unavailable (missing Gemini API key).";
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: `Summarize the following article in 3-4 sentences:\n\n${content}` }] }]
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text.trim();
    } else if (data.error && data.error.message) {
      throw new Error(data.error.message);
    } else {
      throw new Error('Unknown Gemini API error');
    }
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return `Summary unavailable (Gemini error: ${err.message})`;
  }
}

module.exports = { summarizeWithLLM };


