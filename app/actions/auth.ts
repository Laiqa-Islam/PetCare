"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User, type UserRole } from "@/lib/models";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

const baseSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a contact number"),
  address: z.string().trim().min(5, "Enter your address"),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["owner", "vet", "shelter"]),
  shelterName: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
});

export async function register(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.role === "shelter" && !parsed.data.shelterName) return { fieldErrors: { shelterName: ["Enter the shelter name"] } };

  try {
    await connectToDatabase();
    const exists = await User.exists({ email: parsed.data.email.toLowerCase() });
    if (exists) return { error: "An account already exists for this email." };
    const passwordHash = await hash(parsed.data.password, 12);
    const user = await User.create({
      role: parsed.data.role,
      name: parsed.data.role === "shelter" ? parsed.data.shelterName : parsed.data.name,
      contactPerson: parsed.data.role === "shelter" ? parsed.data.name : undefined,
      shelterName: parsed.data.role === "shelter" ? parsed.data.shelterName : undefined,
      specialization: parsed.data.role === "vet" && parsed.data.specialization ? parsed.data.specialization.split(",").map((item) => item.trim()).filter(Boolean) : [],
      email: parsed.data.email.toLowerCase(), phone: parsed.data.phone, address: parsed.data.address, passwordHash,
    });
    await createSession({ userId: String(user._id), role: user.role as UserRole, name: user.name });
  } catch (error) {
    console.error("Registration failed", error);
    return { error: "We could not create the account. Check the database connection and try again." };
  }
  redirect("/dashboard");
}

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors, error: "Review the highlighted login fields." };
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash");
    if (!user || !(await compare(parsed.data.password, user.passwordHash))) return { error: "Email or password is incorrect." };
    await createSession({ userId: String(user._id), role: user.role as UserRole, name: user.name });
  } catch (error) {
    console.error("Login failed", error);
    return { error: "Login is temporarily unavailable. Try again shortly." };
  }
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const { requireSession } = await import("@/lib/session");
  const { revalidatePath } = await import("next/cache");
  const session = await requireSession();
  await connectToDatabase();
  const update: Record<string, unknown> = { phone: String(formData.get("phone") || ""), address: String(formData.get("address") || "") };
  if (session.role === "vet") {
    update.specialization = String(formData.get("specialization") || "").split(",").map((item) => item.trim()).filter(Boolean);
    update.experienceYears = Number(formData.get("experienceYears") || 0);
    update.availability = [{ day: String(formData.get("day") || "Monday"), start: String(formData.get("start") || "09:00"), end: String(formData.get("end") || "17:00") }];
  }
  await User.updateOne({ _id: session.userId }, update);
  revalidatePath("/dashboard/profile");
}
