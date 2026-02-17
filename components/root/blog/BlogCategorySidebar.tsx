// import { BlogCategory, getPublicBlogCategories } from "@/apiServices/blogWebService";
// import ErrorComponent from "@/components/common/ErrorComponent";
// import NotFoundComponent from "@/components/common/NotFoundComponent";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tag } from "lucide-react";
// import Link from "next/link";

// const BlogCategorySidebar = async () => {
//   let blogCategories;
//   try {
//     blogCategories = await getPublicBlogCategories();
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return (
//         <div className="flex items-center justify-center">
//           <ErrorComponent message={error.message} />
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center justify-center">
//           <ErrorComponent message="An unexpected error occurred." />
//         </div>
//       );
//     }
//   }

//   const categories = blogCategories?.data?.blog_categories || [];

//   if (categories.length === 0) {
//     return (<div>
//       <NotFoundComponent message={blogCategories?.message} />
//     </div>);
//   }
//   const allTags = categories.flatMap(
//     (category) => category.meta_keywords || []
//   );

//   const uniqueTags = [...new Set(allTags)];


//   return (
//     <div className="space-y-6">
//       {/* Categories Card */}
//       <Card className="shadow-sm gap-2">
//         <CardHeader className="pb-0">
//           <CardTitle className="text-xl font-semibold text-secondary">
//             Categories
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <ul className="space-y-1">
//             {categories.map((category: BlogCategory) => (
//               <li key={category.id} className="group cursor-pointer capitalize bg-secondary/5 hover:bg-primary px-3 py-2 rounded-lg text-secondary hover:text-white mb-2 last:mb-0">
//                 <Link href={`/blog?blog_category_id=${category.id}`} className="w-full flex items-center justify-between">
//                   <span className="font-bold text-base">{category.title}</span>
//                   <span
//                     className="bg-secondary/20 text-secondary px-2 py-1 rounded-md group-hover:bg-white group-hover:text-secondary"
//                   >
//                     {category.blog_count}
//                   </span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Popular Tags Card */}
//       <Card className="shadow-sm gap-2">
//         <CardHeader className="pb-0">
//           <CardTitle className="text-xl font-semibold text-secondary flex items-center gap-2">
//             <Tag className="h-5 w-5 text-secondary" />
//             Popular Tags
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <div className="flex flex-wrap gap-2">
//             {uniqueTags?.map((tag: string, index: number) => (
//               <button
//                 key={index}
//                 className={`px-3 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-all duration-200 ${index === 0
//                   ? "bg-primary text-white "
//                   : "border border-secondary text-secondary"
//                   }`}
//               >
//                 #{tag}
//               </button>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BlogCategorySidebar;


import { BlogCategory, getPublicBlogCategories } from "@/apiServices/blogWebService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";
import Link from "next/link";

const BlogCategorySidebar = async () => {
  let blogCategories;

  try {
    blogCategories = await getPublicBlogCategories();
  } catch (error: unknown) {
    return (
      <div className="flex items-center justify-center">
        <ErrorComponent
          message={
            error instanceof Error
              ? error.message
              : "An unexpected error occurred."
          }
        />
      </div>
    );
  }

  const categories: BlogCategory[] =
    blogCategories?.data?.blog_categories || [];

  if (categories.length === 0) {
    return (
      <div>
        <NotFoundComponent message={blogCategories?.message} />
      </div>
    );
  }

  // Extract unique tags
  const allTags = categories.flatMap(
    (category) => category.meta_keywords || []
  );
  const uniqueTags = [...new Set(allTags)];

  return (
    <div className="space-y-6">
      {/* Categories Card */}
      <Card className="shadow-sm gap-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold text-secondary">
            Categories
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <ScrollArea className="h-[300px] pr-3">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="group cursor-pointer capitalize bg-secondary/5 hover:bg-primary px-3 py-2 rounded-lg text-secondary hover:text-white transition-all duration-200"
                >
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="font-bold text-base">
                      {category.title}
                    </span>

                    <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-md group-hover:bg-white group-hover:text-secondary">
                      {Number(category.blog_count)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Popular Tags Card */}
      <Card className="shadow-sm gap-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold text-secondary flex items-center gap-2">
            <Tag className="h-5 w-5 text-secondary" />
            Popular Tags
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <ScrollArea className="h-[200px] pr-3">
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map((tag, index) => (
                <button
                  key={tag}
                  className={`px-3 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-all duration-200 ${index === 0
                      ? "bg-primary text-white"
                      : "border border-secondary text-secondary hover:bg-primary hover:text-white"
                    }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCategorySidebar;

