import MainFooter from "@/components/common/MainFooter";
import MainHeader from "@/components/common/MainHeader";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className="">
        {children}
        <div className="hidden sm:block">
          <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30">
            <Link
              href="/free-seminar"
              className="bg-primary text-white px-4 py-3 rounded-r-lg text-sm sm:text-base font-bold
      writing-vertical shadow-lg hover:px-3 transition-all
      flex items-center gap-1"
            >
              Free Seminar
            </Link>
          </div>

          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
            <Link
              href="/courses"
              className="bg-primary text-white px-4 py-3 rounded-l-lg text-sm sm:text-base font-bold
      writing-vertical shadow-lg hover:px-3 transition-all
      flex items-center gap-1"
            >
              Browse Course
            </Link>
          </div>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
