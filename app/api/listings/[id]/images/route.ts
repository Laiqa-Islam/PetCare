import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { AdoptionListing } from "@/lib/models";
import { getSession } from "@/lib/session";

const schema=z.object({url:z.string().url().refine((value)=>{try{return new URL(value).hostname==="res.cloudinary.com"}catch{return false}}),publicId:z.string().min(1)});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const session=await getSession();if(!session||session.role!=="shelter")return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid image"},{status:400});const{id}=await params;await connectToDatabase();const result=await AdoptionListing.updateOne({_id:id,shelterId:session.userId},{$push:{images:parsed.data}});if(!result.matchedCount)return NextResponse.json({error:"Listing not found"},{status:404});return NextResponse.json({ok:true})}
