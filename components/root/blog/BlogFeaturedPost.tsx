import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlogInfo } from "@/apiServices/blogWebService";
import Link from "next/link";

interface BlogFeaturedPostProps {
  blogInfoData: BlogInfo[];
}
const BlogFeaturedPost = ({ blogInfoData }: BlogFeaturedPostProps) => {
  return (
    <div>
      <Card className="shadow-md py-0 border-0">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <AspectRatio ratio={14 / 9} className="rounded-lg">
            <Image
              src={blogInfoData[0]?.thumbnail || "/images/placeholder_img.jpg"}
              alt={blogInfoData[0]?.title}
              fill
              className="rounded-tl-lg rounded-bl-lg"
            />
          </AspectRatio>

          {/* Content Section */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <Badge className="w-fit mb-4 text-base font-semibold">
              {blogInfoData[0]?.category?.title}
            </Badge>

            <h2 className="text-xl lg:text-3xl font-bold text-secondary mb-3 leading-normal">
              {blogInfoData[0]?.title}
            </h2>

            <p className="text-black/60 mb-4 text-base">
              {blogInfoData[0]?.short_description}
            </p>

            <div className="flex items-center gap-4 text-base text-secondary mb-4">
              <span className="flex items-center gap-1.5 font-medium ">
                <User className="h-5 w-5" />
                { blogInfoData[0]?.author?.name}
              </span>
              <span className="flex items-center gap-1.5 font-medium ">
                <Calendar className="h-5 w-5" />
                {blogInfoData[0]?.published_at}
              </span>
            </div>

            <Button className="w-fit" asChild >
              <Link href={`/blog/${blogInfoData[0]?.slug}`} >Read More</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlogFeaturedPost;
