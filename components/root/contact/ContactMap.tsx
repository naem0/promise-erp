import { getPublicContactPageInfo } from "@/apiServices/contactPageWeb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { use } from "react";

const ContactMap = () => {
  const contactInfo = use(getPublicContactPageInfo());

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

          {/* Custom Marker Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
            <div className="bg-secondary rounded-full p-2 shadow-lg">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="flex items-start gap-3 p-3 bg-secondary/15 rounded-xl">
          <div className="bg-secondary rounded-full p-2 shrink-0">
            <MapPin className="w-4 h-4 text-white" />
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
