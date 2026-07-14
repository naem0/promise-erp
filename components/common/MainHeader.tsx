import HeaderNavLink from "./HeaderNavLink";
import HeaderContent, { NavLink } from "./HeaderContent";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

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
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Server Side Rendered (always visible even on slow networks) */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={213}
                  height={36}
                  priority
                />
              </Link>
            </div>
            {/* Search, Auth, Mobile Menu - Client Side */}
            <HeaderContent navLinks={navLinks} />
          </div>
        </div>
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <Suspense fallback={<div className=" text-center">Loading...</div>}>
              <HeaderNavLink navLinks={navLinks} />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
