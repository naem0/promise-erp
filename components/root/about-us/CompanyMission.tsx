import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const CompanyMission = () => {
  return (
    <section className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Mission */}
            <div className="relative">
              <Card className="text-center shadow hover:shadow-xl h-full border border-secondary/40">
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
                    Our mission is to provide quality educational opportunities
                    to develop and enable trainees to realize their potential by
                    strengthening their knowledge, IT skills, and educational
                    values.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vision */}
            <div className="relative">
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
                    Driven by integrity, growth, and innovation, we make
                    learning accessible to all. We strive to inspire and equip
                    learners for the future.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
  )
}

export default CompanyMission
