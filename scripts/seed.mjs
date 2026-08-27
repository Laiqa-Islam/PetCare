import mongoose from "mongoose";
import { hash } from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

await mongoose.connect(uri, { dbName: "furshield" });
const db = mongoose.connection.db;
const now = new Date();
const passwordHash = await hash("FurShield123!", 12);
const daysFromNow = (days, hour = 10) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};
const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
const externalImage = (id, caption) => ({ url: pexels(id), publicId: `external:pexels-${id}`, caption });

async function upsert(collection, filter, data) {
  await db.collection(collection).updateOne(filter, { $set: { ...data, updatedAt: now }, $setOnInsert: { createdAt: now } }, { upsert: true });
  return db.collection(collection).findOne(filter);
}
async function user(email, data) {
  return upsert("users", { email }, { ...data, email, passwordHash, verified: true });
}

const accounts = {};
accounts.ayesha = await user("owner@furshield.test", { role: "owner", name: "Ayesha Khan", phone: "+92 300 555 0101", address: "Clifton, Karachi", location: { city: "Karachi" } });
accounts.hira = await user("owner2@furshield.test", { role: "owner", name: "Hira Qureshi", phone: "+92 301 555 0104", address: "DHA Phase 6, Karachi", location: { city: "Karachi" } });
accounts.omar = await user("owner3@furshield.test", { role: "owner", name: "Omar Siddiqui", phone: "+92 302 555 0105", address: "PECHS, Karachi", location: { city: "Karachi" } });
accounts.sana = await user("vet@furshield.test", { role: "vet", name: "Dr. Sana Malik", phone: "+92 300 555 0102", address: "Clifton, Karachi", location: { city: "Karachi" }, specialization: ["Small animal medicine", "Preventive care"], experienceYears: 9, availability: [{ day: "Monday", start: "09:00", end: "17:00" }, { day: "Wednesday", start: "10:00", end: "18:00" }], rating: 4.9, reviewCount: 28 });
accounts.adeel = await user("vet.derm@furshield.test", { role: "vet", name: "Dr. Adeel Raza", phone: "+92 303 555 0106", address: "DHA, Karachi", location: { city: "Karachi" }, specialization: ["Dermatology", "Allergy care"], experienceYears: 7, availability: [{ day: "Tuesday", start: "11:00", end: "19:00" }, { day: "Saturday", start: "09:00", end: "14:00" }], rating: 4.8, reviewCount: 19 });
accounts.noor = await user("vet.exotic@furshield.test", { role: "vet", name: "Dr. Hira Noor", phone: "+92 304 555 0107", address: "Gulshan-e-Iqbal, Karachi", location: { city: "Karachi" }, specialization: ["Avian medicine", "Exotic pets"], experienceYears: 6, availability: [{ day: "Thursday", start: "09:30", end: "16:30" }, { day: "Sunday", start: "10:00", end: "13:00" }], rating: 4.7, reviewCount: 14 });
accounts.farhan = await user("vet.surgery@furshield.test", { role: "vet", name: "Dr. Farhan Ali", phone: "+92 305 555 0108", address: "North Nazimabad, Karachi", location: { city: "Karachi" }, specialization: ["Surgery", "Orthopedics"], experienceYears: 12, availability: [{ day: "Monday", start: "12:00", end: "20:00" }, { day: "Friday", start: "09:00", end: "17:00" }], rating: 4.9, reviewCount: 34 });
accounts.safePaws = await user("shelter@furshield.test", { role: "shelter", name: "Safe Paws Shelter", shelterName: "Safe Paws Shelter", contactPerson: "Bilal Ahmed", phone: "+92 300 555 0103", address: "Gulshan-e-Iqbal, Karachi", location: { city: "Karachi" }, rating: 4.8, reviewCount: 17 });
accounts.haven = await user("shelter.haven@furshield.test", { role: "shelter", name: "Karachi Animal Haven", shelterName: "Karachi Animal Haven", contactPerson: "Mehwish Tariq", phone: "+92 306 555 0109", address: "Korangi, Karachi", location: { city: "Karachi" }, rating: 4.7, reviewCount: 22 });
accounts.secondChance = await user("shelter.rescue@furshield.test", { role: "shelter", name: "Second Chance Rescue", shelterName: "Second Chance Rescue", contactPerson: "Hamza Sheikh", phone: "+92 307 555 0110", address: "Malir, Karachi", location: { city: "Karachi" }, rating: 4.6, reviewCount: 11 });
accounts.admin = await user("admin@furshield.test", { role: "admin", name: "FurShield Administrator", phone: "+92 308 555 0111", address: "FurShield Operations, Karachi", location: { city: "Karachi" } });

