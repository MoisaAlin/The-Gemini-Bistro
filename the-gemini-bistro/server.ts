import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getCulinaryFallbackResponse(userMessage: string, language: string): string {
  const isRo = language === 'ro';
  const query = (userMessage || '').toLowerCase();

  if (query.includes('vegan') || query.includes('vegetarian') || query.includes('post')) {
    return isRo
      ? "Pentru opțiuni vegane și de post, vă recomandăm cu căldură Bruschetta al Pomodoro (pâine cu maia la grătar, roșii proaspete, usturoi și busuioc) și cocktailul nostru semnătură Tuscan Sunset!"
      : "For vegan options, we highly recommend our Bruschetta al Pomodoro (grilled sourdough with fresh tomatoes, garlic, and basil) paired with our signature Tuscan Sunset cocktail!";
  }

  if (query.includes('gluten') || query.includes('celiac')) {
    return isRo
      ? "Avem opțiuni delicioase fără gluten: Filet Mignon cu sparanghel copt, Somon Al Forno cu crustă de lămâie și mărar, iar la desert Panna Cotta cu fructe de pădure proaspete!"
      : "We have wonderful gluten-free choices: our Filet Mignon with roasted asparagus, Salmon Al Forno with lemon-dill crust, and for dessert, our silky Panna Cotta with fresh berry coulis!";
  }

  if (query.includes('pasta') || query.includes('spaghetti') || query.includes('carbonara')) {
    return isRo
      ? "Piesa noastră de rezistență este Spaghetti Carbonara, pregătită după rețeta tradițională romană cu pancetta crocantă, gălbenușuri proaspete și brânză Pecorino Romano din abundență!"
      : "Our signature pasta is the classic Spaghetti Carbonara, crafted the authentic Roman way with crispy pancetta, fresh egg yolks, Pecorino Romano, and cracked black pepper!";
  }

  if (query.includes('desert') || query.includes('dessert') || query.includes('dulce') || query.includes('sweet') || query.includes('tiramisu')) {
    return isRo
      ? "La desert vă răsfățăm cu celebrul nostru Tiramisu de casă sau o Panna Cotta catifelată cu sos de fructe de pădure proaspete!"
      : "For dessert, indulge in our classic homemade Tiramisu or our silky smooth Panna Cotta served with fresh berry coulis!";
  }

  if (query.includes('recomand') || query.includes('recommend') || query.includes('special') || query.includes('best')) {
    return isRo
      ? "Recomandarea șefului bucătar este Spaghetti Carbonara autentică sau fragedul Filet Mignon (8oz) cu reducție de vin roșu, completat de cocktailul Tuscan Sunset!"
      : "Our chef's top recommendations are the authentic Spaghetti Carbonara or the tender 8oz Filet Mignon with red wine reduction, paired wonderfully with a Tuscan Sunset cocktail!";
  }

  return isRo
    ? "Bine ați venit la The Gemini Bistro! Sunt aici să vă ajut cu orice detalii despre meniul nostru proaspăt – de la antreuri și paste artizanale, la preparate din carne sau pește și deserturi rafinate. Despre ce preparat ați dori să aflați mai multe?"
    : "Welcome to The Gemini Bistro! I'm here to assist you with everything on our menu—from our fresh appetizers and artisan pastas to prime steaks, seafood, and decadent desserts. What flavor profile are you in the mood for today?";
}

app.post('/api/chat', async (req, res) => {
  const { history, message, language, menuContext } = req.body;
  const languageName = language === 'ro' ? 'Romanian' : 'English';

  if (!ai) {
    return res.json({ text: getCulinaryFallbackResponse(message, language) });
  }

  const systemInstruction = `You are an expert culinary assistant and friendly virtual host for "The Gemini Bistro".
Your goal is to provide an exceptional, personalized experience for our guests.
You MUST respond in the user's language, which is ${languageName}.

**Your Knowledge Base:**
Your knowledge is STRICTLY limited to the menu provided below. Do not invent dishes, ingredients, or prices.

**Your Primary Responsibilities:**
1.  **Answer Questions:** Accurately answer guest questions about our dishes, ingredients, dietary options (vegan, gluten-free), potential allergens, and popular items.
2.  **Provide Personalized Recommendations:** This is your most important task. Explain *why* a dish is a good fit for them. Suggest pairings from our beverage list.
3.  **Handle Off-Topic Inquiries:** If asked about reservations, hours, or location, guide them to the appropriate page or suggest they call us.

**Your Tone:** Enthusiastic, conversational, and helpful. Use descriptive language.
${menuContext || ''}`;

  const conversation = (history || [])
    .map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`)
    .join('\n');
  const fullPrompt = conversation
    ? `${conversation}\nuser: ${message}`
    : `user: ${message}`;

  // Prioritize low-latency high-availability models with automatic fallback
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let generatedText = '';

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: fullPrompt }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });

      if (response && response.text) {
        generatedText = response.text;
        break;
      }
    } catch (err: any) {
      console.warn(`Upstream model ${model} temporarily unavailable: ${err?.message || 'unknown error'}`);
    }
  }

  if (!generatedText) {
    generatedText = getCulinaryFallbackResponse(message, language);
  }

  return res.json({ text: generatedText });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
