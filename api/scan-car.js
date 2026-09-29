module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const rawBase64 = String(payload.image || '').trim();
    const provdedApiKey = payload.apiKey || process.env.GEMINI_API_KEY;
    const apiKey = String(provdedApiKey || '').trim();

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing GEMINI_API_KEY.' });
    }

    const cleanBase64 = rawBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
    if (!cleanBase64) {
      return res.status(400).json({ error: 'Missing image payload.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Analyze this photo. Identify if there is a vehicle present. Return strictly valid JSON containing: isCar (boolean), make (string), model (string), estimatedYear (string), rarity (Common/Rare/Exotic), confidenceScore (number 0-100), and reasoning (string short description).'
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return res.status(geminiResponse.status).json({
        error: 'Gemini API request failed.',
        details: errorText
      });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let parsed;

    try {
      const cleanedText = String(rawText).replace(/^```json\s*|```\s*$/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (error) {
      parsed = null;
    }

    if (!parsed || parsed.isCar === false) {
      return res.json({
        isCar: false,
        make: '',
        model: '',
        estimatedYear: '',
        rarity: 'Common',
        confidenceScore: 0,
        reasoning: parsed?.reasoning || 'No vehicle identified in the photo.'
      });
    }

    return res.json({
      isCar: true,
      make: String(parsed.make || 'Unknown').trim(),
      model: String(parsed.model || 'Unknown').trim(),
      estimatedYear: String(parsed.estimatedYear || 'Unknown').trim(),
      rarity: ['Common', 'Rare', 'Exotic'].includes(parsed.rarity) ? parsed.rarity : 'Common',
      confidenceScore: Number(parsed.confidenceScore || 0),
      reasoning: String(parsed.reasoning || 'Vehicle detected in the photo.').trim()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process the vehicle scan.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
