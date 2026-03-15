import { getHomeCourseCategories } from "@/apiServices/categoryService";
import Link from "next/link";

const OurCoursesLink = async () => {
  let categories;
  try {
    const categoriesResponse = await getHomeCourseCategories();
    categories = categoriesResponse.data?.categories || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="col-span-full flex justify-center items-center w-full">
          <Link href="/courses" prefetch={true}>
            সকল প্রশিক্ষণ দেখুন
          </Link>
        </div>
      );
    }
    return (
      <div className="col-span-full flex justify-center items-center w-full">
        <Link href="/courses" prefetch={true}>
          সকল প্রশিক্ষণ দেখুন
        </Link>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {categories.map((course) => (
        <li key={course.id}>
          <Link
            href={{
              pathname: "/courses",
              query: { category_id: course.id },
            }}
            className="text-sm text-white"
          >
            {course.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default OurCoursesLink;
