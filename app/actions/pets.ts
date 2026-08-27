"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { HealthRecord, Pet } from "@/lib/models";
import { requireSession } from "@/lib/session";

const petSchema = z.object({
  name: z.string().trim().min(1), species: z.string().trim().min(1), breed: z.string().trim().optional(), age: z.string().trim().optional(), gender: z.string().trim().optional(),
  color: z.string().trim().optional(), weight: z.coerce.number().min(0).optional().or(z.literal("")), microchipId: z.string().trim().optional(),
  allergies: z.string().optional(), ongoingConditions: z.string().optional(),
});

function normalizePet(data: z.infer<typeof petSchema>) {
  return {
    ...data,
    weight: data.weight === "" ? undefined : data.weight,
    allergies: (data.allergies ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    ongoingConditions: (data.ongoingConditions ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  };
}

export async function addPet(formData: FormData) {
  const session = await requireSession(["owner"]);
  const parsed = petSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await connectToDatabase();
  await Pet.create({ ...normalizePet(parsed.data), ownerId: session.userId });
  revalidatePath("/dashboard/pets");
}

export async function deletePet(formData: FormData) {
  const session = await requireSession(["owner"]);
  const id = String(formData.get("id") ?? "");
  await connectToDatabase();
  const pet = await Pet.findOneAndDelete({ _id: id, ownerId: session.userId });
  if (pet) await HealthRecord.deleteMany({ petId: pet._id, ownerId: session.userId });
  revalidatePath("/dashboard/pets");
}

export async function updatePet(formData: FormData) {
  const session = await requireSession(["owner"]);
  const id = String(formData.get("id") ?? "");
  const parsed = petSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await connectToDatabase();
  await Pet.updateOne({ _id: id, ownerId: session.userId }, normalizePet(parsed.data));
  revalidatePath(`/dashboard/pets/${id}`);
}

export async function addHealthRecord(formData: FormData) {
  const session = await requireSession(["owner", "vet"]);
  const petId = String(formData.get("petId") ?? "");
  await connectToDatabase();
  const pet = await Pet.findById(petId);
  if (!pet) return;
  if (session.role === "owner" && String(pet.ownerId) !== session.userId) return;
  await HealthRecord.create({ petId, ownerId: pet.ownerId, vetId: session.role === "vet" ? session.userId : undefined, type: String(formData.get("type") || "milestone"), title: String(formData.get("title") || "Care update"), date: new Date(String(formData.get("date") || new Date().toISOString())), dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : undefined, symptoms: String(formData.get("symptoms") || "").split(",").map((item) => item.trim()).filter(Boolean), diagnosis: formData.get("diagnosis"), treatment: formData.get("treatment"), medications: String(formData.get("medications") || "").split(",").map((item) => item.trim()).filter(Boolean), followUp: formData.get("followUp"), notes: formData.get("notes") });
  revalidatePath(`/dashboard/pets/${petId}`);
  redirect(`/dashboard/pets/${petId}`);
}

export async function updateHealthRecord(formData: FormData) {
  const session = await requireSession(["owner", "vet"]);
  const id = String(formData.get("recordId") ?? "");
  await connectToDatabase();
  const record = await HealthRecord.findById(id);
  if (!record) return;
  const pet = await Pet.findById(record.petId);
  if (!pet) return;
  if (session.role === "owner" && String(pet.ownerId) !== session.userId) return;
  if (session.role === "vet" && String(record.vetId) !== session.userId) return;
  await HealthRecord.updateOne({ _id: id }, { title: formData.get("title"), date: new Date(String(formData.get("date"))), dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : null, diagnosis: formData.get("diagnosis"), treatment: formData.get("treatment"), notes: formData.get("notes") });
  revalidatePath(`/dashboard/pets/${pet._id}`);
}

export async function deleteHealthRecord(formData: FormData) {
  const session = await requireSession(["owner"]);
  const id = String(formData.get("recordId") ?? "");
  await connectToDatabase();
  const record = await HealthRecord.findOneAndDelete({ _id: id, ownerId: session.userId });
  if (record) revalidatePath(`/dashboard/pets/${record.petId}`);
}
