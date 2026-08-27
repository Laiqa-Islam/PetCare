"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Appointment, Notification, Pet } from "@/lib/models";
import { requireSession } from "@/lib/session";

export async function requestAppointment(formData: FormData) {
  const session = await requireSession(["owner"]);
  await connectToDatabase();
  const petId = String(formData.get("petId"));
  const pet = await Pet.findOne({ _id: petId, ownerId: session.userId });
  if (!pet) return;
  const appointment = await Appointment.create({ ownerId: session.userId, petId, vetId: String(formData.get("vetId")), startsAt: new Date(String(formData.get("startsAt"))), reason: String(formData.get("reason")), condition: String(formData.get("condition") || ""), status: "requested" });
  await Notification.create({ userId: appointment.vetId, kind: "appointment", title: "New appointment request", message: `${session.name} requested an appointment for ${pet.name}.`, href: "/dashboard/appointments" });
  revalidatePath("/dashboard/appointments");
}

export async function updateAppointment(formData: FormData) {
  const session = await requireSession(["owner", "vet"]);
  await connectToDatabase();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const filter = session.role === "vet" ? { _id: id, vetId: session.userId } : { _id: id, ownerId: session.userId };
  const allowed = session.role === "vet" ? ["confirmed", "rescheduled", "completed", "cancelled"] : ["cancelled"];
  if (!allowed.includes(status)) return;
  const proposed=formData.get("proposedStartsAt")?new Date(String(formData.get("proposedStartsAt"))):undefined;
  const update:Record<string,unknown>={status};if(status==="rescheduled"&&proposed){update.proposedStartsAt=proposed;update.startsAt=proposed;}
  const appointment = await Appointment.findOneAndUpdate(filter, update, { new: true });
  if (appointment) await Notification.create({ userId: session.role === "vet" ? appointment.ownerId : appointment.vetId, kind: "appointment", title: `Appointment ${status}`, message: `The appointment status is now ${status}.`, href: "/dashboard/appointments" });
  revalidatePath("/dashboard/appointments");
}
