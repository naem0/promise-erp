import { getPublicContactPageInfo } from "@/apiServices/contactPageWeb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const ContactMap = async () => {
  let contactInfo = null;
  try {
    contactInfo = await getPublicContactPageInfo();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Error fetching contact map info:", error.message);
      return null;
    }
    if (error instanceof Error) {
      console.error("Error fetching contact map info:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching contact map info.");
  }

  const address =
    contactInfo?.data?.address ??
    "Office Address Not Available. Please contact us for more information.";
  const mapEmbedUrl =
    contactInfo?.data?.google_map ??
    "https://maps.app.goo.gl/gMaS3uUo2YVFA3eU7";

  return (
    <Card className="h-full py-0">
      <CardHeader className="pt-4">
        <CardTitle className="text-xl md:text-2xl text-secondary">
          Find Us
        </CardTitle>
        <p className="text-secondary text-sm">
          Visit our office for in-person consultations and course information.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map Container */}
        <div className="relative rounded-xl overflow-hidden h-64 md:h-80">
          <iframe
            src={mapEmbedUrl}
            className="w-full h-full border-0 grayscale-[22%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
            allowFullScreen
          />
        </div>

        {/* Address Card */}
        <div className="flex items-start gap-3 p-3 bg-secondary/15 rounded-xl">
          <div className="bg-secondary rounded-full p-2 shrink-0">
            <MapPin className="w-6 h-6 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-secondary text-base md:text-lg mb-1">
              E-Learning & Earning Ltd.
            </h3>
            <p className="text-muted-secondary text-base leading-relaxed">
              {address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMap;
