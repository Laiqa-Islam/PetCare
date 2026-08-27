"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/lib/models";
import { requireSession } from "@/lib/session";
export async function submitReview(formData: FormData){const session=await requireSession(["owner"]);const rating=Number(formData.get("rating"));const[type,targetId]=String(formData.get("target")||"").split(":");if(rating<1||rating>5||!["vet","shelter","product"].includes(type)||!targetId)return;await connectToDatabase();await Review.findOneAndUpdate({authorId:session.userId,targetType:type,targetId},{rating,comment:String(formData.get("comment")||"")},{upsert:true,new:true});revalidatePath("/dashboard/reviews");revalidatePath("/feedback")}