const petRows = [
  [accounts.ayesha, "Mochi", { species: "Cat", breed: "Domestic shorthair", age: "3 years", gender: "Female", color: "Tortoiseshell", weight: 4.2, microchipId: "FS-CAT-1031", photoUrl: pexels(15479701), gallery: [externalImage(15479701, "Mochi's portrait"), externalImage(19690518, "Relaxing at home")], allergies: ["Chicken protein"], ongoingConditions: ["Seasonal dermatitis"] }],
  [accounts.ayesha, "Rio", { species: "Bird", breed: "Cockatiel", age: "1 year", gender: "Male", color: "Grey and yellow", weight: 0.09, photoUrl: pexels(7154606), gallery: [externalImage(7154606, "Rio after his morning mist"), externalImage(18387044, "Hand-training session")], allergies: [], ongoingConditions: [] }],
  [accounts.ayesha, "Leo", { species: "Dog", breed: "Cocker spaniel mix", age: "5 years", gender: "Male", color: "Golden", weight: 13.8, microchipId: "FS-DOG-2048", photoUrl: pexels(17891954), gallery: [externalImage(17891954, "Leo in the garden")], allergies: [], ongoingConditions: ["Mild hip stiffness"] }],
  [accounts.hira, "Luna", { species: "Cat", breed: "Siamese mix", age: "2 years", gender: "Female", color: "Cream", weight: 3.7, microchipId: "FS-CAT-3075", photoUrl: pexels(17957800), gallery: [externalImage(17957800, "Luna's adoption anniversary")], allergies: [], ongoingConditions: [] }],
  [accounts.hira, "Buddy", { species: "Dog", breed: "Golden retriever", age: "6 years", gender: "Male", color: "Golden", weight: 29.4, microchipId: "FS-DOG-3112", photoUrl: pexels(1805164), gallery: [externalImage(1805164, "Buddy at the park")], allergies: ["Beef"], ongoingConditions: ["Arthritis"] }],
  [accounts.omar, "Coco", { species: "Rabbit", breed: "Holland lop", age: "18 months", gender: "Female", color: "White and tan", weight: 1.6, photoUrl: pexels(6805651), gallery: [externalImage(6805651, "Coco enjoying supervised outdoor time")], allergies: [], ongoingConditions: [] }],
];
const pets = {};
for (const [owner, name, data] of petRows) pets[name] = await upsert("pets", { ownerId: owner._id, name }, { ownerId: owner._id, name, ...data, status: "active" });

const healthRows = [
  [pets.Mochi, accounts.ayesha, accounts.sana, "Annual wellness visit", { type: "vaccination", date: daysFromNow(-15), dueDate: daysFromNow(350), diagnosis: "Healthy examination", treatment: "Core vaccination booster", notes: "Weight is steady and vaccinations are current." }],
  [pets.Mochi, accounts.ayesha, accounts.adeel, "Dermatitis care plan", { type: "treatment", date: daysFromNow(-42), symptoms: ["Scratching", "Dry skin"], diagnosis: "Seasonal dermatitis", treatment: "Medicated shampoo twice weekly", medications: ["Omega-3 supplement"], followUp: "Review if itching increases." }],
  [pets.Rio, accounts.ayesha, accounts.noor, "Avian wellness screening", { type: "lab", date: daysFromNow(-61), diagnosis: "Normal examination", treatment: "Diet variety and enrichment", notes: "Feather condition and weight are healthy." }],
  [pets.Leo, accounts.ayesha, accounts.farhan, "Hip mobility assessment", { type: "treatment", date: daysFromNow(-28), symptoms: ["Stiffness after rest"], diagnosis: "Early joint degeneration", treatment: "Low-impact exercise plan", medications: ["Joint support supplement"], followUp: "Recheck in eight weeks." }],
  [pets.Luna, accounts.hira, accounts.sana, "First annual booster", { type: "vaccination", date: daysFromNow(-90), dueDate: daysFromNow(275), diagnosis: "Fit for vaccination", treatment: "FVRCP booster" }],
  [pets.Buddy, accounts.hira, accounts.farhan, "Arthritis follow-up", { type: "treatment", date: daysFromNow(-12), symptoms: ["Slower on stairs"], diagnosis: "Stable osteoarthritis", treatment: "Continue weight and mobility plan", medications: ["Vet-approved joint chews"] }],
  [pets.Coco, accounts.omar, accounts.noor, "Rabbit dental check", { type: "milestone", date: daysFromNow(-34), diagnosis: "Healthy dentition", treatment: "Continue hay-forward diet", notes: "No spurs or overgrowth observed." }],
];
for (const [pet, owner, vet, title, data] of healthRows) await upsert("healthrecords", { petId: pet._id, title }, { petId: pet._id, ownerId: owner._id, vetId: vet._id, title, ...data });

