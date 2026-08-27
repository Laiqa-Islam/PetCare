"use server";

import {z} from "zod";
import {connectToDatabase} from "@/lib/db";
import {ContactMessage} from "@/lib/models";

const schema=z.object({name:z.string().trim().min(2,"Enter your name").max(100),email:z.string().trim().email("Enter a valid email address"),topic:z.string().trim().min(2,"Choose a topic").max(100),message:z.string().trim().min(10,"Add a little more detail so we can help").max(3000)});
export type ContactState={success?:boolean;error?:string;fieldErrors?:Record<string,string[]>};
export async function sendContactMessage(_state:ContactState,formData:FormData):Promise<ContactState>{const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)return{error:"Review the highlighted fields.",fieldErrors:parsed.error.flatten().fieldErrors};await connectToDatabase();await ContactMessage.create(parsed.data);return{success:true}}
