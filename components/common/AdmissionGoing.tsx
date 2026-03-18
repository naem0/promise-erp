import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdmissionGoing = () => {
  return (
    
      <section className="py-10 lg:py-14 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-2xl text-center sm:text-4xl font-bold text-white md:mb-6 mb-4">
            Admission Going On
          </h2>
          <p className="text-base sm:text-xl text-white text-center mb-6 md:mb-10 max-w-full md:max-w-2xl mx-auto">
            Join any online or offline course today and move one step closer to a stronger, future-ready career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="primary border-primary primary-border-hover">
              <Link href="/courses">Browse Course</Link>
            </Button>
            <Button asChild className="primary border-primary primary-border-hover">
              <Link href="/free-seminars">Join Free Seminar</Link>
            </Button>
          </div>
        </div>
      </section>
  );
};

export default AdmissionGoing;