const appointmentRows = [
  [accounts.ayesha, pets.Mochi, accounts.adeel, "Skin irritation review", 3, "confirmed", { condition: "Occasional scratching", notes: "Bring current shampoo and food labels." }],
  [accounts.ayesha, pets.Rio, accounts.noor, "Routine beak and nail check", 8, "requested", { condition: "Preventive visit" }],
  [accounts.ayesha, pets.Leo, accounts.farhan, "Mobility progress check", 14, "rescheduled", { condition: "Hip stiffness", proposedStartsAt: daysFromNow(16, 15) }],
  [accounts.hira, pets.Buddy, accounts.farhan, "Arthritis medication review", 2, "confirmed", { condition: "Reduced morning mobility" }],
  [accounts.hira, pets.Luna, accounts.sana, "Dental cleaning consultation", 6, "requested", { condition: "Mild tartar" }],
  [accounts.omar, pets.Coco, accounts.noor, "Nutrition follow-up", 11, "confirmed", { condition: "Hay and pellet balance" }],
  [accounts.ayesha, pets.Mochi, accounts.sana, "Annual wellness examination", -15, "completed", { condition: "Preventive care", notes: "Vaccination administered." }],
];
for (const [owner, pet, vet, reason, offset, status, data] of appointmentRows) await upsert("appointments", { ownerId: owner._id, petId: pet._id, reason }, { ownerId: owner._id, petId: pet._id, vetId: vet._id, startsAt: daysFromNow(offset, offset % 2 ? 11 : 14), reason, status, ...data });

const productRows = [
  ["Sensitive tummy meal", "sensitive-tummy-meal", "Food", 24.5, 18, ["Dog", "Cat"], 4.7, "A gentle, easy-to-portion recipe for pets with sensitive digestion."],
  ["Cloud-soft slicker brush", "cloud-soft-slicker-brush", "Grooming", 16, 32, ["Dog", "Cat"], 4.8, "Rounded pins and a cushioned grip for calm everyday grooming."],
  ["Treat puzzle pebble", "treat-puzzle-pebble", "Toys", 12.75, 21, ["Dog", "Cat"], 4.6, "A washable enrichment toy with adjustable treat openings."],
  ["Joint support chews", "joint-support-chews", "Health", 19.25, 14, ["Dog"], 4.9, "Daily soft chews designed to complement a veterinarian-led mobility plan."],
  ["Quiet walk harness", "quiet-walk-harness", "Accessories", 28, 25, ["Dog"], 4.8, "A padded, front-clip harness with reflective trim."],
  ["Ceramic whisker bowl", "ceramic-whisker-bowl", "Accessories", 14.5, 40, ["Cat"], 4.7, "A wide, low-profile ceramic bowl that is easy to clean."],
  ["Foraging perch set", "foraging-perch-set", "Toys", 18.75, 12, ["Bird"], 4.5, "Natural textures and varied perch widths for supervised enrichment."],
  ["Timothy hay basket", "timothy-hay-basket", "Food", 11.5, 29, ["Rabbit"], 4.8, "Dust-reduced timothy hay packed for freshness."],
  ["Dental care finger brush", "dental-care-finger-brush", "Health", 8.25, 47, ["Dog", "Cat"], 4.4, "A soft silicone brush for gradual dental-care routines."],
  ["Calming travel carrier", "calming-travel-carrier", "Travel", 39, 9, ["Cat", "Rabbit"], 4.9, "A structured, ventilated carrier with a washable comfort pad."],
];
const products = {};
for (const [name, slug, category, price, stock, petTypes, rating, description] of productRows) products[slug] = await upsert("products", { slug }, { name, slug, category, price, stock, petTypes, rating, description, featured: rating >= 4.8 });

