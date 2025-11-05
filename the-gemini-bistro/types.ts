export interface MenuItem {
  name: string;
  category: 'Appetizers' | 'Main Courses' | 'Desserts' | 'Beverages';
  price: string;
  description: string;
  ingredients: string[];
  tags?: ('vegan' | 'gluten-free' | 'spicy' | "chef's recommendation")[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  source: string;
  rating: number;
}
