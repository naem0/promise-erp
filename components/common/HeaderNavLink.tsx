import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Phone } from "lucide-react";
import { AuthButtons, NavLink } from "./HeaderContent";
import Link from "next/link";
import {
  Category,
  getHomeCourseCategories,
} from "@/apiServices/categoryService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface HeaderNavLinkProps {
  navLinks: NavLink[];
  isStudentDashboard?: boolean;
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

const HeaderNavLink = async ({
  navLinks,
  isStudentDashboard = false,
}: HeaderNavLinkProps) => {
  const session = await getServerSession(authOptions);
  const status = session ? "authenticated" : "unauthenticated";

  // Fetch categories for dropdown
  let categories: Category[] = [];
  try {
    const categoriesResponse = await getHomeCourseCategories();
    categories = categoriesResponse.data?.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  return (
    <nav className={`hidden lg:flex items-center justify-between w-full my-3`}>
      <div className="flex items-center justify-center gap-4 xl:gap-6 w-full">
        {navLinks?.map((link) => (
          <div key={link.name}>
            {link.hasDropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-base font-semibold ease-in-out black-color"
                  >
                    {link?.name}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link?.name === "Courses" ? (
                    categories?.length > 0 ? (
                      categories?.map((category) => (
                        <DropdownMenuItem key={category.id}>
                          <Link
                            href={`/courses?category_id=${category.id}`}
                            className="w-full"
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
                      <DropdownMenuItem key={item.href}>
                        <Link href={item.href} prefetch={true} className="w-full">
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
        <div className="flex items-center justify-end gap-2 text-sm">
          <AuthButtons role={session?.user?.roles} />
        </div>
      ) : (
        <div className="flex items-center justify-end gap-2 text-sm w-1/6">
          <Phone className="h-4 w-4 text-secondary" />
          <span className="font-semibold text-secondary text-base">
            01550-666900
          </span>
        </div>
      )}
    </nav>
  );
};

export default HeaderNavLink;
