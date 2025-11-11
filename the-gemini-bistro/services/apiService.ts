import { MenuItem, Reservation, Testimonial } from '../types';
import { logError } from './monitoringService';

// This file simulates a backend API with an in-memory database. 
// Data will reset on page refresh. In a real application, these functions
// would make network requests to a persistent database.

let MENU_DATA: MenuItem[] = [
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

let TESTIMONIALS_DATA: Testimonial[] = [
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

let RESERVATIONS_DATA: Reservation[] = [];

const MOCK_API_DELAY = 500;

// --- Menu CRUD ---
export const fetchMenu = (): Promise<MenuItem[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...MENU_DATA]), MOCK_API_DELAY));
};

export const addMenuItem = (item: Omit<MenuItem, 'tags'> & { tags: string[] }): Promise<MenuItem> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newItem: MenuItem = {
        ...item,
        tags: item.tags as MenuItem['tags']
      };
      MENU_DATA.push(newItem);
      resolve(newItem);
    }, MOCK_API_DELAY);
  });
};

export const updateMenuItem = (updatedItem: Omit<MenuItem, 'tags'> & { tags: string[] }): Promise<MenuItem> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MENU_DATA.findIndex(item => item.name === updatedItem.name);
            if (index !== -1) {
                const newItem: MenuItem = {
                    ...updatedItem,
                    tags: updatedItem.tags as MenuItem['tags']
                };
                MENU_DATA[index] = newItem;
                resolve(newItem);
            } else {
                const error = new Error("Menu item not found for update");
                logError(error, { itemName: updatedItem.name });
                reject(error);
            }
        }, MOCK_API_DELAY);
    });
};

export const deleteMenuItem = (itemName: string): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      MENU_DATA = MENU_DATA.filter(item => item.name !== itemName);
      resolve({ success: true });
    }, MOCK_API_DELAY);
  });
};


// --- Testimonials CRUD ---
export const fetchTestimonials = (): Promise<Testimonial[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...TESTIMONIALS_DATA]), MOCK_API_DELAY + 200));
};

// ... Add/update/delete for testimonials can be added here following the menu item pattern


// --- Reservations ---
interface ReservationRequestData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests: string;
}

export const submitReservation = (formData: ReservationRequestData): Promise<{ success: boolean; message: string }> => {
  console.log('API: Submitting reservation...', formData);
  return new Promise(resolve => {
    setTimeout(() => {
      if (formData.name.toLowerCase().includes('fail')) {
        console.error('API: Reservation submission failed.');
        resolve({ success: false, message: 'Our apologies. We were unable to process your reservation at this time. Please call us directly.' });
      } else {
        const newReservation: Reservation = {
          id: Date.now(),
          status: 'Pending',
          ...formData
        };
        RESERVATIONS_DATA.push(newReservation);
        console.log('API: Reservation submitted successfully.', newReservation);
        resolve({ success: true, message: 'Your reservation request has been sent.' });
      }
    }, MOCK_API_DELAY + 500);
  });
};

export const fetchReservations = (): Promise<Reservation[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...RESERVATIONS_DATA]), MOCK_API_DELAY));
};

export const updateReservationStatus = (id: number, status: Reservation['status']): Promise<Reservation> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const reservation = RESERVATIONS_DATA.find(r => r.id === id);
            if (reservation) {
                reservation.status = status;
                resolve(reservation);
            } else {
                const error = new Error("Reservation not found for status update");
                logError(error, { reservationId: id });
                reject(error);
            }
        }, MOCK_API_DELAY);
    });
};
