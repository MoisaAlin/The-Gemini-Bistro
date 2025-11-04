
import { GoogleGenAI } from "@google/genai";
import { MENU_DATA } from '../constants';
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A more user-friendly message for the demo environment.
  console.warn("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

// Stringify menu data once to be reused in prompts
const menuContext = `
MENU:
${MENU_DATA.map(item => `
- **${item.name}** (${item.category}): ${item.price}
  *Description*: ${item.description}
  *Ingredients*: ${item.ingredients.join(', ')}
`).join('')}
`;

const systemInstruction = `You are a helpful and friendly virtual host for "The Gemini Bistro". 
Your knowledge is based ONLY on the menu provided below. 
Answer customer questions about dishes, ingredients, dietary restrictions (like vegan, gluten-free), allergens, and popular items. 
Be enthusiastic, descriptive, and concise. 
If asked about topics outside the menu (like reservations, hours, location), politely guide them to the appropriate page or to call the restaurant. 
Do not invent dishes or ingredients.
${menuContext}`;


export const getAiResponse = async (history: ChatMessage[], newUserMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, my connection to the kitchen is currently offline. Please configure the API key to chat.";
  }

  const conversation = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
  const fullPrompt = `${conversation}\nuser: ${newUserMessage}`;

  try {
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
    return "I'm sorry, I'm having a little trouble connecting to the kitchen's knowledge base. Please try again in a moment.";
  }
};
