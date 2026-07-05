import heroImage from "./assets/images/bistro_hero_1783274357884.jpg";
import margheritaImage from "./assets/images/margherita_pizza_1783274371968.jpg";
import burrataImage from "./assets/images/burrata_pizza_1783274387992.jpg";
import footerBgImage from "./assets/images/footer_ingredients_1783274399702.jpg";

// High quality pizza and ambient illustrations
export const IMAGES = {
  hero: heroImage,
  margherita: margheritaImage,
  burrata: burrataImage,
  footerBg: footerBgImage,
};

export const INITIAL_MENU = [
  {
    id: "pizza-1",
    number: 1,
    name: "The plain one",
    description:
      "Classic recipe combining our signature slow-simmered tomato sauce and premium melted mozzarella cheese.",
    ingredients: ["Sauce", "Cheese"],
    category: "classic",
    prices: { small: 600, medium: 800, large: 1200 },
    image: IMAGES.margherita,
  },
  {
    id: "pizza-2",
    number: 2,
    name: "Ham and mushroom",
    description:
      "Savory cured ham arranged side-by-side with evenly distributed fresh forest mushrooms.",
    ingredients: ["Sauce", "Cheese", "Ham", "Mushroom"],
    category: "classic",
    prices: { small: 650, medium: 950, large: 1300 },
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-3",
    number: 3,
    name: "The dream",
    description:
      "Hearty seasoned minced meat coupled with sweet, crisp red bell pepper distributed over our premium cheese base.",
    ingredients: ["Sauce", "Minced meat", "Cheese", "Red pepper"],
    category: "specialty",
    prices: { small: 700, medium: 1020, large: 1380 },
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-4",
    number: 4,
    name: "Onion & Bacon",
    description:
      "Crispy bacon cuts and chopped sweet onions sprinkled over our rich tomato sauce, seasoned minced meat, and golden cheese.",
    ingredients: ["Sauce", "Minced meat", "Onion", "Cheese", "Baconcut"],
    category: "meat",
    prices: { small: 740, medium: 1080, large: 1420 },
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-5",
    number: 5,
    name: "Goodies",
    description:
      "Minced meat, onions, and sweet pineapple chunks. Note: We always squeeze all the juice out of the pineapple before baking!",
    ingredients: ["Sauce", "Minced meat", "Onion", "Cheese", "Pineapple"],
    category: "specialty",
    prices: { small: 720, medium: 1060, large: 1390 },
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-6",
    number: 6,
    name: "Mix",
    description:
      "Spicy pepperoni slices arranged side-by-side over cheese, sprinkled with sweet onions and fresh red bell peppers.",
    ingredients: ["Sauce", "Onion", "Cheese", "Pepperoni", "Red pepper"],
    category: "meat",
    prices: { small: 710, medium: 1040, large: 1360 },
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-7",
    number: 7,
    name: "The Mexican",
    description:
      "Fiesta of flavors! Garlic, spicy chili, marinated beef, tender chicken, sweet corn, and crunch nacho chips pointing down, fully covered with melted cheese.",
    ingredients: [
      "Sauce",
      "Garlic",
      "Nacho chips",
      "Cheese",
      "Chili",
      "Marinated beef",
      "Chicken",
      "Corn",
    ],
    category: "spicy",
    prices: { small: 800, medium: 1200, large: 1500 },
    image:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-8",
    number: 8,
    name: "Beef and bacon",
    description:
      "Rich garlic, premium marinated beef, and smoky bacon cuts evenly sprinkled over our signature cheese base.",
    ingredients: ["Sauce", "Garlic", "Cheese", "Baconcut", "Marinated beef"],
    category: "meat",
    prices: { small: 780, medium: 1160, large: 1480 },
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-9",
    number: 9,
    name: "The marinated one",
    description:
      "A savory masterpiece combining marinated beef, sweet onions, and evenly distributed forest mushrooms over rich cheese.",
    ingredients: ["Sauce", "Onion", "Cheese", "Mushroom", "Marinated beef"],
    category: "meat",
    prices: { small: 760, medium: 1120, large: 1440 },
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-10",
    number: 10,
    name: "Pepperbeef",
    description:
      "Tender seasoned pepper beef, fresh mushrooms, red bell pepper, and onions on top of our signature golden cheese.",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Mushroom",
      "Red pepper",
      "Pepper beef",
    ],
    category: "spicy",
    prices: { small: 790, medium: 1180, large: 1490 },
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-11",
    number: 11,
    name: "Flame",
    description:
      "Spicy taco sauce, seasoned minced meat, special seasoning mix, jalapeños, and crunchy nacho chips pointing down, covered fully in melted cheese.",
    ingredients: [
      "Tacosauce",
      "Minced meat",
      "Seasoning mix",
      "Nacho chips",
      "Cheese",
      "Jalapeño",
    ],
    category: "spicy",
    prices: { small: 770, medium: 1150, large: 1450 },
    image:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-12",
    number: 12,
    name: "Taco chicken",
    description:
      "Zesty taco sauce with marinated chicken, jalapeños, nacho chips pointing down, and seasoning mix under a thick blanket of cheese.",
    ingredients: [
      "Tacosauce",
      "Seasoning mix",
      "Nacho chips",
      "Cheese",
      "Jalapeño",
      "Marinated chicken",
    ],
    category: "spicy",
    prices: { small: 780, medium: 1160, large: 1460 },
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-13",
    number: 13,
    name: "Chef's chicken",
    description:
      "Tender chicken strips, sweet corn, forest mushrooms, and chopped onions distributed evenly over sauce and cheese.",
    ingredients: ["Sauce", "Onion", "Cheese", "Mushroom", "Corn", "Chicken"],
    category: "chicken",
    prices: { small: 750, medium: 1110, large: 1410 },
    image:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-14",
    number: 14,
    name: "Chef's Favorite",
    description:
      "Minced meat, squeezed sweet pineapple, and luxury bacon strips arranged in a star pattern (1 slice on each pizza slice) over cheese.",
    ingredients: [
      "Sauce",
      "Minced meat",
      "Cheese",
      "Pineapple",
      "Luxury bacon",
    ],
    category: "specialty",
    prices: { small: 790, medium: 1190, large: 1490 },
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-15",
    number: 15,
    name: "The spark",
    description:
      "Spicy minced meat, fiery jalapeños, minced garlic, onions, and rich tomato sauce topped with mozzarella.",
    ingredients: [
      "Sauce",
      "Minced meat",
      "Onion",
      "Garlic",
      "Cheese",
      "Jalapeño",
    ],
    category: "spicy",
    prices: { small: 730, medium: 1070, large: 1370 },
    image:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-16",
    number: 16,
    name: "Luxury chicken",
    description:
      "Premium chicken, sweet red pepper, onions, and luxury bacon arranged in a beautiful star pattern (1 slice on each pizza slice).",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Red pepper",
      "Chicken",
      "Luxury bacon",
    ],
    category: "chicken",
    prices: { small: 795, medium: 1195, large: 1495 },
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-17",
    number: 17,
    name: "Chicken farm",
    description:
      "Marinated roasted chicken, fresh tomato slices, spicy chili, and a beautiful grid of fresh basil pesto drawn in squares.",
    ingredients: [
      "Sauce",
      "Tomato",
      "Cheese",
      "Chili",
      "Marinated chicken",
      "Pesto",
    ],
    category: "chicken",
    prices: { small: 760, medium: 1120, large: 1420 },
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-18",
    number: 18,
    name: "The vegan",
    description:
      "A colorful vegetarian delight loaded with squeezed pineapple, mushrooms, sweet corn, red pepper, onions, and sauce.",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Red pepper",
      "Corn",
      "Mushroom",
      "Pineapple",
    ],
    category: "vegetarian",
    prices: { small: 680, medium: 980, large: 1290 },
    image: IMAGES.burrata,
  },
  {
    id: "pizza-19",
    number: 19,
    name: "Kebab Special",
    description:
      "Savory kebab meat, sweet corn, jalapeños, and red onions. Once sliced and boxed, we finish it with a beautiful spiral pattern of kebab dressing.",
    ingredients: [
      "Tacosauce",
      "Cheese",
      "Kebab meat",
      "Corn",
      "Jalapeño",
      "Red onion",
      "Kebab dressing",
    ],
    category: "specialty",
    prices: { small: 790, medium: 1185, large: 1485 },
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-20",
    number: 20,
    name: "Ham & Bacon",
    description:
      "Savory cured ham slices arranged side-by-side, sprinkled with crispy, smoky bacon cuts over mozzarella cheese.",
    ingredients: ["Sauce", "Cheese", "Ham", "Baconcut"],
    category: "meat",
    prices: { small: 730, medium: 1050, large: 1350 },
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-21",
    number: 21,
    name: "Mr. X",
    description:
      "Bold combination of pepperoni slices laid side-by-side, sweet squeezed pineapple, seasoned minced meat, onions, and cheese.",
    ingredients: [
      "Sauce",
      "Minced meat",
      "Onion",
      "Cheese",
      "Pepperoni",
      "Pineapple",
    ],
    category: "specialty",
    prices: { small: 750, medium: 1110, large: 1410 },
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-23",
    number: 23,
    name: "The double decker",
    description:
      "Hearty double-layered recipe loaded with seasoned minced meat, ham slices laid side-by-side, extra cheese, and aromatic oregano.",
    ingredients: ["Sauce", "Minced meat", "Cheese", "Ham", "Oregano"],
    category: "meat",
    prices: { small: 760, medium: 1120, large: 1420 },
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-24",
    number: 24,
    name: "Hot chicken",
    description:
      "Spicy marinated chicken, smoky bacon, and sweet squeezed pineapple over rich melted mozzarella cheese.",
    ingredients: ["Sauce", "Cheese", "Hot chicken", "Bacon", "Pineapple"],
    category: "chicken",
    prices: { small: 770, medium: 1140, large: 1440 },
    image:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-25",
    number: 25,
    name: "Chorizo",
    description:
      "Artisanal chorizo slices laid side-by-side, fresh tomatoes, a grid of basil pesto squares, and aromatic dried oregano.",
    ingredients: ["Sauce", "Tomatoes", "Cheese", "Chorizo", "Pesto", "Oregano"],
    category: "meat",
    prices: { small: 785, medium: 1160, large: 1460 },
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-26",
    number: 26,
    name: "Ham and pineapple",
    description:
      "Gourmet pepperoni slices, classic cured ham arranged side-by-side, and sweet squeezed pineapple over melted cheese.",
    ingredients: ["Sauce", "Pepperoni", "Cheese", "Ham", "Pineapple"],
    category: "specialty",
    prices: { small: 740, medium: 1080, large: 1380 },
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-27",
    number: 27,
    name: "Squash",
    description:
      "Unique and fresh! Thin squash slices, crumbled premium Greek feta cheese, red onions, garlic, and a touch of chili.",
    ingredients: [
      "Sauce",
      "Garlic",
      "Cheese",
      "Squash",
      "Chili",
      "Feta cheese",
      "Red onion",
    ],
    category: "vegetarian",
    prices: { small: 710, medium: 1030, large: 1330 },
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-28",
    number: 28,
    name: "Hottentoppen",
    description:
      "Boldly spicy! Slices of pepperoni, pepper beef, and fresh red bell peppers distributed over cheese and sauce.",
    ingredients: ["Sauce", "Cheese", "Pepperoni", "Pepperbeef", "Red peppers"],
    category: "spicy",
    prices: { small: 780, medium: 1150, large: 1460 },
    image:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-29",
    number: 29,
    name: "BBQ",
    description:
      "Tender pulled pork, smokey baconcut, sweet corn, and red onion over a robust melted cheese and sauce base.",
    ingredients: ["Sauce", "Cheese", "Pork", "Baconcut", "Corn", "Red onion"],
    category: "meat",
    prices: { small: 760, medium: 1120, large: 1420 },
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "pizza-30",
    number: 30,
    name: "GLADFISKEN",
    description:
      "Delicious smoked salmon slices and red onions over cheese, decorated with a grid of thin stripes of fresh green pesto.",
    ingredients: ["Sauce", "Cheese", "Salmon", "Red onion", "Pesto"],
    category: "vegetarian",
    prices: { small: 800, medium: 1200, large: 1500 },
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
  },
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Abdullah Alhamwi",
    rating: 5,
    comment: "review1_comment",
    date: "July 2, 2026",
  },
  {
    id: "rev-2",
    name: "Saral Aljani",
    rating: 5,
    comment: "review2_comment",
    date: "June 28, 2026",
  },
  {
    id: "rev-3",
    name: "Haitham Jlailati",
    rating: 5,
    comment: "review3_comment",
    date: "June 15, 2026",
  },
];

export const CUSTOM_TOPPINGS = [
  { id: "topping-moz", name: "Fresh Mozzarella", price: 60, icon: "🧀" },
  { id: "topping-burrata", name: "Creamy Burrata", price: 120, icon: "🥛" },
  { id: "topping-pep", name: "Premium Pepperoni", price: 80, icon: "🍕" },
  { id: "topping-mush", name: "Forest Mushrooms", price: 50, icon: "🍄" },
  { id: "topping-arugula", name: "Fresh Arugula", price: 40, icon: "🌿" },
  { id: "topping-basil", name: "Sweet Basil", price: 30, icon: "🌱" },
  { id: "topping-pesto", name: "Basil Pesto", price: 50, icon: "🟢" },
  { id: "topping-olive", name: "Kalamata Olives", price: 40, icon: "🫒" },
  { id: "topping-tomato", name: "Cherry Tomatoes", price: 50, icon: "🍅" },
];
