import Image from "next/image";
import Link from "next/link";
import { PawIcon } from "@/components/icons";
import { connectToDatabase } from "@/lib/db";
import { Appointment, Pet } from "@/lib/models";
import { requireSession } from "@/lib/session";

type PetImage={url?:string};

export default async function PatientsPage(){
  const session=await requireSession(["vet"]);
  await connectToDatabase();
  const petIds=await Appointment.distinct("petId",{vetId:session.userId});
  const pets=await Pet.find({_id:{$in:petIds}}).lean();
  return <main className="dashboard-page"><div className="dashboard-heading"><div><p className="eyebrow">Authorized pet histories</p><h1>Pets with bookings</h1><p>You can view medical context only for pets whose owners have booked an appointment with you.</p></div></div><div className="pet-tabs">{pets.length?pets.map((pet)=>{
    const gallery=(Array.isArray(pet.gallery)?pet.gallery:[]) as PetImage[];
    const imageUrl=gallery[0]?.url||(pet.photoUrl?String(pet.photoUrl):"");
    return <article className="pet-profile-card" key={String(pet._id)}>{imageUrl?<Image className="dashboard-animal-photo" src={imageUrl} alt={`${String(pet.name)} profile`} width={160} height={160} unoptimized/>:<div className="pet-card-mark"><PawIcon/></div>}<div><span>{String(pet.species)} · {String(pet.breed||"")}</span><h2>{String(pet.name)}</h2><Link className="inline-link" href={`/dashboard/patients/${pet._id}`}>Open medical history</Link></div></article>;
  }):<div className="empty-note">Booked pet histories will appear here.</div>}</div></main>;
}
