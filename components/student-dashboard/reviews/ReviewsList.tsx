"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

// Dummy data for design purposes
const DUMMY_REVIEWS = [
  {
    id: "1",
    studentName: "Rakib Hasan",
    studentImage: "/images/avatar-1.jpg",
    rating: 5,
    courseName: "Professional Graphics Design",
    batch: "Batch 14",
    date: "2 Jan, 2026",
    comment: "This course exceeded my expectations! The lessons were clear, practical, and helped me improve my design skills fast.",
  },
  {
    id: "2",
    studentName: "Rakib Hasan",
    studentImage: "/images/avatar-1.jpg",
    rating: 5,
    courseName: "Professional Graphics Design",
    batch: "Batch 14",
    date: "2 Jan, 2026",
    comment: "This course exceeded my expectations! The lessons were clear, practical, and helped me improve my design skills fast.",
  },
  {
    id: "3",
    studentName: "Rakib Hasan",
    studentImage: "/images/avatar-1.jpg",
    rating: 5,
    courseName: "Professional Graphics Design",
    batch: "Batch 14",
    date: "2 Jan, 2026",
    comment: "This course exceeded my expectations! The lessons were clear, practical, and helped me improve my design skills fast.",
  },
  {
    id: "4",
    studentName: "Rakib Hasan",
    studentImage: "/images/avatar-1.jpg",
    rating: 5,
    courseName: "Professional Graphics Design",
    batch: "Batch 14",
    date: "2 Jan, 2026",
    comment: "This course exceeded my expectations! The lessons were clear, practical, and helped me improve my design skills fast.",
  },
];

export default function ReviewsList() {
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const handleAddClick = () => {
    setModalMode("add");
    setSelectedReview(null);
    setModalOpen(true);
  };

  const handleEditClick = (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (review) {
      setModalMode("edit");
      setSelectedReview({
        courseId: "1",
        rating: review.rating,
        comment: review.comment,
      });
      setModalOpen(true);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-secondary">Reviews</h2>
        <Button 
          onClick={handleAddClick}
          className="cursor-pointer"
        >
          <Plus size={20} />
          <span>Add a Review</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-medium">No reviews found. Click the button above to add one!</p>
        </div>
      )}

      <ReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedReview}
      />
    </div>
  );
}
