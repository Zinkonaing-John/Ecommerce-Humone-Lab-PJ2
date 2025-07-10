const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "./.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or service key");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: "Apple MacBook Air M3",
    description:
      "Ultra-portable laptop with M3 chip, 13.6-inch Liquid Retina display, and up to 18 hours battery life.",
    price: 1099.0,
    image: "/images/product1.jpg",
    category: "Electronics",
  },
  {
    name: "Sony WH-1000XM5 Noise-Cancelling Headphones",
    description:
      "Industry-leading noise cancellation with crystal-clear call quality and comfortable design.",
    price: 348.0,
    image: "/images/product2.jpg",
    category: "Electronics",
  },
  {
    name: "Levi's 501 Original Fit Jeans",
    description:
      "The original blue jean since 1873. A cultural icon, worn by generations.",
    price: 79.5,
    image: "/images/product3.jpg",
    category: "Apparel",
  },
  {
    name: "Hydro Flask 32 oz Wide Mouth Bottle",
    description:
      "Keeps drinks cold for 24 hours, hot for 12. Perfect for outdoor adventures.",
    price: 49.95,
    image: "/images/product4.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description:
      "Combines 7 appliances in one: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    price: 99.99,
    image: "/images/product5.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Nintendo Switch OLED Model",
    description:
      "Vibrant 7-inch OLED screen, a wide adjustable stand, a wired LAN port, and 64 GB of internal storage.",
    price: 349.99,
    image: "/images/product6.jpg",
    category: "Gaming",
  },
  {
    name: "Allbirds Wool Runners",
    description:
      "Comfortable, sustainable shoes made with ZQ Merino wool. Lightweight and breathable.",
    price: 110.0,
    image: "/images/product7.jpg",
    category: "Apparel",
  },
  {
    name: "Kindle Paperwhite",
    description:
      "Thin, lightweight, and travels easily so you can enjoy your favorite books at any time.",
    price: 139.99,
    image: "/images/product8.jpg",
    category: "Electronics",
  },
  {
    name: "Dyson V11 Animal Cordless Vacuum",
    description:
      "Powerful suction for whole-home cleaning. Intelligently optimizes power and run time.",
    price: 599.99,
    image: "/images/product9.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "GoPro HERO11 Black",
    description:
      "Unbelievable image quality and HyperSmooth 5.0 video stabilization.",
    price: 399.99,
    image: "/images/product10.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description:
      "An iconic mouse, remastered. Now with Quiet Clicks and 8K DPI tracking.",
    price: 99.99,
    image: "/images/product11.jpg",
    category: "Computer Accessories",
  },
  {
    name: "Samsung 55-inch QLED 4K Smart TV",
    description:
      "Experience a billion shades of color with Quantum Dot. Smart TV powered by Tizen.",
    price: 899.99,
    image: "/images/product12.jpg",
    category: "Electronics",
  },
  {
    name: "Columbia Men's Watertight II Jacket",
    description:
      "Lightweight and waterproof, perfect for rainy days and outdoor activities.",
    price: 75.0,
    image: "/images/product13.jpg",
    category: "Apparel",
  },
  {
    name: "Coleman Sundome Tent (4-Person)",
    description:
      "Easy to set up, great for camping trips. WeatherTec system keeps you dry.",
    price: 120.0,
    image: "/images/product14.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "KitchenAid Artisan Stand Mixer",
    description:
      "Tilt-head design for clear access to the bowl. 10 speeds for nearly any task.",
    price: 429.0,
    image: "/images/product15.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "PlayStation 5 Console",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    price: 499.99,
    image: "/images/product16.jpg",
    category: "Gaming",
  },
  {
    name: "Google Nest Hub Max",
    description:
      "The smart display that helps your busy family stay in touch and on track.",
    price: 229.0,
    image: "/images/product17.jpg",
    category: "Smart Home",
  },
  {
    name: "Fitbit Charge 6",
    description:
      "Advanced fitness tracker with built-in GPS, heart rate tracking, and Google apps.",
    price: 159.95,
    image: "/images/product18.jpg",
    category: "Wearable Tech",
  },
  {
    name: "LEGO Technic Bugatti Chiron",
    description:
      "A stunning 1:8 scale replica of the iconic supercar, with intricate details.",
    price: 349.99,
    image: "/images/product19.jpg",
    category: "Toys & Games",
  },
  {
    name: "Bose QuietComfort Earbuds II",
    description:
      "World-class noise cancellation and custom-tuned sound for immersive audio.",
    price: 279.0,
    image: "/images/product20.jpg",
    category: "Audio",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "The ultimate smartphone experience with AI features, a stunning display, and a powerful camera system.",
    price: 1299.0,
    image: "/images/product21.jpg",
    category: "Electronics",
  },
  {
    name: "Anker Portable Power Bank",
    description:
      "High-capacity portable charger for phones and tablets. Fast charging technology.",
    price: 45.99,
    image: "/images/product22.jpg",
    category: "Computer Accessories",
  },
  {
    name: "Patagonia Better Sweater Fleece Jacket",
    description:
      "Warm, low-bulk fleece jacket made of 100% recycled polyester.",
    price: 149.0,
    image: "/images/product23.jpg",
    category: "Apparel",
  },
  {
    name: "Osprey Talon 22 Hiking Backpack",
    description:
      "Lightweight and versatile, perfect for day hikes and quick adventures.",
    price: 130.0,
    image: "/images/product24.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "Ninja Foodi 6-in-1 8-qt. 2-Basket Air Fryer",
    description:
      "Two independent baskets let you cook two foods two ways at the same time.",
    price: 179.99,
    image: "/images/product25.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Xbox Series X",
    description:
      "The fastest, most powerful Xbox ever. Experience 4K gaming at up to 120 frames per second.",
    price: 499.99,
    image: "/images/product26.jpg",
    category: "Gaming",
  },
  {
    name: "Philips Hue White and Color Ambiance Starter Kit",
    description:
      "Smart lighting for your home. Control with your voice or smart device.",
    price: 199.99,
    image: "/images/product27.jpg",
    category: "Smart Home",
  },
  {
    name: "Apple Watch Series 9",
    description: "A powerful way to stay connected, active, healthy, and safe.",
    price: 399.0,
    image: "/images/product28.jpg",
    category: "Wearable Tech",
  },
  {
    name: "Catan Board Game",
    description:
      "A strategy game where players collect resources and build settlements.",
    price: 49.0,
    image: "/images/product29.jpg",
    category: "Toys & Games",
  },
  {
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    description: "Bold sound for every adventure. Waterproof and dustproof.",
    price: 129.95,
    image: "/images/product30.jpg",
    category: "Audio",
  },
  {
    name: "Instant Camera (Fujifilm Instax Mini 12)",
    description:
      "Capture and print instant photos. Features automatic exposure and easy-to-use controls.",
    price: 79.95,
    image: "/images/product31.jpg",
    category: "Photography",
  },
  {
    name: "Beginner Acoustic Guitar Kit",
    description:
      "Full-size acoustic guitar with gig bag, tuner, picks, and strap. Perfect for aspiring musicians.",
    price: 149.0,
    image: "/images/product32.jpg",
    category: "Musical Instruments",
  },
  {
    name: "Yoga Mat (Manduka PROlite)",
    description:
      "Lightweight, durable, and non-slip yoga mat. Provides excellent support and cushioning.",
    price: 85.0,
    image: "/images/product33.jpg",
    category: "Fitness",
  },
  {
    name: "Electric Toothbrush (Oral-B iO Series 9)",
    description:
      "Revolutionary magnetic iO technology for a professional clean feeling every day.",
    price: 299.99,
    image: "/images/product34.jpg",
    category: "Health & Personal Care",
  },
  {
    name: "Board Game (Ticket to Ride)",
    description:
      "A strategy game where players collect resources and build settlements.",
    price: 54.99,
    image: "/images/product35.jpg",
    category: "Toys & Games",
  },
  {
    name: "Smart Water Bottle (HidrateSpark PRO)",
    description: "Tracks your water intake and glows to remind you to drink.",
    price: 69.99,
    image: "/images/product36.jpg",
    category: "Smart Home",
  },
  {
    name: "Noise-Cancelling Earbuds (Apple AirPods Pro 2)",
    description:
      "Active Noise Cancellation, Transparency mode, and Spatial Audio with dynamic head tracking.",
    price: 249.0,
    image: "/images/product37.jpg",
    category: "Audio",
  },
  {
    name: "Gaming Headset (HyperX Cloud II)",
    description: "Durable, comfortable, and delivers great sound for gaming.",
    price: 99.99,
    image: "/images/product38.jpg",
    category: "Gaming",
  },
  {
    name: "Smartwatch (Garmin Forerunner 965)",
    description:
      "Advanced GPS running and triathlon smartwatch with a vibrant AMOLED display.",
    price: 599.99,
    image: "/images/product39.jpg",
    category: "Wearable Tech",
  },
  {
    name: "Portable Projector (XGIMI MoGo 2 Pro)",
    description:
      "Compact and powerful portable projector with 1080p resolution and built-in Android TV.",
    price: 599.0,
    image: "/images/product40.jpg",
    category: "Electronics",
  },
  {
    name: "Espresso Machine (Breville Barista Express Impress)",
    description:
      "Achieve the perfect dose and a precise tamp with the intelligent dosing system.",
    price: 799.95,
    image: "/images/product41.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Hiking Boots (Merrell Moab 3 Mid Waterproof)",
    description:
      "Comfortable, durable, and waterproof hiking boots for all-terrain adventures.",
    price: 140.0,
    image: "/images/product42.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "Smart Home Security Camera (Arlo Pro 4)",
    description:
      "2K HDR video, 160-degree view, integrated spotlight, and color night vision.",
    price: 199.99,
    image: "/images/product43.jpg",
    category: "Smart Home",
  },
  {
    name: "Electric Scooter (Segway Ninebot MAX G2)",
    description:
      "Long range, powerful motor, and comfortable ride for urban commuting.",
    price: 999.0,
    image: "/images/product44.jpg",
    category: "Outdoor Gear",
  },
  {
    name: "Robot Vacuum (Roomba j7+)",
    description:
      "Empties itself for up to 60 days. Avoids obstacles like pet waste and charging cords.",
    price: 799.0,
    image: "/images/product45.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Digital Drawing Tablet (Wacom Intuos Pro)",
    description:
      "Professional-grade pen tablet for digital art, design, and photo editing.",
    price: 379.95,
    image: "/images/product46.jpg",
    category: "Computer Accessories",
  },
  {
    name: "Smart Scale (Withings Body+)",
    description:
      "Full body composition analysis (weight, body fat, muscle mass, bone mass, water) with Wi-Fi sync.",
    price: 99.95,
    image: "/images/product47.jpg",
    category: "Health & Personal Care",
  },
  {
    name: "Portable Bluetooth Speaker (UE Boom 3)",
    description:
      "Super-portable wireless speaker with 360° sound, deep bass, and IP67 waterproof/dustproof rating.",
    price: 149.99,
    image: "/images/product48.jpg",
    category: "Audio",
  },
  {
    name: "Digital Camera (Canon EOS R100)",
    description:
      "Compact and lightweight mirrorless camera with 24.2MP APS-C sensor and 4K video.",
    price: 499.99,
    image: "/images/product49.jpg",
    category: "Photography",
  },
  {
    name: "Electric Guitar (Fender Player Stratocaster)",
    description:
      "Classic electric guitar with a comfortable modern C-shaped neck and three single-coil pickups.",
    price: 799.99,
    image: "/images/product50.jpg",
    category: "Musical Instruments",
  },
  {
    name: "Running Shoes (Brooks Ghost 15)",
    description:
      "Soft cushioning, smooth transitions, and lightweight design for daily runs.",
    price: 140.0,
    image: "/images/product51.jpg",
    category: "Fitness",
  },
  {
    name: "Air Purifier (Coway Airmega 200M)",
    description:
      "Captures 99.999% of ultrafine particles, including allergens, pollutants, and volatile organic compounds.",
    price: 229.0,
    image: "/images/product52.jpg",
    category: "Home & Kitchen",
  },
];

const seedDB = async () => {
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", 0);
  if (deleteError) {
    console.error("Error deleting data:", deleteError);
    return;
  }

  const { error: insertError } = await supabase
    .from("products")
    .insert(products);
  if (insertError) {
    console.error("Error inserting data:", insertError);
    return;
  }

  console.log("Database seeded!");
};

seedDB();
