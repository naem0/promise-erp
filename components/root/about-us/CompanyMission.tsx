
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const CompanyMission = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-full md:max-w-2xl pb-6 md:pb-8">
        <h2 className="text-2xl lg:text-4xl text-secondary font-bold tracking-tight mb-4">
          Shaping the Future
        </h2>
        <p>
          To become a global benchmark in professional transformation and
          <br />
          sustainable growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Mission */}
        <Card className="group text-center bg-[#EFF3EA] shadow hover:shadow-xl h-full hover:bg-primary transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/vission-mission1.svg"
                alt="mission image"
                width={70}
                height={70}
              />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-secondary group-hover:text-white">
              Our Mission
            </h3>

            <p className="text-black/80 group-hover:text-white">
              Our mission is to provide quality educational opportunities
              to develop and enable trainees to realize their potential by
              strengthening their knowledge, IT skills, and educational
              values.
            </p>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card className="group text-center h-full bg-[#EFF3EA] shadow hover:shadow-xl hover:bg-primary transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/vission-mission2.svg"
                alt="vision image"
                width={70}
                height={70}
              />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-secondary group-hover:text-white">
              Our Vision
            </h3>

            <p className="text-black/80 group-hover:text-white">
              To be a leading IT training provider, equipping individuals
              with future-ready skills. Our vision is to empower careers,
              inspire innovation and help build a more tech-enabled,
              inclusive society.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <Card className="group text-center bg-[#EFF3EA] shadow hover:shadow-xl h-full hover:bg-primary transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/vission-mission3.svg"
                alt="values image"
                width={70}
                height={70}
              />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-secondary group-hover:text-white">
              Our Values
            </h3>

            <p className="text-black/80 group-hover:text-white">
              Driven by integrity, growth, and innovation, we make
              learning accessible to all. We strive to inspire and equip
              learners for the future.
            </p>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default CompanyMission;
