import { MenuItem, Testimonial } from './types';

export const MENU_DATA: MenuItem[] = [
  {
    name: 'Bruschetta al Pomodoro',
    category: 'Appetizers',
    price: '$12',
    description: 'Grilled sourdough bread topped with fresh tomatoes, garlic, basil, and a drizzle of extra virgin olive oil.',
    ingredients: ['Sourdough bread', 'Tomatoes', 'Garlic', 'Basil', 'Olive oil', 'Salt', 'Pepper'],
    tags: ['vegan']
  },
  {
    name: 'Calamari Fritti',
    category: 'Appetizers',
    price: '$16',
    description: 'Lightly battered and fried squid served with a spicy marinara sauce and a lemon wedge.',
    ingredients: ['Squid', 'Flour', 'Cornstarch', 'Spices', 'Marinara sauce', 'Lemon'],
    tags: ['spicy']
  },
  {
    name: 'Spaghetti Carbonara',
    category: 'Main Courses',
    price: '$24',
    description: 'A classic Roman pasta dish with pancetta, egg yolks, pecorino cheese, and a generous amount of black pepper.',
    ingredients: ['Spaghetti', 'Pancetta', 'Egg yolks', 'Pecorino Romano cheese', 'Black pepper'],
    tags: ["chef's recommendation"]
  },
  {
    name: 'Filet Mignon',
    category: 'Main Courses',
    price: '$45',
    description: 'An 8oz center-cut filet, perfectly seasoned and seared, served with roasted asparagus and a red wine reduction sauce.',
    ingredients: ['Filet Mignon', 'Asparagus', 'Red wine', 'Beef broth', 'Butter', 'Herbs'],
    tags: ['gluten-free', "chef's recommendation"]
  },
  {
    name: 'Salmon Al Forno',
    category: 'Main Courses',
    price: '$32',
    description: 'Oven-baked Atlantic salmon fillet with a lemon-dill crust, served over a bed of quinoa and seasonal vegetables.',
    ingredients: ['Salmon', 'Lemon', 'Dill', 'Breadcrumbs', 'Quinoa', 'Seasonal vegetables'],
    tags: ['gluten-free']
  },
  {
    name: 'Tiramisu',
    category: 'Desserts',
    price: '$10',
    description: 'Layers of coffee-soaked ladyfingers and a rich, creamy mascarpone cheese mixture, dusted with cocoa powder.',
    ingredients: ['Ladyfingers', 'Espresso', 'Mascarpone cheese', 'Eggs', 'Sugar', 'Cocoa powder']
  },
  {
    name: 'Panna Cotta',
    category: 'Desserts',
    price: '$9',
    description: 'A silky smooth Italian custard served with a fresh berry coulis.',
    ingredients: ['Heavy cream', 'Sugar', 'Gelatin', 'Vanilla bean', 'Mixed berries'],
    tags: ['gluten-free']
  },
  {
    name: 'Tuscan Sunset',
    category: 'Beverages',
    price: '$14',
    description: 'A signature cocktail with Aperol, prosecco, and a splash of blood orange juice.',
    ingredients: ['Aperol', 'Prosecco', 'Blood orange juice'],
    tags: ['vegan', 'gluten-free']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    quote: "The best Carbonara I've had outside of Rome. The ambiance is perfect for a date night. We'll be back for sure!",
    name: 'Alexandra P.',
    source: 'Google Review',
    rating: 5,
  },
  {
    quote: "An absolute gem! From the 'Tuscan Sunset' cocktail to the Filet Mignon, every single detail was impeccable. The service was top-notch.",
    name: 'David L.',
    source: 'Google Review',
    rating: 5,
  },
  {
    quote: "A truly memorable dining experience. The Panna Cotta was divine, and the chef's passion is evident in every dish. Highly recommended.",
    name: 'Maria S.',
    source: 'Google Review',
    rating: 5,
  }
];