const listingRows = [
  [accounts.safePaws, "Bruno", "Dog", "Labrador mix", "3 years", "Male", 17891954, "Gentle, people-friendly, and learning leash manners.", "Vaccinated, neutered, and health checked", "available"],
  [accounts.safePaws, "Miso", "Cat", "Domestic shorthair", "2 years", "Female", 15479701, "An affectionate window-watcher who settles quickly into quiet homes.", "Vaccinated and spayed", "pending"],
  [accounts.safePaws, "Pip", "Bird", "Cockatiel", "18 months", "Male", 7154606, "Curious and social, with a growing vocabulary of whistles.", "Avian exam complete", "available"],
  [accounts.haven, "Daisy", "Rabbit", "Holland lop", "1 year", "Female", 6805651, "A calm rabbit who enjoys tunnels, hay puzzles, and gentle handling.", "Vaccinated and dental check complete", "available"],
  [accounts.haven, "Rocky", "Dog", "Terrier mix", "4 years", "Male", 1805164, "An energetic walking companion who already knows basic cues.", "Vaccinated, neutered, and microchipped", "available"],
  [accounts.haven, "Nala", "Cat", "Ginger domestic shorthair", "10 months", "Female", 17957800, "Playful, confident, and comfortable with other friendly cats.", "Vaccinated and spayed", "available"],
  [accounts.secondChance, "Simba", "Cat", "Siamese mix", "5 years", "Male", 19690518, "A gentle lap cat looking for a calm indoor home.", "Vaccinated, neutered, and health checked", "adopted"],
  [accounts.secondChance, "Pepper", "Dog", "Spaniel mix", "2 years", "Female", 17891954, "Bright and affectionate, with excellent recall in enclosed spaces.", "Vaccinated and spayed", "available"],
];
const listings = {};
for (const [shelter, name, species, breed, age, gender, imageId, description, healthStatus, status] of listingRows) listings[name] = await upsert("adoptionlistings", { shelterId: shelter._id, name }, { shelterId: shelter._id, name, species, breed, age, gender, description, healthStatus, location: shelter.address, images: [{ url: pexels(imageId), publicId: `external:pexels-${imageId}` }], status, careLogs: [{ type: "Health", note: "Daily wellness observation completed", date: daysFromNow(-1) }, { type: "Enrichment", note: "Play and socialization session completed", date: daysFromNow(-2) }] });

const interestRows = [
  [listings.Bruno, accounts.safePaws, accounts.ayesha, "Bruno seems like a thoughtful match for our home.", "Apartment near a park", "Previously cared for a senior dog", "contacted", "Thank you. We would like to arrange a meet-and-greet."],
  [listings.Daisy, accounts.haven, accounts.hira, "We have a quiet spare room ready for Daisy.", "Pet-friendly house", "Two years caring for rabbits", "approved", "Your home check is approved. We will contact you about collection."],
  [listings.Nala, accounts.haven, accounts.omar, "Nala's temperament sounds right for our family.", "Indoor apartment", "Current rabbit owner; familiar with gradual introductions", "new", ""],
  [listings.Pip, accounts.safePaws, accounts.hira, "I would love to learn more about Pip's routine.", "Quiet house", "First-time bird adopter with an avian-vet plan", "contacted", "Please visit during our Saturday adoption hours."],
];
for (const [listing, shelter, adopter, message, housing, experience, status, shelterResponse] of interestRows) await upsert("adoptioninterests", { listingId: listing._id, adopterId: adopter._id }, { listingId: listing._id, shelterId: shelter._id, adopterId: adopter._id, message, housing, experience, status, shelterResponse });

const reviewRows = [
  [accounts.ayesha, "vet", accounts.sana, 5, "Clear explanations and a calm appointment for Mochi."],
  [accounts.hira, "vet", accounts.farhan, 5, "Buddy's mobility plan was practical and easy to follow."],
  [accounts.omar, "vet", accounts.noor, 5, "Very patient handling and excellent rabbit-care advice."],
  [accounts.hira, "shelter", accounts.haven, 5, "Transparent adoption process and thoughtful follow-up."],
  [accounts.ayesha, "shelter", accounts.safePaws, 4, "The team shared detailed care notes before our visit."],
  [accounts.ayesha, "product", products["sensitive-tummy-meal"], 4, "Easy to portion and accepted gradually."],
  [accounts.hira, "product", products["joint-support-chews"], 5, "Convenient addition to Buddy's veterinarian-approved routine."],
];
for (const [author, targetType, target, rating, comment] of reviewRows) await upsert("reviews", { authorId: author._id, targetType, targetId: target._id }, { authorId: author._id, targetType, targetId: target._id, rating, comment });

