import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="md:py-10 py-16  bg-[url('/images/about-sec-bg.png')] bg-cover bg-center">
      <div className="container mx-auto px-4">
        <div className="text-white mb-10">
          <p className="text-lg font-bold mb-2">About Us</p>

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            E-Learning & Earning Ltd <br />
            Where Skills Meet Success
          </h2>
        </div>

        {/* card */}
        <Card className="rounded-2xl shadow-xl py-0 border-2 border-secondary/60">
          <CardContent className="p-6 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* left image */}
            <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden ">
              <Image
                src="/images/web-developers011.jpeg"
                alt="about"
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            {/* right content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-4 leading-relaxed">
                Empowering the next generation of IT leaders with industry-ready
                expertise.
              </h3>

              <p className="text-black/60 text-lg mb-6">
                As a premier sister concern of the Promise Group, E-Learning &
                Earning Ltd is at the forefront of the IT education revolution
                in Bangladesh. We are more than just a training institute; we
                are a career launchpad. Having already trained over 2,300
                professionals and facilitated 38,000+ successful job placements,
                our mission is to equip the youth with future-ready skills. We
                bridge the gap between classroom learning and global market
                demands, ensuring our students become competitive leaders in the
                digital landscape.
              </p>

              <Button>
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
