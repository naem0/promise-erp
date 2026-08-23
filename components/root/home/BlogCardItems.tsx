import { BlogInfo } from "@/apiServices/blogWebService";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardItemsProps {
  post: BlogInfo;
}
const BlogCardItems = ({ post }: BlogCardItemsProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <Card
        className="group overflow-hidden h-full py-0 gap-0 transition-transform duration-500 hover:-translate-y-2 hover:shadow-xl shadow-md"
      >
        {/* Image Wrapper */}
        <AspectRatio ratio={11 / 6} className="w-full overflow-hidden">
          <Image
            src={(post?.thumbnail && typeof post?.thumbnail === "string" && post?.thumbnail.trim() !== "") ? post?.thumbnail : "/images/placeholder_img.jpg"}
            alt={post.title || ""}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>

        {/* Card Content */}
        <CardContent className="p-6 flex flex-col items-start gap-4">
          <Badge className="bg-primary text-white px-3 py-0 rounded-full text-sm">
            {post?.category?.title}
          </Badge>

          <h3 className="text-base xl:text-lg font-bold text-secondary leading-tight">
            {post.title}
          </h3>

          <div className="flex items-center font-normal gap-2 text-secondary text-base mt-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>{post.published_at}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCardItems;
