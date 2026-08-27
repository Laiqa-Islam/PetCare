# SRS requirements traceability

| SRS area | Implementation |
| --- | --- |
| Owner registration/login and required contact details | Role-aware forms, MongoDB users, bcrypt password hashes, signed HTTP-only sessions |
| Multiple pet profiles; add/edit/view/delete | Owner pet workspace and profile cards |
| Gallery and scanned records | Signed Cloudinary image/PDF uploads, visible previews/links, and owner deletion controls |
| Vaccinations, allergies, illness, treatment and milestones | Typed health-record model, profile-level allergies/conditions, chronological timeline, and record edit/delete |
| Insurance policies and claims | Insurance document type with provider, policy, and claim metadata plus Cloudinary storage/view |
| Products, categories, filters, details and cart quantities | Product catalog with category filters and interactive add/remove totals; no payment/delivery |
| Care articles, videos and FAQs | Searchable categorized care library with full article copy, embedded educational video, and expandable FAQs |
| Appointment booking, cancellation, and vet suggestions | Owner request flow, condition/location-ranked vet suggestions, actual reschedule time updates, and notifications |
| Vet registration/profile/specialization/experience/slots | Vet role registration and profile/availability form |
| Vet access to booked-pet history | Server-side booking authorization before patient history access |
| Vet diagnosis, medication and follow-up notes | Structured clinical record form and shared pet timeline |
| Vet appointment approve/reschedule/complete | Role-checked schedule status action |
| Shelter registration and account | Shelter-specific required organization/contact fields and dashboard |
| Adoptable pet listings and health status | Persisted listings with public and authenticated views |
| Shelter feeding/grooming/medical logs | Per-animal care-log workflow |
| Adopter interest and final status | Owner interest forms, shelter replies and decision status, persisted in-app notifications, and Mailtrap SMTP delivery |
| Role-based access | Server-side session checks on every protected page/action/API |
| Search/sort/filter | Public care, product, adoption, and veterinarian discovery controls |
| Notifications | Persisted in-app appointment/adoption/system alerts and due-date-ready health records |
| Ratings/comments | Owner feedback workflow plus public ratings/comments for vets, shelters, and products |
| About and Contact with map | Dedicated pages, persisted contact form, and embedded OpenStreetMap location |
| Responsive/accessibility/performance/security | Labels, focus rings, reduced motion, mobile breakpoints, server components, validation, least privilege, secret isolation |

Optional family account sharing and AI chatbot are not enabled. Payment, physical delivery, and veterinarian credential verification are explicitly excluded by the SRS. Application email delivery uses server-only Mailtrap SMTP configuration; in-app alerts continue to work if SMTP is unavailable. A hosted URL and mandatory MP4 demonstration are release artifacts, not locally verifiable application features.
