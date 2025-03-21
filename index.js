const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Carbon calculation endpoint
app.post('/api/calculate', (req, res) => {
  const { distance, vehicleType } = req.body;
  // Simple calculation (placeholder)
  const emissionFactors = { car: 0.2, bus: 0.1, train: 0.05 };
  const footprint = distance * emissionFactors[vehicleType] || 0;
  res.json({ footprint: footprint.toFixed(2) });
});

// AI recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { footprint, vehicleType, distance } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give 3 concise recommendations to reduce carbon footprint for someone who 
    travels ${distance} km by ${vehicleType}. Current footprint: ${footprint} kgCO2. 
    Use bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ recommendations: response.text() });
  } catch (error) {
    res.status(500).json({ error: 'AI service error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));