import Link from "next/link";
import {
  ActivityIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FileIcon,
  HeartIcon,
  PawIcon,
  PlusIcon,
  StethoscopeIcon,
  UsersIcon,
} from "@/components/icons";
import { connectToDatabase } from "@/lib/db";
import { AdoptionInterest, AdoptionListing, Appointment, HealthRecord, Notification, Pet } from "@/lib/models";
import { requireSession } from "@/lib/session";

type Metric = { label: string; value: number; note: string; icon: typeof PawIcon; href: string };
type Activity = { label: string; title: string; meta: string; status?: string; href: string; icon: typeof PawIcon };
type QuickAction = { label: string; description: string; href: string; icon: typeof PawIcon };

const formatDate = (value: unknown) => new Date(String(value)).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });

export default async function DashboardPage() {
  const session = await requireSession();
  await connectToDatabase();

  let metrics: Metric[] = [];
  let activity: Activity[] = [];
  let quickActions: QuickAction[] = [];
  let pulse = { label: "Care pulse", title: "Everything important, in one calm workspace.", detail: "Review the latest activity and continue where attention is needed.", href: "/dashboard/notifications", action: "Review updates" };

  if (session.role === "owner") {
    const [pets, appointments, records, notices, recentVisits, dueRecords] = await Promise.all([
      Pet.countDocuments({ ownerId: session.userId }),
      Appointment.countDocuments({ ownerId: session.userId, status: { $nin: ["cancelled", "completed"] } }),
      HealthRecord.countDocuments({ ownerId: session.userId }),
      Notification.countDocuments({ userId: session.userId, readAt: { $exists: false } }),
      Appointment.find({ ownerId: session.userId }).sort({ startsAt: 1 }).limit(3).populate("petId", "name").populate("vetId", "name").lean(),
      HealthRecord.find({ ownerId: session.userId, dueDate: { $gte: new Date() } }).sort({ dueDate: 1 }).limit(3).populate("petId", "name").lean(),
    ]);
    metrics = [
      { label: "Pets in your care", value: pets, note: "Profiles and care histories", icon: PawIcon, href: "/dashboard/pets" },
      { label: "Upcoming visits", value: appointments, note: "Requested or confirmed", icon: CalendarIcon, href: "/dashboard/appointments" },
      { label: "Health records", value: records, note: "Across every pet", icon: FileIcon, href: "/dashboard/records" },
      { label: "Unread alerts", value: notices, note: notices ? "Needs your attention" : "You are up to date", icon: ActivityIcon, href: "/dashboard/notifications" },
    ];
    activity = [
      ...dueRecords.map((record) => { const pet = record.petId as unknown as { name?: string }; return { label: "Upcoming care", title: String(record.title), meta: `${pet?.name ?? "Pet"} · Due ${formatDate(record.dueDate)}`, status: "Due", href: "/dashboard/pets", icon: ClockIcon }; }),
      ...recentVisits.map((item) => { const pet = item.petId as unknown as { name?: string }; const vet = item.vetId as unknown as { name?: string }; return { label: "Appointment", title: `${pet?.name ?? "Pet"} with ${vet?.name ?? "veterinarian"}`, meta: `${formatDate(item.startsAt)} · ${String(item.reason)}`, status: String(item.status), href: "/dashboard/appointments", icon: CalendarIcon }; }),
    ].slice(0, 5);
    quickActions = [
      { label: "Add a pet", description: "Create a new identity and care profile.", href: "/dashboard/pets", icon: PlusIcon },
      { label: "Book a visit", description: "Find the right vet by condition and location.", href: "/dashboard/appointments", icon: CalendarIcon },
      { label: "Update records", description: "Add a vaccine, treatment, lab, or document.", href: "/dashboard/pets", icon: FileIcon },
    ];
    pulse = { label: "Owner care pulse", title: appointments ? `${appointments} active visit${appointments === 1 ? "" : "s"} in progress.` : "No active visits need action.", detail: dueRecords.length ? `${dueRecords.length} upcoming care item${dueRecords.length === 1 ? "" : "s"} should be reviewed next.` : "Your future due dates are clear. Add a reminder when you record the next vaccination.", href: appointments ? "/dashboard/appointments" : "/dashboard/pets", action: appointments ? "Open appointments" : "Review pet records" };
  } else if (session.role === "vet") {
    const [upcoming, completed, patients, notices, schedule] = await Promise.all([
      Appointment.countDocuments({ vetId: session.userId, status: { $in: ["requested", "confirmed", "rescheduled"] } }),
      Appointment.countDocuments({ vetId: session.userId, status: "completed" }),
      Appointment.distinct("petId", { vetId: session.userId }),
      Notification.countDocuments({ userId: session.userId, readAt: { $exists: false } }),
      Appointment.find({ vetId: session.userId, status: { $in: ["requested", "confirmed", "rescheduled"] } }).sort({ startsAt: 1 }).limit(5).populate("petId", "name species").populate("ownerId", "name").lean(),
    ]);
    metrics = [
      { label: "Active bookings", value: upcoming, note: "Requested and scheduled", icon: CalendarIcon, href: "/dashboard/appointments" },
      { label: "Completed visits", value: completed, note: "Clinical history retained", icon: CheckIcon, href: "/dashboard/appointments" },
      { label: "Connected patients", value: patients.length, note: "Authorized pet histories", icon: PawIcon, href: "/dashboard/patients" },
      { label: "Unread alerts", value: notices, note: notices ? "Needs your attention" : "You are up to date", icon: ActivityIcon, href: "/dashboard/notifications" },
    ];
    activity = schedule.map((item) => { const pet = item.petId as unknown as { name?: string; species?: string }; const owner = item.ownerId as unknown as { name?: string }; return { label: "Clinical schedule", title: `${pet?.name ?? "Pet"} · ${String(item.reason)}`, meta: `${formatDate(item.startsAt)} · ${owner?.name ?? "Owner"} · ${pet?.species ?? "Pet"}`, status: String(item.status), href: "/dashboard/appointments", icon: StethoscopeIcon }; });
    quickActions = [
      { label: "Open schedule", description: "Approve, reschedule, or complete bookings.", href: "/dashboard/appointments", icon: CalendarIcon },
      { label: "Review patients", description: "Open authorized histories before a visit.", href: "/dashboard/patients", icon: PawIcon },
      { label: "Set availability", description: "Keep public appointment slots current.", href: "/dashboard/profile", icon: ClockIcon },
    ];
    pulse = { label: "Clinical care pulse", title: upcoming ? `${upcoming} active booking${upcoming === 1 ? "" : "s"} on your schedule.` : "Your active schedule is clear.", detail: upcoming ? "Review requested visits first, then open patient histories to prepare clinical context." : "Update availability so owners can find the next suitable appointment window.", href: upcoming ? "/dashboard/appointments" : "/dashboard/profile", action: upcoming ? "Review schedule" : "Update availability" };
  } else {
    const [listings, available, interests, notices, interestDocs, listingDocs] = await Promise.all([
      AdoptionListing.countDocuments({ shelterId: session.userId }),
      AdoptionListing.countDocuments({ shelterId: session.userId, status: "available" }),
      AdoptionInterest.countDocuments({ shelterId: session.userId, status: "new" }),
      Notification.countDocuments({ userId: session.userId, readAt: { $exists: false } }),
      AdoptionInterest.find({ shelterId: session.userId }).sort({ updatedAt: -1 }).limit(3).populate("listingId", "name").populate("adopterId", "name").lean(),
      AdoptionListing.find({ shelterId: session.userId }).sort({ updatedAt: -1 }).limit(3).lean(),
    ]);
    metrics = [
      { label: "Animal profiles", value: listings, note: "Published shelter records", icon: PawIcon, href: "/dashboard/listings" },
      { label: "Available to adopt", value: available, note: "Visible to prospective homes", icon: HeartIcon, href: "/dashboard/listings" },
      { label: "New interest forms", value: interests, note: interests ? "Awaiting a response" : "Inbox is clear", icon: FileIcon, href: "/dashboard/interests" },
      { label: "Unread alerts", value: notices, note: notices ? "Needs your attention" : "You are up to date", icon: ActivityIcon, href: "/dashboard/notifications" },
    ];
    activity = [
      ...interestDocs.map((interest) => { const listing = interest.listingId as unknown as { name?: string }; const adopter = interest.adopterId as unknown as { name?: string }; return { label: "Adoption interest", title: `${adopter?.name ?? "Adopter"} · ${listing?.name ?? "Animal"}`, meta: `Interest status: ${String(interest.status)}`, status: String(interest.status), href: "/dashboard/interests", icon: UsersIcon }; }),
      ...listingDocs.map((listing) => ({ label: "Adoption profile", title: String(listing.name), meta: `${String(listing.species)} · ${String(listing.location || "Location pending")}`, status: String(listing.status), href: "/dashboard/listings", icon: PawIcon })),
    ].slice(0, 5);
    quickActions = [
      { label: "Publish a profile", description: "Add an animal and its adoption details.", href: "/dashboard/listings", icon: PlusIcon },
      { label: "Record daily care", description: "Log feeding, grooming, or medical attention.", href: "/dashboard/shelter-care", icon: HeartIcon },
      { label: "Review interest", description: "Reply to adopters and update decisions.", href: "/dashboard/interests", icon: UsersIcon },
    ];
    pulse = { label: "Shelter care pulse", title: interests ? `${interests} new interest form${interests === 1 ? "" : "s"} awaiting review.` : "No new adopter forms are waiting.", detail: interests ? "A timely, clear response helps prospective homes understand the next step." : "Keep care logs and listing availability current while the inbox is clear.", href: interests ? "/dashboard/interests" : "/dashboard/shelter-care", action: interests ? "Review interest" : "Update care logs" };
  }

  const firstName = session.role === "shelter"
    ? `${session.name.replace(/\s+shelter$/i, "")} team`
    : session.name.replace(/^Dr\.?\s+/i, "").split(" ")[0];
  return (
    <main className="dashboard-page dashboard-overview">
      <div className="dashboard-heading overview-heading">
        <div><p className="eyebrow">Operations overview</p><h1>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {firstName}.</h1><p>Here is the current state of your FurShield workspace.</p></div>
        <div className="heading-date"><ClockIcon/><span>Today</span><strong>{new Date().toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" })}</strong></div>
      </div>

      <section className="care-pulse" aria-labelledby="care-pulse-title">
        <div className="care-pulse-signal" aria-hidden="true"><ActivityIcon size={26}/><span/><span/><span/></div>
        <div><p>{pulse.label}</p><h2 id="care-pulse-title">{pulse.title}</h2><span>{pulse.detail}</span></div>
        <Link href={pulse.href}>{pulse.action}<ChevronRightIcon/></Link>
      </section>

      <section className="metric-grid" aria-label="Workspace summary">
        {metrics.map(({ label, value, note, icon: Icon, href }) => <Link className="metric-card" href={href} key={label}><div className="metric-card-top"><span><Icon /></span><ChevronRightIcon/></div><strong>{value.toLocaleString()}</strong><h2>{label}</h2><p>{note}</p></Link>)}
      </section>

      <div className="overview-grid">
        <section className="dashboard-panel activity-panel">
          <div className="panel-heading"><div><p className="section-label">Live workspace</p><h2>Recent and upcoming</h2></div><Link href="/dashboard/notifications">All notifications<ChevronRightIcon/></Link></div>
          <div className="activity-feed">
            {activity.length ? activity.map((item, index) => <Link href={item.href} className="activity-row" key={`${item.title}-${index}`}><span className="activity-icon"><item.icon/></span><div><small>{item.label}</small><h3>{item.title}</h3><p>{item.meta}</p></div>{item.status ? <span className={`status status-${item.status}`}>{item.status}</span> : null}<ChevronRightIcon/></Link>) : <div className="empty-note"><CheckIcon/><div><strong>Nothing needs attention right now.</strong><p>New bookings, care reminders, and decisions will appear here.</p></div></div>}
          </div>
        </section>

        <aside className="dashboard-panel quick-actions-panel">
          <div className="panel-heading"><div><p className="section-label">Shortcuts</p><h2>Quick actions</h2></div></div>
          <div className="quick-action-list">{quickActions.map(({ label, description, href, icon: Icon }) => <Link href={href} key={label}><span><Icon/></span><div><strong>{label}</strong><p>{description}</p></div><ChevronRightIcon/></Link>)}</div>
          <div className="continuity-note"><span><HeartIcon/></span><p><strong>Care continuity</strong>Current records help the next person make a better decision.</p></div>
        </aside>
      </div>
    </main>
  );
}
