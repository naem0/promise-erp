
import {
  Facebook,
  Linkedin,
  Phone,
  Twitter,
  Youtube,
  MailCheck,
  MapPinned,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import OurCoursesLink from "./OurCoursesLink";

const FooterWidget = () => {
  const importantLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Blogs", href: "/blog" },
    { name: "Branch", href: "/branch" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },

  ];

  return (
    <section className="py-8 md:py-12 px-4 bg-secondary text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
          {/* Company Info */}
          <div>
            <div className="pb-4">
              <Link href="/">
                <Image
                  src="/images/footer-logo.svg"
                  alt="Logo"
                  width={213}
                  height={36}
                />
              </Link>
            </div>
            <p className="text-sm text-white mb-6">
              E-Learning and Earning Ltd. has been the finest information
              technology service provider since 2013.
            </p>
            <div className="mt-6">
              <p className="text-sm text-white mb-2">Follow us on:</p>
              <div className="flex gap-3">
                <Link href="https://www.facebook.com/elaeltd.official" target="_blank" className=" text-white">
                  <Facebook size={20} />
                </Link>
                <Link href="https://www.linkedin.com/company/e-learning-and-earning-ltd/" target="_blank" className=" text-white">
                  <Linkedin size={20} />
                </Link>
                <Link href="https://x.com/elaeltdofficial" target="_blank" className=" text-white">
                  <Twitter size={20} />
                </Link>
                <Link href="https://www.youtube.com/@elaeltd.official" target="_blank" className=" text-white">
                  <Youtube size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div className="ps-0 sm:ps-4">
            <h3 className="font-semibold text-lg mb-4 text-white">
              Important Links
            </h3>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Courses */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">
              Our Courses
            </h3>
            <Suspense fallback={null}>
              <OurCoursesLink />
            </Suspense>

          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-white">
              <p className="flex items-center gap-2">
                {" "}
                <Phone size={20} /> 01550-666900
              </p>
              <p className="flex items-center gap-2">
                <Phone size={20} />
                01550-666900
              </p>
              <p className="flex items-center gap-2">
                {" "}
                <MailCheck size={20} /> info@e-leland.com
              </p>
              <p className="flex items-center gap-2">
                <MapPinned /> Head Office:
              </p>
              <p className="ml-6">
                Khaja IT Park, 2nd to 7th Floor,
                <br />
                Kalyanpur Bus Stop, Mirpur Road,
                <br />
                Dhaka-1207
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center text-base text-white pt-4 border-t border-primary-foreground/20">
          {/* <CopyRight /> */}
          © 2026 E-Learning and Earning Ltd. All Rights Reserved
        </div>
      </div>
    </section>
  );
};

export default FooterWidget;
