import { BellIcon, CalendarIcon } from "@/components/icons";
import { connectToDatabase } from "@/lib/db";
import { HealthRecord, Notification } from "@/lib/models";
import { requireSession } from "@/lib/session";

export default async function NotificationsPage(){
  const session=await requireSession();await connectToDatabase();
  const notices=await Notification.find({userId:session.userId}).sort({createdAt:-1}).lean();
  const due=session.role==="owner"?await HealthRecord.find({ownerId:session.userId,dueDate:{$exists:true}}).populate("petId","name").sort({dueDate:1}).limit(10).lean():[];
  return <main className="dashboard-page"><div className="dashboard-heading"><div><p className="eyebrow">Alerts and reminders</p><h1>Notifications</h1><p>Vaccination due dates, appointment changes, adoption updates, and new product notes collect here.</p></div></div><div className="notification-list">{due.map((record)=>{const pet=record.petId as unknown as {name:string};return <article key={`due-${record._id}`}><span><CalendarIcon/></span><div><small>UPCOMING CARE</small><h2>{String(record.title)} due for {pet?.name}</h2><p>{new Date(String(record.dueDate)).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</p></div></article>})}{notices.map((notice)=><article key={String(notice._id)}><span><BellIcon/></span><div><small>{String(notice.kind).toUpperCase()}</small><h2>{String(notice.title)}</h2><p>{String(notice.message||"")}</p></div></article>)}{!due.length&&!notices.length?<div className="empty-note">You are all caught up. New alerts will appear here.</div>:null}</div></main>
}
