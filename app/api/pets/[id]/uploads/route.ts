import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { HealthRecord, Pet } from "@/lib/models";
import { getSession } from "@/lib/session";

const cloudinaryUrl=z.string().url().refine((value)=>{try{return new URL(value).hostname==="res.cloudinary.com"}catch{return false}},"Invalid upload host");
const payloadSchema = z.object({ url: cloudinaryUrl, publicId: z.string().min(1), name: z.string().min(1), kind: z.enum(["image","certificate","xray","lab","insurance","other"]), insurance:z.object({provider:z.string().max(100).optional(),policyNumber:z.string().max(100).optional(),claimReference:z.string().max(100).optional()}).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(); if (!session || session.role !== "owner") return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed = payloadSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({error:"Invalid upload"},{status:400});
  const { id } = await params; await connectToDatabase(); const pet = await Pet.findOne({_id:id,ownerId:session.userId}); if(!pet)return NextResponse.json({error:"Pet not found"},{status:404});
  if(parsed.data.kind==="image") await Pet.updateOne({_id:id},{$push:{gallery:{url:parsed.data.url,publicId:parsed.data.publicId,caption:parsed.data.name}}});
  else await HealthRecord.create({petId:id,ownerId:session.userId,type:parsed.data.kind==="insurance"?"insurance":"document",title:parsed.data.name,date:new Date(),insurance:parsed.data.insurance,notes:parsed.data.kind==="insurance"?`Provider: ${parsed.data.insurance?.provider||"Not supplied"} · Policy: ${parsed.data.insurance?.policyNumber||"Not supplied"} · Claim: ${parsed.data.insurance?.claimReference||"None"}`:undefined,attachments:[{url:parsed.data.url,publicId:parsed.data.publicId,name:parsed.data.name,kind:parsed.data.kind}]});
  return NextResponse.json({ok:true});
}

const deleteSchema = z.object({ kind: z.enum(["gallery", "record"]), itemId: z.string().min(1), publicId: z.string().min(1) });

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(); if (!session || session.role !== "owner") return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed = deleteSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({error:"Invalid request"},{status:400});
  const { id } = await params; await connectToDatabase(); const pet = await Pet.findOne({_id:id,ownerId:session.userId}); if(!pet)return NextResponse.json({error:"Pet not found"},{status:404});
  const timestamp = Math.floor(Date.now()/1000); const secret=process.env.CLOUDINARY_API_SECRET; const cloudName=process.env.CLOUDINARY_CLOUD_NAME; const apiKey=process.env.CLOUDINARY_API_KEY;
  if(!parsed.data.publicId.startsWith("external:")&&secret&&cloudName&&apiKey){const {createHash}=await import("node:crypto");const signature=createHash("sha1").update(`public_id=${parsed.data.publicId}&timestamp=${timestamp}${secret}`).digest("hex");const form=new FormData();form.set("public_id",parsed.data.publicId);form.set("timestamp",String(timestamp));form.set("api_key",apiKey);form.set("signature",signature);await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,{method:"POST",body:form});}
  if(parsed.data.kind==="gallery")await Pet.updateOne({_id:id},{$pull:{gallery:{_id:parsed.data.itemId}}});else await HealthRecord.deleteOne({_id:parsed.data.itemId,petId:id,ownerId:session.userId});
  return NextResponse.json({ok:true});
}
