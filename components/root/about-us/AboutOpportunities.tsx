import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AboutStats from "./AboutStats";

const imageUrls = {
  img1: "/images/about-opportunities1.png",
  img2: "/images/about-opportunities2.png",
  img3: "/images/about-opportunities3.png",
  img4: "/images/about-opportunities4.png",
};
export interface InfoItem {
  id: number;
  value: string;
  title: string;
}

export const infoData: InfoItem[] = [
  {
    id: 1,
    value: "85%",
    title: "Placement Rate",
  },
  {
    id: 2,
    value: "500+",
    title: "Partner Companies",
  },
  {
    id: 3,
    value: "2500+",
    title: "Students Placed",
  },
];
const AboutOpportunities = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-full md:max-w-2xl pb-6 md:pb-8">
        <h2 className="text-2xl lg:text-4xl text-secondary font-bold tracking-tight mb-4">
          Getting You Connected to Opportunities
        </h2>
        <p>
          Our comprehensive job placement guidance and industry connections{" "}
          <br></br> help you transition from skill development to your dream
          career.<br></br> Connect with mentors and discover opportunities
          tailored to your expertise.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl h-full">
        {/* Top Left - Group Discussion Image */}
        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-2">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={imageUrls.img1 || "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-between gap-4 h-full">
            <span className="bg-white w-12 h-12 flex items-center justify-center rounded-lg">
              <BriefcaseBusiness className="text-primary w-6 h-6" />
            </span>
            <h3 className="text-xl xl:text-3xl font-bold mb-4">
              Job Placement Support
            </h3>
            <p className="text-lg">Skill to job placement</p>
            <ul className="space-y-2 text-base list-inside list-disc">
              <li>Resume Building</li>
              <li>Interview Preparation</li>
              <li>Career Counseling</li>
              <li>Networking</li>
            </ul>
            <div className="">
              <Button
                asChild
                className="bg-white text-primary hover:text-white"
              >
                <Link href="//job-circulars" prefetch={true}>
                  View Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-1">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={imageUrls.img3 || "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-2">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={imageUrls.img4 || "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
      <AboutStats gridCols={3} infoData={infoData} />
    </section>
  );
};

export default AboutOpportunities;
