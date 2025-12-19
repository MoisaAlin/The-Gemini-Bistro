
import { GoogleGenAI } from "@google/genai";
import { fetchMenu } from './apiService';
import { ChatMessage, MenuItem, Language } from '../types';
import { logError } from './monitoringService';

const MODEL_NAME = 'gemini-3-flash-preview';

// --- Asynchronous Menu Context Initialization ---
let menuContextPromise: Promise<string> | null = null;

const initializeMenuContext = (): Promise<string> => {
  if (menuContextPromise) {
    return menuContextPromise;
  }

  menuContextPromise = new Promise(async (resolve, reject) => {
    try {
      const menuData: MenuItem[] = await fetchMenu();
      const context = `
MENU:
${menuData.map(item => `
- **${item.name}** (${item.category}): ${item.price}
  *Description*: ${item.description}
  *Ingredients*: ${item.ingredients.join(', ')}
  *Tags*: ${item.tags?.join(', ') || 'None'}
`).join('')}
`;
      resolve(context);
    } catch (error) {
      logError(error as Error, { context: "AI Menu Context Initialization" });
      reject("Could not load menu context for AI.");
    }
  });

  return menuContextPromise;
};

export const getAiResponse = async (history: ChatMessage[], newUserMessage: string, language: Language): Promise<string> => {
  // Use API key directly from process.env as per guidelines
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "I'm sorry, the AI kitchen is currently closed (missing API key). Please contact management.";
  }

  try {
    // Instantiate GoogleGenAI right before making the call
    const ai = new GoogleGenAI({ apiKey });
    const menuContext = await initializeMenuContext();
    const languageName = language === 'ro' ? 'Romanian' : 'English';

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
${menuContext}`;

    const conversation = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const fullPrompt = `${conversation}\nuser: ${newUserMessage}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text || "I'm sorry, I couldn't process that request. Could you try asking in a different way?";
  } catch (error: any) {
    logError(error as Error, { context: "getAiResponse" });
    return "I'm having a little trouble thinking of the perfect recommendation right now. Please try again in a moment!";
  }
};
