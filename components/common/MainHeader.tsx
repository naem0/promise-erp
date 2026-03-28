
import HeaderNavLink from "./HeaderNavLink";
import HeaderContent, { NavLink } from "./HeaderContent";
import { Suspense } from "react";

const navLinks: NavLink[] = [
  { name: "Courses", href: "/course", hasDropdown: true },
  { name: "Branch", href: "/branch" },
  { name: "About", href: "/about", hasDropdown: true },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/job-circulars" },
  { name: "Contact", href: "/contact" },
];

/* ================= MAIN HEADER ================= */
const MainHeader = () => {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <HeaderContent navLinks={navLinks} />
        </div>
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <Suspense fallback={null}>
              <HeaderNavLink navLinks={navLinks} />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
