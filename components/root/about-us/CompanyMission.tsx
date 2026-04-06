import { getPublicCompanyMissionSection } from "@/apiServices/aboutPageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const CompanyMission = async () => {
  let companyMissionData;

  try {
    companyMissionData = await getPublicCompanyMissionSection();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={
              companyMissionData?.message ||
              "Failed to fetch company mission data"
            }
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  const missions = companyMissionData?.data?.company_mission || [];

  return (
    <section className="py-8 md:py-12">
      {/* Header */}
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

      {/* Dynamic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {missions.length > 0 ? (
          missions.map((item) => (
            <Card
              key={item.id}
              className="group text-center bg-white shadow hover:shadow-xl h-full hover:bg-primary transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <Image
                    src={item.image || "/images/vission-mission1.svg"}
                    alt={item.type}
                    width={50}
                    height={50}
                    className=" rounded-xl bg-white/80 p-2"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-secondary group-hover:text-white capitalize">
                  {item.title || "Title"}
                </h3>

                <p className="text-black/80 group-hover:text-white">
                  {item.sub_title || "Sub Title"}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-8 md:py-12">
            <NotFoundComponent
              message={
                companyMissionData?.message || "No company mission found"
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyMission;
