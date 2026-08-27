# FurShield

FurShield is a full-stack pet care platform for pet owners, veterinarians, and animal shelters. It centralizes pet profiles, medical timelines, document uploads, appointments, treatment notes, adoption listings and interest forms, daily shelter care, product browsing/cart actions, care guidance, notifications, and feedback.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- MongoDB Atlas with Mongoose
- Signed, HTTP-only JWT sessions with `jose`; passwords hashed with `bcryptjs`
- Cloudinary signed uploads for galleries, certificates, X-rays, lab reports, and insurance documents
- OpenStreetMap contact/location map

## Local setup

1. Install dependencies with `npm install`.
2. Keep the supplied database and Cloudinary values in `.env.local` (already configured locally and ignored by Git).
3. Replace `SESSION_SECRET` with a long random value before production.
4. Seed repeatable test data with `npm run seed`.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

## Test accounts

All seeded accounts use the password `FurShield123!`.

| Role | Email |
| --- | --- |
| Pet owner | `owner@furshield.test` |
| Veterinarian | `vet@furshield.test` |
| Animal shelter | `shelter@furshield.test` |

Veterinarian identity verification is intentionally out of scope, matching the SRS. Payments and physical delivery are also intentionally excluded; cart quantities and totals remain fully interactive.

## Validation

- `npm run lint`
- `npm run build`

See [the implementation plan](docs/IMPLEMENTATION_PLAN.md) and [the SRS traceability matrix](docs/REQUIREMENTS_MATRIX.md).
