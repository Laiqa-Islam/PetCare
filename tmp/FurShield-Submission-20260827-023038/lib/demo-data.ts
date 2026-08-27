export const careCategories = ["Feeding", "Hygiene", "Exercise", "Health", "Training"];

export type CareArticle={slug:string;category:string;title:string;summary:string;meta:string;tone:string;mediaType:"article"|"video"|"faq";body?:string[];faqs?:{q:string;a:string}[];mediaUrl?:string;source?:string};
export const careArticles:CareArticle[] = [
  { slug: "reading-a-pet-food-label", category: "Feeding", title: "How to read a pet food label", summary: "A practical guide to ingredients, portions, and choosing food for your pet's life stage.", meta: "6 min read", tone: "mint", mediaType:"article", body:["Start with the species and life-stage statement rather than the package artwork. Check the feeding guide against your pet's current weight and body condition, then measure portions consistently.","Introduce a new food gradually and keep notes on appetite, stool, skin, and energy. A veterinarian should guide therapeutic diets or any change for a pet with an ongoing condition."] },
  { slug: "low-stress-grooming", category: "Hygiene", title: "Low-stress grooming at home", summary: "Build a calm routine for brushing, nail care, bathing, and coat checks.", meta: "4 min read", tone: "peach", mediaType:"article", body:["Choose a quiet surface with good footing. Begin with a few seconds of touch, reward calm behavior, and stop before your pet becomes distressed.","Check skin, ears, paws, coat, and nails as you work. Pain, swelling, discharge, strong odor, or sudden sensitivity needs veterinary attention."] },
  { slug: "daily-enrichment", category: "Exercise", title: "Daily enrichment beyond walks", summary: "Simple games that support movement, confidence, and natural behavior.", meta: "5 min read", tone: "blue", mediaType:"article", body:["Rotate sniffing games, food puzzles, gentle training, safe climbing, and species-appropriate play. Short sessions spread through the day are often easier to sustain.","Match activity to age, mobility, weather, and medical advice. Enrichment should invite participation rather than force it."] },
  { slug: "vaccination-basics", category: "Health", title: "Vaccination basics by life stage", summary: "Understand common schedules and the questions to take to your veterinarian.", meta: "FAQ · 4 answers", tone: "lavender", mediaType:"faq", faqs:[{q:"Why do schedules vary?",a:"Species, age, health, prior vaccines, local disease risk, and product guidance all affect timing."},{q:"What should I bring to the visit?",a:"Bring prior certificates, medication details, allergy history, and any recent change in behavior or appetite."},{q:"What reactions should I watch for?",a:"Ask your veterinarian about expected mild effects and the urgent signs that require immediate care."},{q:"How can FurShield help?",a:"Store each certificate and add the next due date so it appears with your reminders."}] },
  { slug: "healthy-aging-mobility", category: "Exercise", title: "Healthy aging and mobility in dogs", summary: "A veterinary discussion of movement, early intervention, and supportive care across life stages.", meta: "Video · 40 min", tone: "yellow", mediaType:"video", mediaUrl:"https://www.youtube.com/embed/5dmvkFlv2Ac", source:"Cornell University College of Veterinary Medicine" },
  { slug: "senior-pet-checklist", category: "Health", title: "A weekly senior pet check-in", summary: "Notice changes early with a gentle nose-to-tail home observation routine.", meta: "7 min read", tone: "mint", mediaType:"article", body:["Record appetite, water intake, movement, sleep, toileting, coat, breathing, and social behavior at the same time each week.","A trend is more useful than a single observation. Share the timeline with your veterinarian and seek prompt help for sudden or severe changes."] },
];

export const products = [
  { id: "p1", name: "Sensitive tummy meal", category: "Food", price: 24.5, rating: 4.8, stock: 18, pet: "Dog", accent: "#dbeee7" },
  { id: "p2", name: "Cloud-soft slicker brush", category: "Grooming", price: 16, rating: 4.7, stock: 32, pet: "Cat", accent: "#f6dfcf" },
  { id: "p3", name: "Treat puzzle pebble", category: "Toys", price: 12.75, rating: 4.9, stock: 21, pet: "Dog", accent: "#dce8f5" },
  { id: "p4", name: "Joint support chews", category: "Health", price: 19.25, rating: 4.6, stock: 14, pet: "Dog", accent: "#eee6f6" },
  { id: "p5", name: "Breakaway moon collar", category: "Accessories", price: 11.5, rating: 4.8, stock: 40, pet: "Cat", accent: "#f7ebc9" },
  { id: "p6", name: "Click-and-learn trainer", category: "Training", price: 8.5, rating: 4.5, stock: 27, pet: "All pets", accent: "#dbeee7" },
];

export const adoptablePets = [
  { id: "a1", name: "Miso", species: "Cat", breed: "Domestic shorthair", age: "2 years", gender: "Female", location: "Clifton", health: "Vaccinated", color: "#d9e9e3" },
  { id: "a2", name: "Bruno", species: "Dog", breed: "Labrador mix", age: "3 years", gender: "Male", location: "Gulshan", health: "Health checked", color: "#f0ddcb" },
  { id: "a3", name: "Pip", species: "Bird", breed: "Cockatiel", age: "1 year", gender: "Unknown", location: "DHA", health: "Ready to adopt", color: "#eee8cf" },
  { id: "a4", name: "Luna", species: "Cat", breed: "Persian mix", age: "4 years", gender: "Female", location: "North Nazimabad", health: "Special diet", color: "#e7e0ee" },
];

export const vets = [
  { id: "v1", name: "Dr. Sana Malik", specialty: "Small animal medicine", experience: 9, location: "Clifton", rating: 4.9, next: "Today, 4:30 PM" },
  { id: "v2", name: "Dr. Adeel Raza", specialty: "Dermatology & allergies", experience: 7, location: "DHA", rating: 4.8, next: "Tomorrow, 10:00 AM" },
  { id: "v3", name: "Dr. Hira Noor", specialty: "Avian & exotic care", experience: 11, location: "Gulshan", rating: 4.9, next: "Thu, 2:15 PM" },
];
