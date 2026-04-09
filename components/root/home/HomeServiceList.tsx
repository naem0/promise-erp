import { Card } from "@/components/ui/card";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "next/image";
import { fetchPublicCompanyServices } from "@/apiServices/homePageService";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";

const HomeServiceList = async () => {
  "use cache";
  cacheTag("public-services");

  let servicesData;
  try {
     servicesData = await fetchPublicCompanyServices();
  } catch (error:unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public services:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }


  const services = servicesData?.data?.services || [];
  if (!servicesData || !servicesData?.data || services?.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8 md:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle={servicesData?.data?.section_subtitle}
          title={servicesData?.data?.section_title}
          iswhite={false}
        />

        {/* ---------- FIRST ROW (services[0], services[1]) ---------- */}
        <div className="md:mb-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-20  mx-auto items-center">
          {services[0] && (
            <Card className="bg-primary p-6 group hover:bg-primary/80 transition-all hover:-translate-y-1 border-0">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-lg">
                  <Image
                    src={
                      services[0].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[0].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-white">
                    {services[0].title}
                  </h3>
                  <p className="text-sm text-white">{services[0].sub_title}</p>
                </div>
              </div>
            </Card>
          )}

          {services[1] && (
            <Card className="bg-primary p-6 group hover:bg-primary/80 transition-all hover:-translate-y-1 border-0">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-lg">
                  <Image
                    src={
                      services[1].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[1].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-white">
                    {services[1].title}
                  </h3>
                  <p className="text-sm text-white">{services[1].sub_title}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ---------- SECOND ROW (services[2], services[3], services[4]) ---------- */}
        <div className="md:mb-6 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto items-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 md:gap-6">
            {services[2] && (
              <Card className="bg-secondary p-6 group hover:bg-secondary/80 transition-all border-0 h-full">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      services[2].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[2].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {services[2].title}
                    </h3>
                    <p className="text-sm text-white">
                      {services[2].sub_title}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {services[3] && (
              <Card className="bg-primary p-6 group hover:bg-primary/80 transition-all border-0">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      services[3].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[3].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {services[3].title}
                    </h3>
                    <p className="text-sm text-white">
                      {services[3].sub_title}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* MIDDLE BIG IMAGE */}
          <div className="hidden md:flex justify-center">
            <Image
              src="/images/home/service6.png"
              width={228}
              height={228}
              alt="Service Illustration"
              className="rounded-full"
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 md:gap-6">
            {services[4] && (
              <Card className="bg-secondary p-6 group hover:bg-secondary/80 transition-all border-0 h-full">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      services[4].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[4].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {services[4].title}
                    </h3>
                    <p className="text-sm text-white">
                      {services[4].sub_title}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {services[5] && (
              <Card className="bg-primary p-6 group hover:bg-primary/80 transition-all border-0">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      services[5].logo_image || "/images/placeholder_img.jpg"
                    }
                    alt={services[5].title}
                    width={53}
                    height={53}
                    className="object-cover rounded-4xl"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {services[5].title}
                    </h3>
                    <p className="text-sm text-white">
                      {services[5].sub_title}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* ---------- THIRD ROW (services[6], services[7]) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-20 items-center">
          {services[6] && (
            <Card className="bg-secondary p-6 group hover:bg-secondary/80 transition-all border-0 h-full">
              <div className="flex items-start gap-4">
                <Image
                  src={services[6].logo_image || "/images/placeholder_img.jpg"}
                  alt={services[6].title}
                  width={53}
                  height={53}
                  className="object-cover rounded-4xl"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {services[6].title}
                  </h3>
                  <p className="text-sm text-white">{services[6].sub_title}</p>
                </div>
              </div>
            </Card>
          )}

          {services[7] && (
            <Card className="bg-secondary p-6 group hover:bg-secondary/80 transition-all border-0 h-full">
              <div className="flex items-start gap-4">
                <Image
                  src={services[7].logo_image || "/images/placeholder_img.jpg"}
                  alt={services[7].title}
                  width={53}
                  height={53}
                  className="object-cover rounded-4xl"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {services[7].title}
                  </h3>
                  <p className="text-sm text-white">{services[7].sub_title}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeServiceList;
