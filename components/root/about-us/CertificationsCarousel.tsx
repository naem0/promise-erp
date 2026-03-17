import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ErrorComponent from "@/components/common/ErrorComponent";
import { getPublicLicensesCertificate } from "@/apiServices/aboutPageService";

const CertificationsSection = async () => {
  let certificateList;
  try {
    // Fetch branches
    certificateList = await getPublicLicensesCertificate();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch Certificates:", error.message);
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={certificateList?.message || "Failed to fetch certificates"}
          />
        </div>
      );
    } else {
      console.error("Failed to fetch Certificates:", error);
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  const certificates = certificateList?.data?.licenses || [];

  return (
    <div className="w-full px-4 py-10 space-y-10">
      <div className="">
        <h3 className="text-3xl font-semibold mb-4 text-secondary">
          Certified for Excellence
        </h3>
        <p className="text-black/60 leading-relaxed">
          Building trust through globally verified standards and industry-{" "}
          <br></br>leading certifications that define our commitment to quality.
        </p>
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 items-center gap-6">
          {/* {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className={`grid lg:grid-cols-2 items-center rounded-xl gap-4 bg-[#EFF3EA] shadow p-2 h-full ${index === 1 ? "md:col-span-2" : ""}`}
            >
              <Card className="py-0 shadow-none">
                <CardContent className="p-2 flex justify-center">
                  <div className="relative w-full h-[280px] md:h-[380px]">
                    <Image
                      src={cert.image || "/images/placeholder_img.jpg"}
                      alt={cert.title || "image"}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="px-4 py-4">
                <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                  {cert.title}
                </h3>
                <p className="text-black/60 leading-relaxed text-base">
                  {cert.description}
                </p>
              </div>
            </div>
          ))} */}
          {certificates.map((cert, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={cert.id}
                className="grid lg:grid-cols-2 items-center rounded-xl gap-4 bg-[#EFF3EA] shadow p-2 h-full"
              >
                {/* Image */}
                <Card
                  className={`py-0 shadow-none ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <CardContent className="p-2 flex justify-center">
                    <div className="relative w-full h-[280px] md:h-[380px]">
                      <Image
                        src={cert.image || "/images/placeholder_img.jpg"}
                        alt={cert.title || "image"}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Text */}
                <div
                  className={`px-4 py-4 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-black/60 leading-relaxed text-base">
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CertificationsSection;
