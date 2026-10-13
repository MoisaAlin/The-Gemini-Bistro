import { fetchMenu } from './apiService';
import { ChatMessage, MenuItem, Language } from '../types';
import { logError } from './monitoringService';

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
  try {
    const menuContext = await initializeMenuContext();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history,
        message: newUserMessage,
        language,
        menuContext,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request. Could you try asking in a different way?";
  } catch (error: any) {
    logError(error as Error, { context: "getAiResponse" });
    return language === 'ro'
      ? "Îmi pare rău, am o mică dificultate în a găsi recomandarea perfectă chiar acum. Vă rugăm să încercați din nou peste un moment!"
      : "I'm having a little trouble thinking of the perfect recommendation right now. Please try again in a moment!";
  }
};
