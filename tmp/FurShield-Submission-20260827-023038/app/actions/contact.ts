"use server";
import {redirect} from "next/navigation";import {z} from "zod";import {connectToDatabase} from "@/lib/db";import {ContactMessage} from "@/lib/models";
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().email(),topic:z.string().max(100),message:z.string().trim().min(5).max(3000)});
export async function sendContactMessage(formData:FormData){const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)redirect("/contact?error=1");await connectToDatabase();await ContactMessage.create(parsed.data);redirect("/contact?sent=1")}
