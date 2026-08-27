import mongoose from "mongoose";
import { hash } from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
await mongoose.connect(uri, { dbName: "furshield" });
const db = mongoose.connection.db;
const passwordHash = await hash("FurShield123!", 12);

async function user(email, data) {
  await db.collection("users").updateOne({ email }, { $set: { ...data, email, passwordHash, verified: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
  return (await db.collection("users").findOne({ email }))._id;
}

const ownerId = await user("owner@furshield.test", { role: "owner", name: "Ayesha Khan", phone: "+92 300 555 0101", address: "Clifton, Karachi" });
const vetId = await user("vet@furshield.test", { role: "vet", name: "Dr. Sana Malik", phone: "+92 300 555 0102", address: "Clifton, Karachi", specialization: ["Small animal medicine", "Preventive care"], experienceYears: 9, availability: [{ day: "Monday", start: "09:00", end: "17:00" }], rating: 4.9, reviewCount: 28 });
const shelterId = await user("shelter@furshield.test", { role: "shelter", name: "Safe Paws Shelter", shelterName: "Safe Paws Shelter", contactPerson: "Bilal Ahmed", phone: "+92 300 555 0103", address: "Gulshan, Karachi", rating: 4.8, reviewCount: 17 });

await db.collection("pets").updateOne({ ownerId, name: "Mochi" }, { $set: { ownerId, name: "Mochi", species: "Cat", breed: "Domestic shorthair", age: "3 years", gender: "Female", allergies: ["Chicken protein"], status: "active", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
const pet = await db.collection("pets").findOne({ ownerId, name: "Mochi" });
await db.collection("pets").updateOne({ ownerId, name: "Rio" }, { $set: { ownerId, name: "Rio", species: "Bird", breed: "Cockatiel", age: "1 year", gender: "Male", allergies: [], ongoingConditions: [], status: "active", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
await db.collection("healthrecords").updateOne({ petId: pet._id, title: "Annual wellness visit" }, { $set: { petId: pet._id, ownerId, vetId, type: "vaccination", title: "Annual wellness visit", date: new Date("2026-08-12"), dueDate: new Date("2027-08-12"), diagnosis: "Healthy examination", treatment: "Core vaccination booster", notes: "Weight steady and vaccines current.", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
await db.collection("appointments").updateOne({ ownerId, petId: pet._id, reason: "Skin irritation review" }, { $set: { ownerId, petId: pet._id, vetId, startsAt: new Date(Date.now() + 3 * 86400000), reason: "Skin irritation review", condition: "Occasional scratching", status: "confirmed", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });

for (const [name,slug,category,price,stock] of [["Sensitive tummy meal","sensitive-tummy-meal","Food",24.5,18],["Cloud-soft slicker brush","cloud-soft-slicker-brush","Grooming",16,32],["Treat puzzle pebble","treat-puzzle-pebble","Toys",12.75,21],["Joint support chews","joint-support-chews","Health",19.25,14]]) await db.collection("products").updateOne({ slug }, { $set: { name, slug, category, price, stock, description: "A FurShield demo catalog item.", petTypes: ["Dog","Cat"], rating: 4.7, featured: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });

await db.collection("adoptionlistings").updateOne({ shelterId, name: "Bruno" }, { $set: { shelterId, name: "Bruno", species: "Dog", breed: "Labrador mix", age: "3 years", gender: "Male", description: "Gentle, people-friendly, and learning leash manners.", healthStatus: "Vaccinated and health checked", location: "Gulshan, Karachi", status: "available", careLogs: [{ type: "Feeding", note: "Morning meal completed", date: new Date() }], updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
const listing=await db.collection("adoptionlistings").findOne({shelterId,name:"Bruno"});
await db.collection("adoptioninterests").updateOne({listingId:listing._id,adopterId:ownerId},{$set:{listingId:listing._id,shelterId,adopterId:ownerId,message:"Bruno seems like a thoughtful match for our home.",housing:"Apartment near a park",experience:"Previously cared for a senior dog",status:"contacted",shelterResponse:"Thank you. We would like to arrange a meet-and-greet.",updatedAt:new Date()},$setOnInsert:{createdAt:new Date()}},{upsert:true});
const reviewProduct=await db.collection("products").findOne({slug:"sensitive-tummy-meal"});
await db.collection("reviews").updateOne({authorId:ownerId,targetType:"vet",targetId:vetId},{$set:{authorId:ownerId,targetType:"vet",targetId:vetId,rating:5,comment:"Clear explanations and a calm appointment for Mochi.",updatedAt:new Date()},$setOnInsert:{createdAt:new Date()}},{upsert:true});
await db.collection("reviews").updateOne({authorId:ownerId,targetType:"product",targetId:reviewProduct._id},{$set:{authorId:ownerId,targetType:"product",targetId:reviewProduct._id,rating:4,comment:"Easy to portion and accepted gradually.",updatedAt:new Date()},$setOnInsert:{createdAt:new Date()}},{upsert:true});
await db.collection("notifications").updateOne({ userId: ownerId, title: "Welcome to your care space" }, { $set: { userId: ownerId, kind: "system", title: "Welcome to your care space", message: "Mochi's profile and first health event are ready.", href: "/dashboard/pets", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });

console.log("FurShield demo data is ready.");
await mongoose.disconnect();
