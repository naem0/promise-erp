import OurAchievements from "@/components/root/about-us/OurAchievements";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
const AboutPage = () => {
  return (
    <div className="container mx-auto px-4">
      <section className="py-10 md:py-14">
        {/* Page Title */}
        <div className="pb-4 md:pb-6">
          <div className="w-full">
            <strong className="text-primary text-xl lg:text-2xl mb-2 font-semibold">
              About Us
            </strong>
            <h1 className="text-2xl lg:text-4xl font-bold text-secondary">
              Pinnacle of Success
            </h1>
          </div>
        </div>

        {/* Chairman Card */}
        <Card className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center py-5 px-5 border border-primary/50">
          {/* Image */}
          <div className="relative w-full h-[350px] lg:h-[500px] rounded-lg">
            <Image
              src="/images/chairman-image.png"
              alt="chairman image"
              fill
              className="object-scale-down rounded-lg"
            />
          </div>

          {/* Content */}
          <CardContent className="px-0">
            <h3 className="text-secondary text-xl lg:text-2xl mb-2 font-bold">
              Message from Chairman
            </h3>

            <div className="pb-3 space-y-3 text-black/70">
              <p>
                At E-Learning & Earning Ltd., our mission has always been to
                empower the youth of Bangladesh with practical, future-ready
                skills.
              </p>
              <p>
                So far, we have trained 92,300+ learners and supported 18,000+
                successful job placements across the country. Looking ahead, our
                ambitious goal is to achieve 2,000,000 job placements and
                10,000,000 course completions, further contributing to the skill
                development of our nation.
              </p>
              <p>
                With dedication, innovation, and the support of our students,
                trainers, and partners, we continue to build a skilled,
                confident, and globally competitive Bangladesh.
              </p>
            </div>

            <p className="pb-1">
              <strong className="text-secondary text-lg font-semibold">
                Ayesha Siddika
              </strong>
            </p>
            <span className="font-semibold">Chairman</span>
            <p className="font-semibold">E-Learning & Earning Ltd.</p>
          </CardContent>
        </Card>
      </section>

      <section className="py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* Left Image */}
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
              We support you with job placement guidance and help you build real
              industry connections, so your learning can confidently turn into a
              career.
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
                    <p className="text-black/60">Industry connection access</p>
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
                  certification ensures that every process — from course design
                  to student support — follows a structured, quality-driven
                  workflow, so our learners receive reliable, consistent and
                  internationally aligned learning experiences.
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
                  provider. This recognition reflects our capability to deliver
                  structured, industry-relevant skill development programs
                  nationwide.
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
                  association for the software & ITES industry. This affiliation
                  strengthens our commitment to contributing to Bangladesh’s ICT
                  ecosystem and fostering professional growth in the digital
                  economy.
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
                  contribution within the Business Process Outsourcing and ITES
                  sector. This certification reinforces our dedication to
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

      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <Card className="py-2 px-2 border border-secondary/30 shadow">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl">
              <Image
                src="/images/why-choose-us.svg"
                alt="why choose us"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </Card>

          {/* Right Content */}
          <div>
            <h3 className="lg:text-3xl text-2xl font-semibold text-secondary mb-6">
              Why Choose Us
            </h3>

            <div className="space-y-4">
              {/* Item 1 */}
              <Card className="py-0 border border-secondary/30">
                <CardContent className="flex gap-4 p-4">
                  <div className="shrink-0">
                    <Image
                      src="/images/why-choose1.svg"
                      alt="expert instructors"
                      width={60}
                      height={60}
                      className="object-scal-down shadow-2xl rounded-full"
                    />
                  </div>

                  <div>
                    <h5 className="font-semibold text-base xl:text-lg text-secondary">
                      Expert Instructors
                    </h5>
                    <p className="text-black/60">
                      Learn from industry professionals with real project
                      experience. They simplify complex concepts so you can
                      master skills faster.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Item 2 */}
              <Card className="py-0 border border-secondary/30">
                <CardContent className="flex gap-4 p-4">
                  <div className="shrink-0">
                    <Image
                      src="/images/why-choose2.svg"
                      alt="government training"
                      width={60}
                      height={60}
                      className="object-scal-down shadow-2xl rounded-full"
                    />
                  </div>

                  <div>
                    <h5 className="font-semibold text-base xl:text-lg text-secondary">
                      Government-supported training programs
                    </h5>
                    <p className="text-black/60">
                      Receive high-quality training backed by national
                      initiatives. Our government partnerships ensure
                      credibility, accessibility, and real career impact.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Item 3 */}
              <Card className="py-0 border border-secondary/30">
                <CardContent className="flex gap-4 p-4">
                  <div className="shrink-0">
                    <Image
                      src="/images/why-choose3.svg"
                      alt="industry curriculum"
                      width={60}
                      height={60}
                      className="object-scal-down shadow-2xl rounded-full"
                    />
                  </div>

                  <div>
                    <h5 className="font-semibold text-base xl:text-lg text-secondary">
                      Industry-standard curriculum & tools
                    </h5>
                    <p className="text-black/60">
                      We follow a curriculum aligned with current industry
                      needs. You’ll learn using the same tools top professionals
                      use every day.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Item 4 */}
              <Card className="py-0 border border-secondary/30">
                <CardContent className="flex gap-4 p-4">
                  <div className="shrink-0">
                    <Image
                      src="/images/why-choose4.svg"
                      alt="job ready skills"
                      width={60}
                      height={60}
                      className="object-scal-down shadow-2xl rounded-full"
                    />
                  </div>

                  <div>
                    <h5 className="font-semibold text-base xl:text-lg text-secondary">
                      Practical, job-ready skill development
                    </h5>
                    <p className="text-black/60">
                      Every lesson is built for real-world application, not
                      theory. You’ll gain hands-on skills that translate
                      directly into employment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {/* Mission */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>
            <div className="absolute -bottom-2 -right-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>

            <Card className="text-center h-full border border-secondary/40">
              <CardContent className="p-4">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/vission-mission1.svg"
                    alt="mission image"
                    width={70}
                    height={70}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>

                <p className="text-muted-foreground">
                  Our mission is to provide quality educational opportunities to
                  develop and enable trainees to realize their potential by
                  strengthening their knowledge, IT skills, and educational
                  values.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vision */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>
            <div className="absolute -bottom-2 -right-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>

            <Card className="text-center h-full border border-secondary/40">
              <CardContent className="p-4">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/vission-mission2.svg"
                    alt="vision image"
                    width={70}
                    height={70}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>

                <p className="text-muted-foreground">
                  To be a leading IT training provider, equipping individuals
                  with future-ready skills. Our vision is to empower careers,
                  inspire innovation and help build a more tech-enabled,
                  inclusive society.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>
            <div className="absolute -bottom-2 -right-2 w-[55%] h-[65%] bg-primary -z-10 shadow-[0px_6px_10px_rgba(41,36,100,0.35)]"></div>

            <Card className="text-center h-full border border-secondary/40">
              <CardContent className="p-4">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/vission-mission3.svg"
                    alt="values image"
                    width={70}
                    height={70}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Our Values</h3>

                <p className="text-muted-foreground">
                  Driven by integrity, growth, and innovation, we make learning
                  accessible to all. We strive to inspire and equip learners for
                  the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <OurAchievements />
    </div>
  );
};

export default AboutPage;