const articleRows = [
  ["Building a calm vaccination routine", "calm-vaccination-routine", "Preventive care", "Simple preparation steps for a less stressful clinic visit.", "Prepare the carrier early, bring familiar rewards, and share any handling sensitivities with your veterinarian before the appointment.", ["Dog", "Cat"], 4],
  ["Everyday enrichment for indoor cats", "indoor-cat-enrichment", "Behavior", "Low-cost ways to add healthy hunting, climbing, and resting choices.", "Rotate toys, offer vertical resting places, and use small food puzzles while preserving predictable quiet time.", ["Cat"], 6],
  ["A beginner's guide to rabbit hay", "rabbit-hay-guide", "Nutrition", "Why hay quality and access matter for rabbit digestion and teeth.", "Offer unlimited fresh grass hay, store it dry, and discuss sudden appetite changes with a rabbit-experienced veterinarian.", ["Rabbit"], 5],
  ["Safe enrichment for companion birds", "bird-enrichment-basics", "Behavior", "Create variety without overwhelming a cautious bird.", "Introduce new perches and foraging activities gradually, supervise play, and avoid unsafe metals or loose fibers.", ["Bird"], 5],
];
for (const [title, slug, category, summary, content, species, readMinutes] of articleRows) await upsert("carearticles", { slug }, { title, slug, category, summary, content, species, readMinutes, mediaType: "article", published: true });

const notificationRows = [
  [accounts.ayesha, "appointment", "Mochi's visit is confirmed", "The dermatology review is scheduled in three days.", "/dashboard/appointments"],
  [accounts.ayesha, "vaccination", "Vaccination record updated", "Mochi's next annual booster due date is now recorded.", "/dashboard/health"],
  [accounts.hira, "adoption", "Daisy application approved", "Karachi Animal Haven approved your adoption interest.", "/dashboard/adoptions"],
  [accounts.omar, "appointment", "Coco's follow-up is booked", "Your nutrition follow-up has been confirmed.", "/dashboard/appointments"],
  [accounts.sana, "appointment", "New dental consultation request", "Luna has a new appointment request awaiting review.", "/dashboard/appointments"],
  [accounts.adeel, "appointment", "Upcoming dermatology review", "Mochi is confirmed for a skin-care follow-up.", "/dashboard/appointments"],
  [accounts.noor, "appointment", "New avian appointment request", "Rio has a routine check request awaiting review.", "/dashboard/appointments"],
  [accounts.farhan, "appointment", "Two mobility cases this week", "Buddy and Leo have upcoming mobility reviews.", "/dashboard/appointments"],
  [accounts.safePaws, "adoption", "New interest in Pip", "Hira Qureshi asked about Pip's adoption routine.", "/dashboard/adoptions"],
  [accounts.haven, "adoption", "New interest in Nala", "Omar Siddiqui submitted an adoption inquiry.", "/dashboard/adoptions"],
  [accounts.admin, "system", "Demo workspace ready", "Seeded users, pets, appointments, products, listings, and reviews are available.", "/admin"],
];
for (const [recipient, kind, title, message, href] of notificationRows) await upsert("notifications", { userId: recipient._id, title }, { userId: recipient._id, kind, title, message, href });

await upsert("contactmessages", { email: "sarah@example.test", topic: "Adoption" }, { name: "Sarah Ahmed", email: "sarah@example.test", topic: "Adoption", message: "Could you explain the home-check process for adopting a dog?", status: "new" });
await upsert("contactmessages", { email: "ali@example.test", topic: "Veterinary care" }, { name: "Ali Hasan", email: "ali@example.test", topic: "Veterinary care", message: "Do your listed avian veterinarians accept cockatiel wellness visits?", status: "reviewed" });

console.log("FurShield demo data is ready:", { accounts: Object.keys(accounts).length, pets: Object.keys(pets).length, appointments: appointmentRows.length, healthRecords: healthRows.length, adoptionListings: Object.keys(listings).length, adoptionInterests: interestRows.length, products: Object.keys(products).length, articles: articleRows.length });
await mongoose.disconnect();
