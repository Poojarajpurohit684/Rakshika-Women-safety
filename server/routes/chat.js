const router = require('express').Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.warn('[Gemini] WARNING: GEMINI_API_KEY is missing from .env');
} else {
  console.log('[Gemini] API Key is set');
}

router.use(auth);

router.post('/', async (req, res) => {
  const { message, history } = req.body;
  console.log('[Chat] Message received:', message);
  console.log('[Chat] History length:', history?.length || 0);

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Mock mode fallback when GEMINI_API_KEY is missing/invalid
  if (!process.env.GEMINI_API_KEY || process.env.MOCK_MODE === '1') {
    console.log('[Chat] Using mock response mode');
    const mockResponses = [
      "That sounds important. Would you like me to help you share your location or send an SOS alert?",
      "I understand. Stay safe and remember you can reach your trusted contacts anytime.",
      "That's a great idea. Let me know if you need any help with safety features.",
      "I'm here to support you. Would you like guidance on any safety measures?",
      "Thank you for sharing that. Your safety is my priority.",
    ];
    const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return res.json({ reply });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Clean up history to follow user-model sequence
    const sanitizedHistory = (history || []).filter(item => 
      item.role === 'user' || item.role === 'model'
    );
    
    // Ensure history doesn't start with 'model' (Gemini requirement)
    if (sanitizedHistory.length > 0 && sanitizedHistory[0].role === 'model') {
      sanitizedHistory.shift();
    }

    const chat = model.startChat({
      history: sanitizedHistory,
      systemInstruction: "You are Rakshika, a safety assistant for women. Your goal is to provide safety advice and help users in distress. " +
        "You can understand commands like 'send SOS', 'share location', 'find safe zones', or 'trigger a fake call'. " +
        "When a user asks for these specific safety actions, confirm you are doing it. " +
        "Keep your responses concise, empathetic, and focused on safety."
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log('[Chat] Response sent');

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error Details:', error.message);
    if (error.response) {
      console.error('Gemini Response Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to get response from AI assistant' });
  }
});

module.exports = router;
