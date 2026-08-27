import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { connectToDatabase } from "@/lib/db";
import { Product, Review, User } from "@/lib/models";

export const metadata: Metadata = { title: "Community feedback" };
export const dynamic = "force-dynamic";

type PublicReview = {
  id: string;
  rating: number;
  target: string;
  targetType: string;
  author: string;
  comment: string;
};

const fallbackReviews: PublicReview[] = [
  { id: "demo-1", rating: 5, target: "Dr. Sana Malik", targetType: "veterinarian", author: "Ayesha Khan", comment: "The visit felt calm and thorough, and every next step was explained clearly." },
  { id: "demo-2", rating: 5, target: "Safe Paws Shelter", targetType: "shelter", author: "Hira Ahmed", comment: "The adoption notes were honest and helped us prepare our home before meeting the pet." },
  { id: "demo-3", rating: 4, target: "Cloud-soft slicker brush", targetType: "product", author: "Omar Siddiqui", comment: "Comfortable to hold and gentle enough for our cat's weekly grooming routine." },
];

async function getReviews(): Promise<PublicReview[]> {
  try {
    await connectToDatabase();
    const reviews = await Review.find().populate("authorId", "name").sort({ createdAt: -1 }).limit(50).lean();
    const userIds = reviews.filter((review) => review.targetType !== "product").map((review) => review.targetId);
    const productIds = reviews.filter((review) => review.targetType === "product").map((review) => review.targetId);
    const [users, products] = await Promise.all([
      User.find({ _id: { $in: userIds } }).select("name").lean(),
      Product.find({ _id: { $in: productIds } }).select("name").lean(),
    ]);
    const names = new Map([...users, ...products].map((item) => [String(item._id), String(item.name)]));
    return reviews.map((review) => {
      const author = review.authorId as unknown as { name?: string };
      return {
        id: String(review._id),
        rating: Number(review.rating),
        target: names.get(String(review.targetId)) || "FurShield listing",
        targetType: String(review.targetType),
        author: author?.name || "Pet owner",
        comment: String(review.comment || ""),
      };
    });
  } catch {
    return fallbackReviews;
  }
}

export default async function FeedbackPage() {
  const reviews = await getReviews();
  return <PublicShell><section className="page-hero"><div className="shell"><p className="eyebrow">Community feedback</p><h1>Experiences shared by pet owners.</h1><p>Browse ratings and comments for listed veterinarians, shelters, and products.</p></div></section><section className="content-section shell"><div className="review-public-grid">{reviews.map((review) => <article key={review.id}><p className="rating" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><h2>{review.target}</h2><small>{review.targetType} · by {review.author}</small><p>{review.comment}</p></article>)}</div></section></PublicShell>;
}
