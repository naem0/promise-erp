"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import {
  getBlogDetailLikeCount,
  toggleBlogDetailLikes,
} from "@/apiServices/blogWebService";
import { toast } from "sonner";

interface LikeToggleButtonProps {
  blogId: number;
}

const LikeToggleButton = ({ blogId }: LikeToggleButtonProps) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLikedToggle, setIsLikedToggle] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await getBlogDetailLikeCount(blogId);
        setLikesCount(res?.data?.likes_count);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching likes:", error.message);
        } else {
          console.error("Error fetching likes:", error);
        }
      }
    };

    fetchLikes();
  }, [blogId, isLikedToggle]);

  // Handle toggle like
  const handleToggleLike = () => {
    startTransition(async () => {
      try {
        const res = await toggleBlogDetailLikes(blogId);
        if (res.success) {
          setIsLikedToggle(!isLikedToggle);
          toast.success(res.message || "Like toggled successfully!");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error toggling like:", error.message);
        } else {
          console.error("Error toggling like:", error);
        }
      }
    });
  };

  return (
    <Button
      onClick={handleToggleLike}
      disabled={isPending}
      className={`flex items-center gap-2 ${
        isLikedToggle ? "bg-primary text-white" : "bg-secondary text-white"
      }`}
    >
      <ThumbsUp
        className={`w-4 h-4 ${isLikedToggle ? "text-white" : "text-white"}`}
      />
      {likesCount} {isPending ? "Like..." : "Like"}
    </Button>
  );
};

export default LikeToggleButton;
