import mongoose, { Schema, model, models } from "mongoose";

const options = { timestamps: true } as const;

const userSchema = new Schema(
  {
    role: { type: String, enum: ["owner", "vet", "shelter", "admin"], required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatarUrl: String,
    specialization: [String],
    experienceYears: Number,
    availability: [{ day: String, start: String, end: String }],
    shelterName: String,
    contactPerson: String,
    location: { city: String, coordinates: { type: [Number], default: undefined } },
    verified: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  options,
);

const petSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    species: { type: String, required: true, index: true },
    breed: String,
    birthDate: Date,
    age: String,
    gender: String,
    color: String,
    weight: Number,
    microchipId: String,
    photoUrl: String,
    gallery: [{ url: String, publicId: String, caption: String }],
    allergies: [String],
    ongoingConditions: [String],
    status: { type: String, default: "active" },
  },
  options,
);

const healthRecordSchema = new Schema(
  {
    petId: { type: Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vetId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, enum: ["vaccination", "treatment", "illness", "allergy", "milestone", "lab", "document", "insurance"], required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: Date,
    symptoms: [String],
    diagnosis: String,
    treatment: String,
    medications: [String],
    followUp: String,
    notes: String,
    attachments: [{ url: String, publicId: String, name: String, kind: String }],
    insurance: { provider: String, policyNumber: String, claimReference: String },
  },
  options,
);

const appointmentSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    petId: { type: Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    vetId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startsAt: { type: Date, required: true, index: true },
    reason: { type: String, required: true },
    condition: String,
    status: { type: String, enum: ["requested", "confirmed", "rescheduled", "completed", "cancelled"], default: "requested" },
    proposedStartsAt: Date,
    notes: String,
  },
  options,
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, index: "text" },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: String,
    petTypes: [String],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  options,
);

const careArticleSchema = new Schema(
  {
    title: { type: String, required: true, index: "text" },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    summary: String,
    content: String,
    mediaType: { type: String, enum: ["article", "video", "faq"], default: "article" },
    mediaUrl: String,
    species: [String],
    readMinutes: Number,
    published: { type: Boolean, default: true },
  },
  options,
);

const adoptionListingSchema = new Schema(
  {
    shelterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, index: "text" },
    species: { type: String, required: true, index: true },
    breed: String,
    age: String,
    gender: String,
    description: String,
    healthStatus: String,
    location: String,
    images: [{ url: String, publicId: String }],
    status: { type: String, enum: ["available", "pending", "adopted"], default: "available", index: true },
    careLogs: [{ type: { type: String }, note: String, date: Date }],
  },
  options,
);

const interestSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "AdoptionListing", required: true, index: true },
    shelterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    adopterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: String,
    housing: String,
    experience: String,
    shelterResponse: String,
    status: { type: String, enum: ["new", "contacted", "approved", "declined"], default: "new" },
  },
  options,
);

const reviewSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["vet", "shelter", "product"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1000 },
  },
  options,
);

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: { type: String, enum: ["vaccination", "appointment", "product", "adoption", "system"], required: true },
    title: { type: String, required: true },
    message: String,
    href: String,
    readAt: Date,
  },
  options,
);

const contactMessageSchema = new Schema({ name:{type:String,required:true},email:{type:String,required:true},topic:{type:String,required:true},message:{type:String,required:true,maxlength:3000},status:{type:String,enum:["new","reviewed"],default:"new"} },options);

export const User = models.User || model("User", userSchema);
export const Pet = models.Pet || model("Pet", petSchema);
export const HealthRecord = models.HealthRecord || model("HealthRecord", healthRecordSchema);
export const Appointment = models.Appointment || model("Appointment", appointmentSchema);
export const Product = models.Product || model("Product", productSchema);
export const CareArticle = models.CareArticle || model("CareArticle", careArticleSchema);
export const AdoptionListing = models.AdoptionListing || model("AdoptionListing", adoptionListingSchema);
export const AdoptionInterest = models.AdoptionInterest || model("AdoptionInterest", interestSchema);
export const Review = models.Review || model("Review", reviewSchema);
export const Notification = models.Notification || model("Notification", notificationSchema);
export const ContactMessage = models.ContactMessage || model("ContactMessage", contactMessageSchema);

export type UserRole = "owner" | "vet" | "shelter" | "admin";
export type LeanDocument = Record<string, unknown> & { _id: mongoose.Types.ObjectId };
