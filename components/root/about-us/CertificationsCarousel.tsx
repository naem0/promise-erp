import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ErrorComponent from "@/components/common/ErrorComponent";
import { getPublicLicensesCertificate } from "@/apiServices/aboutPageService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const CertificationsSection = async () => {
  let certificateList;
  try {
    // Fetch branches
    certificateList = await getPublicLicensesCertificate();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
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

  if (!certificateList || !certificateList?.success || !certificateList?.data) {
    return null;
  }

  return (
    <div className="w-full py-8 lg:py-20">
      <div className="text-center">
        <h3 className="text-3xl mb-3 font-semibold text-secondary">
          Certified for Excellence & Trust
        </h3>
        <p className="text-black/60 leading-relaxed max-w-full lg:max-w-[700px] mx-auto">
          E-Learning & Earning Ltd. upholds the highest standards of quality and
          operational compliance, validated by both national and international
          authorities. These certifications are more than just logos; they serve
          as a guarantee that our curriculum, training methodology, and student
          support systems meet the strict requirements of the global IT
          industry.
        </p>
      </div>

      <div className="space-y-12 pt-6 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-4 lg:gap-6">
          {certificates?.length > 0 ? (
            certificates?.map((cert, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={cert.id}
                  className="grid lg:grid-cols-2 items-center gap-4 h-full"
                >
                  {/* Image */}
                  <Card
                    className={`py-0 shadow-none border-0 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <CardContent className="px-0 lg:px-4 flex justify-start pt-0">
                      <div className="relative w-full h-[280px] md:h-[380px]">
                        <Image
                          src={(cert.image && typeof cert.image === "string" && cert.image.trim() !== "") ? cert.image : "/images/placeholder_img.jpg"}
                          alt={cert.title || "image"}
                          fill
                          className="object-contain px-0 lg:px-4"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text */}
                  <div
                    className={`px-0 lg:px-4 py-4 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                      {cert?.title}
                    </h3>
                    <p className="text-black/60 leading-relaxed text-base">
                      {cert?.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 md:py-12">
              <NotFoundComponent
                message={
                  certificateList?.message || "Failed to fetch certificates"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CertificationsSection;
