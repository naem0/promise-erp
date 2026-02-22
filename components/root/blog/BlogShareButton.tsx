"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

interface BlogShareButtonProps {
  slug: string;
}

const BlogShareButton = ({ slug }: BlogShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/blog/${slug}`;
      await navigator.clipboard.writeText(url);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm text-primary ml-2 cursor-pointer"
    >
      <Share2 className="w-6 h-6" />
      <span className="text-secondary">
        {copied ? "Copied!" : "Share This Blog"}
      </span>
    </div>
  );
};

export default BlogShareButton;