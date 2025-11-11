import { GoogleGenAI } from "@google/genai";
import { fetchMenu } from './apiService';
import { ChatMessage, MenuItem, Language } from '../types';
import { logError } from './monitoringService';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A more user-friendly message for the demo environment.
  console.warn("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

// --- Asynchronous Menu Context Initialization ---
let menuContextPromise: Promise<string> | null = null;

const initializeMenuContext = (): Promise<string> => {
  if (menuContextPromise) {
    return menuContextPromise;
  }

  menuContextPromise = new Promise(async (resolve, reject) => {
    try {
      console.log("AI Service: Initializing menu context...");
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
      console.log("AI Service: Menu context initialized successfully.");
      resolve(context);
    } catch (error) {
      console.error("AI Service: Failed to initialize menu context:", error);
      logError(error as Error, { context: "AI Menu Context Initialization" });
      reject("Could not load menu context for AI.");
    }
  });

  return menuContextPromise;
};
// --- End of Context Initialization ---


export const getAiResponse = async (history: ChatMessage[], newUserMessage: string, language: Language): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, my connection to the kitchen is currently offline. Please configure the API key to chat.";
  }

  try {
    const menuContext = await initializeMenuContext();
    const languageName = language === 'ro' ? 'Romanian' : 'English';

    const systemInstruction = `You are an expert culinary assistant and friendly virtual host for "The Gemini Bistro".
Your goal is to provide an exceptional, personalized experience for our guests.
You MUST respond in the user's language, which is ${languageName}.

**Your Knowledge Base:**
Your knowledge is STRICTLY limited to the menu provided below. Do not invent dishes, ingredients, or prices.

**Your Primary Responsibilities:**
1.  **Answer Questions:** Accurately answer guest questions about our dishes, ingredients, dietary options (vegan, gluten-free), potential allergens, and popular items.
2.  **Provide Personalized Recommendations:** This is your most important task.
    - If a guest is unsure what to order, ask clarifying questions to understand their preferences (e.g., "Are you in the mood for something light or hearty?", "Do you enjoy spicy food?", "Are you looking for a vegetarian option?").
    - Based on their answers, provide thoughtful and descriptive recommendations from the menu. Explain *why* a dish is a good fit for them.
    - Proactively suggest pairings from our beverage list where it makes sense. For example, you can mention how a dish might go well with our 'Tuscan Sunset' cocktail.
3.  **Handle Off-Topic Inquiries:** If asked about topics outside the menu (like reservations, hours, location), politely state that you can only assist with the menu and guide them to the appropriate page on our website or to call the restaurant for more information.

**Your Tone:**
Be enthusiastic, conversational, and helpful. Use descriptive language to make the dishes sound appealing. Keep your answers concise but informative.
${menuContext}`;

    const conversation = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const fullPrompt = `${conversation}\nuser: ${newUserMessage}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    logError(error as Error, { context: "getAiResponse" });
    return "I'm sorry, I'm having a little trouble connecting to the kitchen's knowledge base. Please try again in a moment.";
  }
};
