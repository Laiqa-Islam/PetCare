"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { AdoptionInterest, AdoptionListing, Notification, User } from "@/lib/models";
import { sendEmail } from "@/lib/email";
import { requireSession } from "@/lib/session";

export async function addListing(formData: FormData) {
  const session = await requireSession(["shelter"]);
  await connectToDatabase();
  await AdoptionListing.create({ shelterId: session.userId, name: formData.get("name"), species: formData.get("species"), breed: formData.get("breed"), age: formData.get("age"), gender: formData.get("gender"), healthStatus: formData.get("healthStatus"), location: formData.get("location"), description: formData.get("description") });
  revalidatePath("/dashboard/listings");
}

export async function updateListingStatus(formData: FormData) {
  const session=await requireSession(["shelter"]);const status=String(formData.get("status"));if(!["available","pending","adopted"].includes(status))return;await connectToDatabase();await AdoptionListing.updateOne({_id:formData.get("id"),shelterId:session.userId},{status});revalidatePath("/dashboard/listings");revalidatePath("/adopt");
}

export async function addCareLog(formData: FormData) {
  const session = await requireSession(["shelter"]);
  await connectToDatabase();
  await AdoptionListing.updateOne({ _id: formData.get("listingId"), shelterId: session.userId }, { $push: { careLogs: { type: formData.get("type"), note: formData.get("note"), date: new Date() } } });
  revalidatePath("/dashboard/shelter-care");
}

export async function updateInterest(formData: FormData) {
  const session = await requireSession(["shelter"]);
  await connectToDatabase();
  const response=String(formData.get("shelterResponse")||"");
  const interest = await AdoptionInterest.findOneAndUpdate({ _id: formData.get("id"), shelterId: session.userId }, { status: formData.get("status"), shelterResponse: response }, { new: true });
  if (interest) {await Notification.create({ userId: interest.adopterId, kind: "adoption", title: "Adoption interest updated", message: response||`Your interest status is now ${interest.status}.`, href: "/dashboard/adoption" });const adopter=await User.findById(interest.adopterId).select("email").lean();if(adopter?.email)await sendEmail({to:String(adopter.email),subject:"Your FurShield adoption interest was updated",text:response||`Your adoption interest status is now ${interest.status}.`});}
  revalidatePath("/dashboard/interests");
}

export async function submitInterest(formData: FormData) {
  const session = await requireSession(["owner"]);
  await connectToDatabase();
  const listing = await AdoptionListing.findOne({ _id: formData.get("listingId"), status: "available" });
  if (!listing) return;
  await AdoptionInterest.findOneAndUpdate({ listingId: listing._id, adopterId: session.userId }, { shelterId: listing.shelterId, message: formData.get("message"), housing: formData.get("housing"), experience: formData.get("experience"), status: "new" }, { upsert: true, new: true });
  await Notification.create({ userId: listing.shelterId, kind: "adoption", title: `New interest in ${listing.name}`, message: `${session.name} sent an adoption interest form.`, href: "/dashboard/interests" });
  revalidatePath("/dashboard/adoption");
}
