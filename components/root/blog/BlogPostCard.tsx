import { BlogInfo } from "@/apiServices/blogWebService";
import BlogCardItems from "../home/BlogCardItems";

interface BlogPostCardProps {
  blogInfoData: BlogInfo[];
}

const BlogPostCard = ({blogInfoData}:BlogPostCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {blogInfoData?.slice(1)?.map((blog) => (
        <BlogCardItems key={blog?.id} post={blog} />
      ))}
    </div>
  );
};

export default BlogPostCard;
