import AboutSection from "@/components/root/about-us/AboutSection";
import CompanyMission from "@/components/root/about-us/CompanyMission";
import OurAchievements from "@/components/root/about-us/OurAchievements";
import WhyChooseUs from "@/components/root/about-us/WhyChooseUs";
import WhyChooseUsSkeleton from "@/components/root/about-us/WhyChooseUsSkeleton";
import TeamMemberCardSkeleton from "@/components/root/ourOfficers/TeamMemberCardSkeleton";
import TeamMemberCardWrapper from "@/components/root/ourOfficers/TeamMemberCardWrapper";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Suspense } from "react";
const AboutPage = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <section className="py-10 md:py-12">
          <div className="max-w-full lg:max-w-6xl mx-auto">
            <Suspense fallback={<TeamMemberCardSkeleton />}>
              <TeamMemberCardWrapper />
            </Suspense>
          </div>
        </section>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <WhyChooseUs />
        </Suspense>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <CompanyMission />
        </Suspense>
      </div>

      <Suspense fallback={<h1>Loading...</h1>}>
        <AboutSection />
      </Suspense>
      <div className="container mx-auto px-4">
        <section className="py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            <Card className="py-2 px-2 border border-secondary/30 shadow">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl">
                <Image
                  src="/images/oppurtunity-main-img.svg"
                  alt="chairman image"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </Card>

            {/* Right Content */}
            <div>
              <h3 className="text-3xl lg:text-4xl 2xl:text-6xl font-bold text-secondary mb-4 leading-tight">
                Getting You Connected to Opportunities
              </h3>

              <p className="text-black/50 mb-6 text-lg">
                We support you with job placement guidance and help you build
                real industry connections, so your learning can confidently turn
                into a career.
              </p>

              {/* Inner Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="py-0 border border-secondary/30 shadow">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="shrink-0">
                      <Image
                        src="/images/job-placement.svg"
                        alt="opportunities image"
                        width={60}
                        height={60}
                      />
                    </div>

                    <div>
                      <h5 className="font-semibold text-base xl:text-lg text-secondary">
                        Job Placement Support
                      </h5>
                      <p className="text-black/60">Skill to job placement</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-0 border border-secondary/30 shadow">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="shrink-0">
                      <Image
                        src="/images/industry.svg"
                        alt="opportunities image"
                        width={60}
                        height={60}
                      />
                    </div>

                    <div>
                      <h5 className="font-semibold text-base xl:text-lg text-secondary">
                        Industry Networking
                      </h5>
                      <p className="text-black/60">
                        Industry connection access
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="mx-auto">
            {/* Title */}
            <div className="text-center mb-6 lg:mb-12">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-secondary">
                Standing on Recognized Standards
              </h1>
            </div>

            <div className="space-y-10">
              {/* ISO */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image
                          src="/images/iso-image.svg"
                          alt="iso image"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    ISO Certified institute
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    E-Learning & Earning Ltd. is proudly certified under ISO
                    9001:2015 Quality Management System — which reflects our
                    commitment to maintaining global standards in training,
                    service delivery, and operational excellence. This
                    certification ensures that every process — from course
                    design to student support — follows a structured,
                    quality-driven workflow, so our learners receive reliable,
                    consistent and internationally aligned learning experiences.
                  </p>
                </div>
              </div>

              {/* BCC */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    BCC Accredited Training Provider
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    E-Learning & Earning Ltd. is officially accredited by the
                    Bangladesh Computer Council (BCC) as a trusted training
                    provider. This recognition reflects our capability to
                    deliver structured, industry-relevant skill development
                    programs nationwide.
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image
                          src="/images/bcc-accerdit.svg"
                          alt="bcc image"
                          fill
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* BASIS */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image
                          src="/images/basis-recognize.svg"
                          alt="basis image"
                          fill
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    BASIS Recognized Member
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    We are a proud recognized member of BASIS — the national
                    association for the software & ITES industry. This
                    affiliation strengthens our commitment to contributing to
                    Bangladesh’s ICT ecosystem and fostering professional growth
                    in the digital economy.
                  </p>
                </div>
              </div>

              {/* BACCO */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    Certified BACCO Member
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    E-Learning & Earning Ltd. is a certified member of BACCO,
                    validating our compliance, reliability, and active
                    contribution within the Business Process Outsourcing and
                    ITES sector. This certification reinforces our dedication to
                    maintaining industry standards and quality service delivery.
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image src="/images/bacco.svg" alt="bacco image" fill />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* NSDA */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image src="/images/nsda.svg" alt="nsda image" fill />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    NSDA Registered Training Institute
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    Recognized by the National Skills Development Authority
                    (NSDA), under the Prime Minister’s Office, as an official IT
                    training provider committed to delivering quality skill
                    development programs.
                  </p>
                </div>
              </div>

              {/* DYD */}
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    DYD Registered Training Organization
                  </h3>
                  <p className="text-black/60 leading-relaxed text-lg ">
                    Certified by the Department of Youth Development (DYD),
                    Government of the People’s Republic of Bangladesh, for
                    providing youth-focused skill development and training
                    programs that promote employment and entrepreneurship.
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <Card className="py-0 border border-secondary/30 shadow">
                    <CardContent className="p-2 flex justify-center">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image src="/images/dyd.svg" alt="dyd image" fill />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OurAchievements />
      </div>
    </>
  );
};

export default AboutPage;
