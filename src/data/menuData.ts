export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'main' | 'drinks' | 'desserts';
  isVeg: boolean;
  image: string;
  rating: number;
  preparationTime: string;
}

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: '1',
    name: 'Crispy Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil, and olive oil',
    price: 8.99,
    category: 'starters',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
    rating: 4.5,
    preparationTime: '10 mins'
  },
  {
    id: '2',
    name: 'Garlic Prawns',
    description: 'Succulent prawns sautéed in garlic butter and herbs',
    price: 14.99,
    category: 'starters',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop',
    rating: 4.8,
    preparationTime: '15 mins'
  },
  {
    id: '3',
    name: 'Stuffed Mushrooms',
    description: 'Button mushrooms filled with herbed cream cheese',
    price: 9.99,
    category: 'starters',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&h=300&fit=crop',
    rating: 4.3,
    preparationTime: '12 mins'
  },
  {
    id: '4',
    name: 'Chicken Wings',
    description: 'Crispy buffalo wings with blue cheese dipping sauce',
    price: 12.99,
    category: 'starters',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1608039829572-45efa81c42eb?w=400&h=300&fit=crop',
    rating: 4.6,
    preparationTime: '18 mins'
  },
  // Main Courses
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
    price: 26.99,
    category: 'main',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    rating: 4.9,
    preparationTime: '25 mins'
  },
  {
    id: '6',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    price: 18.99,
    category: 'main',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    rating: 4.7,
    preparationTime: '22 mins'
  },
  {
    id: '7',
    name: 'Beef Tenderloin',
    description: 'Prime cut steak with red wine reduction and mashed potatoes',
    price: 34.99,
    category: 'main',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    rating: 4.9,
    preparationTime: '30 mins'
  },
  {
    id: '8',
    name: 'Vegetable Pasta',
    description: 'Fresh pasta with seasonal vegetables in marinara sauce',
    price: 16.99,
    category: 'main',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop',
    rating: 4.4,
    preparationTime: '20 mins'
  },
  {
    id: '9',
    name: 'Lamb Shank',
    description: 'Slow-braised lamb with rosemary and root vegetables',
    price: 29.99,
    category: 'main',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.8,
    preparationTime: '35 mins'
  },
  // Drinks
  {
    id: '10',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with mint and honey',
    price: 4.99,
    category: 'drinks',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
    rating: 4.5,
    preparationTime: '5 mins'
  },
  {
    id: '11',
    name: 'Mango Smoothie',
    description: 'Tropical mango blended with yogurt and honey',
    price: 6.99,
    category: 'drinks',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
    rating: 4.6,
    preparationTime: '5 mins'
  },
  {
    id: '12',
    name: 'Espresso',
    description: 'Rich Italian espresso with perfect crema',
    price: 3.99,
    category: 'drinks',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    rating: 4.7,
    preparationTime: '3 mins'
  },
  // Desserts
  {
    id: '13',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with mascarpone and espresso',
    price: 9.99,
    category: 'desserts',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    rating: 4.9,
    preparationTime: '10 mins'
  },
  {
    id: '14',
    name: 'Chocolate Fondant',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 11.99,
    category: 'desserts',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
    rating: 4.8,
    preparationTime: '15 mins'
  },
  {
    id: '15',
    name: 'Crème Brûlée',
    description: 'Classic French vanilla custard with caramelized sugar top',
    price: 8.99,
    category: 'desserts',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop',
    rating: 4.7,
    preparationTime: '12 mins'
  },
  {
    id: '16',
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 10.99,
    category: 'desserts',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    rating: 4.6,
    preparationTime: '8 mins'
  },
];

export const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'starters', name: 'Starters', icon: '🥗' },
  { id: 'main', name: 'Main Course', icon: '🍝' },
  { id: 'drinks', name: 'Drinks', icon: '🍹' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: 100 },
  { id: 'budget', label: 'Under $10', min: 0, max: 10 },
  { id: 'mid', label: '$10 - $20', min: 10, max: 20 },
  { id: 'premium', label: '$20 - $30', min: 20, max: 30 },
  { id: 'luxury', label: 'Above $30', min: 30, max: 100 },
];
