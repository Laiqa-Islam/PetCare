# FurShield project report

## Problem definition

Pet care details are fragmented across paper records, chats, calendars, clinics, shelters, and shops. Owners can miss reminders or lose clinical context; veterinarians may receive incomplete histories; shelters must coordinate animal care and adopter interest in separate systems. FurShield provides one role-aware web platform where these activities connect to the correct animal.

## Design specification

FurShield uses a browser-based responsive interface and a server-rendered application layer. Public routes support discovery. Protected workspaces expose only the workflows associated with the signed-in role. Server-side authorization is repeated at the data mutation and upload boundaries rather than relying on hidden navigation links.

The interface uses a care-ledger concept: deep teal communicates clinical trust, warm orange marks the primary action, and pale animal-specific surfaces keep dense records approachable. Layouts adapt from a desktop sidebar and multi-column cards to single-column mobile views. Focus rings, visible labels, readable type, reduced-motion support, descriptive empty states, and keyboard-operable native controls support accessibility.

## System flow

1. A visitor browses care information, vets, shelter animals, or products.
2. The visitor registers as an owner, veterinarian, or shelter and receives a signed HTTP-only session.
3. The server checks the session role before it renders protected data or performs a mutation.
4. Owners maintain pets and records, request appointments, send adoption interest, and publish feedback.
5. Veterinarians manage availability and bookings, then access histories only for booked pets and append clinical notes.
6. Shelters publish adoption profiles, log daily care, and update adopter interest status.
7. Appointment and adoption changes create in-app notifications for the affected user.
8. Images and documents are signed on the server, restricted by format/size, uploaded directly to Cloudinary, and attached to the authorized pet or shelter listing.

## Data flow

Browser → Next.js page/action/route → session and role check → validation → MongoDB Atlas

Browser → signed upload request → Cloudinary upload → authorized pet attachment record → MongoDB Atlas

Status change → notification record → recipient dashboard

## Database design

| Entity | Principal relationships | Purpose |
| --- | --- | --- |
| User | Owner of pets/listings; participant in appointments/reviews | Identity, role, contact details, vet profile, shelter profile |
| Pet | Belongs to an owner | Identity, gallery, allergies, ongoing conditions |
| HealthRecord | Belongs to pet and owner; optional vet author | Vaccination, treatment, illness, allergy, milestone, lab, document, insurance |
| Appointment | Connects owner, pet, and vet | Requested time, reason, condition, lifecycle status |
| Product | Target of cart and review activity | Category, price, stock, description, supported pet types |
| CareArticle | Public care content | Category, species, article/video/FAQ type |
| AdoptionListing | Belongs to shelter | Adoptable animal profile, health/adoption status, care logs |
| AdoptionInterest | Connects listing, shelter, and adopter | Housing, experience, message, decision status |
| Review | Connects owner to vet/shelter/product target | One-to-five rating and comment |
| Notification | Belongs to a user | Appointment, vaccination, adoption, product, and system alerts |

Unique indexes protect user emails, product slugs, and article slugs. Foreign identifiers are indexed on frequently filtered records. Timestamps are retained on all domain entities.

## Security design

- Passwords are hashed with bcrypt using cost 12.
- Sessions are signed and stored in HTTP-only, SameSite=Lax cookies; production cookies require HTTPS.
- Session payloads contain only the user identifier, role, and display name.
- Protected pages, server actions, and upload APIs repeat role and ownership checks.
- Vet medical-history access requires a matching appointment for that pet and veterinarian.
- Database and Cloudinary secrets stay in an ignored local environment file and are never sent to the browser.
- Cloudinary signatures are generated only for authenticated users and place uploads under a user-specific folder.
- Zod validates authentication and upload boundaries.

## Test data

The idempotent seed command creates one owner, veterinarian, and shelter; a pet; a health event and due date; a confirmed appointment; four products; an adoptable animal with a care log; and an owner notification. Re-running the seed updates known demo records instead of duplicating them.

## Verification performed

| Check | Result |
| --- | --- |
| ESLint | Pass |
| Next.js production compilation | Pass |
| TypeScript | Pass |
| Static/dynamic route generation | Pass, 26 application routes |
| Public route HTTP smoke test | Pass on home, care, products, adoption, vets, About, Contact, login, registration |
| Protected route without session | Pass, temporary redirect to login |
| MongoDB Atlas connectivity and repeatable seed | Pass |
| Secret isolation | Environment file ignored by project Git rules |

## Assumptions and exclusions

The SRS explicitly excludes payment processing, physical product delivery, and veterinarian credential verification. Product cart controls therefore stop before checkout. Family account sharing and the AI chatbot are optional and are not enabled. Persisted in-app notifications are always available; server-only Mailtrap SMTP configuration enables captured email delivery for shelter decisions. MongoDB is used because it is an accepted SRS stack and was explicitly supplied for this implementation. A hosted deployment and recorded MP4 remain environment/release deliverables rather than claims made by the local build.
