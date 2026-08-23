"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Phone } from "lucide-react";
import { AuthButtons, NavLink } from "./HeaderContent";
import Link from "next/link";
import { Category } from "@/apiServices/categoryService";

interface HeaderNavClientProps {
  navLinks: NavLink[];
  categories: Category[];
  isStudentDashboard?: boolean;
  userRole?: string | string[];
}

// Static About dropdown links
const aboutDropdownLinks = [
  { name: "About", href: "/about" },
  { name: "Trainers", href: "/trainers" },
  { name: "Video Gallery", href: "/video-gellary" },
  { name: "Image Gallery", href: "/image-gallery" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "News Feeds", href: "/news-feeds" },
  { name: "Our Officers", href: "/our-officers" },
];

export default function HeaderNavClient({
  navLinks,
  categories,
  isStudentDashboard = false,
  userRole,
}: HeaderNavClientProps) {
  return (
    <nav className="hidden lg:flex items-center justify-between w-full my-3 px-4">
      <div className="flex items-center justify-center gap-4 xl:gap-6 w-full">
        {navLinks?.map((link) => (
          <div key={link?.name}>
            {link.hasDropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-base font-semibold ease-in-out black-color cursor-pointer bg-transparent border-0 p-0 outline-none"
                  >
                    {link?.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link?.name === "Courses" ? (
                    categories?.length > 0 ? (
                      categories?.map((category) => (
                        <DropdownMenuItem asChild key={category.id}>
                          <Link
                            href={`/courses?category_id=${category.id}`}
                            className="w-full cursor-pointer"
                          >
                            {category.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No categories found
                      </DropdownMenuItem>
                    )
                  ) : link?.name === "About" ? (
                    aboutDropdownLinks?.map((item) => (
                      <DropdownMenuItem asChild key={item.href}>
                        <Link
                          href={item.href}
                          prefetch={true}
                          className="w-full cursor-pointer"
                        >
                          {item?.name}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={link.href}
                className="text-base font-semibold ease-in-out black-color"
              >
                {link?.name}
              </Link>
            )}
          </div>
        ))}
      </div>
      {isStudentDashboard ? (
        <div className="flex items-center justify-end shrink-0 gap-2 text-sm w-1/6">
          <AuthButtons role={userRole} />
        </div>
      ) : (
        <div className="flex items-center shrink-0 justify-end gap-2 text-sm w-1/5">
          <Phone className="h-4 w-4 text-secondary" />
          <span className="font-semibold text-secondary text-base">
            01550-666900
          </span>
        </div>
      )}
    </nav>
  );
}
