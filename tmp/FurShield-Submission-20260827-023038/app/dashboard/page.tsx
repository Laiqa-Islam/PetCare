import Link from "next/link";
import { CalendarIcon, FileIcon, HeartIcon, PawIcon } from "@/components/icons";
import { connectToDatabase } from "@/lib/db";
import { AdoptionInterest, AdoptionListing, Appointment, HealthRecord, Notification, Pet } from "@/lib/models";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  await connectToDatabase();
  let metrics: { label: string; value: number; icon: typeof PawIcon; href: string }[] = [];
  if (session.role === "owner") {
    const [pets, appointments, records, notices] = await Promise.all([Pet.countDocuments({ownerId:session.userId}), Appointment.countDocuments({ownerId:session.userId,status:{$nin:["cancelled","completed"]}}), HealthRecord.countDocuments({ownerId:session.userId}), Notification.countDocuments({userId:session.userId,readAt:{$exists:false}})]);
    metrics = [{label:"Pets in your care",value:pets,icon:PawIcon,href:"/dashboard/pets"},{label:"Upcoming visits",value:appointments,icon:CalendarIcon,href:"/dashboard/appointments"},{label:"Health records",value:records,icon:FileIcon,href:"/dashboard/records"},{label:"New alerts",value:notices,icon:HeartIcon,href:"/dashboard/notifications"}];
  } else if (session.role === "vet") {
    const [upcoming, completed, patients, notices] = await Promise.all([Appointment.countDocuments({vetId:session.userId,status:{$in:["requested","confirmed","rescheduled"]}}),Appointment.countDocuments({vetId:session.userId,status:"completed"}),Appointment.distinct("petId",{vetId:session.userId}),Notification.countDocuments({userId:session.userId,readAt:{$exists:false}})]);
    metrics = [{label:"Active bookings",value:upcoming,icon:CalendarIcon,href:"/dashboard/appointments"},{label:"Completed visits",value:completed,icon:FileIcon,href:"/dashboard/appointments"},{label:"Pets seen",value:patients.length,icon:PawIcon,href:"/dashboard/patients"},{label:"New alerts",value:notices,icon:HeartIcon,href:"/dashboard/notifications"}];
  } else {
    const [listings, available, interests, notices] = await Promise.all([AdoptionListing.countDocuments({shelterId:session.userId}),AdoptionListing.countDocuments({shelterId:session.userId,status:"available"}),AdoptionInterest.countDocuments({shelterId:session.userId,status:"new"}),Notification.countDocuments({userId:session.userId,readAt:{$exists:false}})]);
    metrics = [{label:"Animal profiles",value:listings,icon:PawIcon,href:"/dashboard/listings"},{label:"Available to adopt",value:available,icon:HeartIcon,href:"/dashboard/listings"},{label:"New interest forms",value:interests,icon:FileIcon,href:"/dashboard/interests"},{label:"New alerts",value:notices,icon:CalendarIcon,href:"/dashboard/notifications"}];
  }
  return <main className="dashboard-page"><div className="dashboard-heading"><div><p className="eyebrow">Today&apos;s care space</p><h1>Good to see you, {session.name.split(" ")[0]}.</h1><p>{session.role === "owner" ? "Here is what needs attention across your pets." : session.role === "vet" ? "Your clinical schedule and connected pet histories are ready." : "Your adoption and shelter care activity is in one place."}</p></div><Link className="button button-primary" href={session.role === "owner" ? "/dashboard/pets" : session.role === "vet" ? "/dashboard/appointments" : "/dashboard/listings"}>{session.role === "owner" ? "Add or view pets" : session.role === "vet" ? "Open schedule" : "Manage listings"}</Link></div><section className="metric-grid">{metrics.map(({label,value,icon:Icon,href}) => <Link className="metric-card" href={href} key={label}><span><Icon /></span><strong>{value}</strong><p>{label}</p></Link>)}</section><section className="dashboard-panel welcome-panel"><div><p className="kicker">CARE CONTINUITY</p><h2>One update can help the next person care better.</h2><p>Keep profiles, availability, care logs, and records current so every appointment or adoption conversation begins with useful context.</p></div><div className="ledger-lines"><span/><span/><span/><span/></div></section></main>;
}
