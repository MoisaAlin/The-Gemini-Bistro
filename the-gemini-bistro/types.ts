
export interface MenuItem {
  name: string;
  category: 'Appetizers' | 'Main Courses' | 'Desserts' | 'Beverages';
  price: string;
  description: string;
  ingredients: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
