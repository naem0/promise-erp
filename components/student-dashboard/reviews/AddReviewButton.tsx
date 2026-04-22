"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewModal from "./ReviewModal";

export default function AddReviewButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="cursor-pointer"
      >
        <Plus size={20} />
        <span>Add a Review</span>
      </Button>

      <ReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="add"
        initialData={undefined}
      />
    </>
  );
}
