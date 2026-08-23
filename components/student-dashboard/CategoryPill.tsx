"use client";
import { CourseCategory } from "@/apiServices/studentDashboardService";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryPillProps {
  category: CourseCategory;
}
export default function CategoryPill({ category }: CategoryPillProps) {
  const { name, image, slug } = category;
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSlug = searchParams.get("category_slug");
  const isActive = activeSlug === slug;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.delete("category_slug");
    } else {
      params.set("category_slug", slug);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 py-3 ${isActive ? "bg-primary" : "bg-secondary"} rounded-2xl`}
    >
      <div className="bg-white text-primary shadow relative rounded-full w-12 h-12 flex items-center justify-center p-1">
        <Image
          src={(image && typeof image === "string" && image.trim() !== "") ? image : "/images/placeholder_img.jpg"}
          alt={name}
          fill
          className="object-scale-down rounded-full"
        />
      </div>
      <span className="font-medium text-white text-lg">{name}</span>
    </div>
  );
}
