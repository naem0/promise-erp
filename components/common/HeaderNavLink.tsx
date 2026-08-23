import {
  Category,
  getHomeCourseCategories,
} from "@/apiServices/categoryService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HeaderNavClient from "./HeaderNavClient";
import { NavLink } from "./HeaderContent";

interface HeaderNavLinkProps {
  navLinks: NavLink[];
  isStudentDashboard?: boolean;
}

const HeaderNavLink = async ({
  navLinks,
  isStudentDashboard = false,
}: HeaderNavLinkProps) => {
  const session = await getServerSession(authOptions);

  // Fetch categories for dropdown
  let categories: Category[] = [];
  try {
    const categoriesResponse = await getHomeCourseCategories();
    categories = categoriesResponse?.data?.categories || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Failed to fetch categories:", error);
    }
  }

  return (
    <HeaderNavClient
      navLinks={navLinks}
      categories={categories}
      isStudentDashboard={isStudentDashboard}
      userRole={session?.user?.roles}
    />
  );
};

export default HeaderNavLink;
