import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ContactPageInfoApiResponse,
  getPublicContactPageInfo,
} from "@/apiServices/contactPageWeb";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const ContactInfoCards = async () => {
  let contactInfo: ContactPageInfoApiResponse | null = null;
  try {
    contactInfo = await getPublicContactPageInfo();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="text-center py-8 md:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="text-center py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while fetching contact information." />
        </div>
      );
    }
  }
  const { email, phone, address, office_hours } = contactInfo?.data || {};

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    details: Array.isArray(email) ? email : [],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: Array.isArray(phone) ? phone : [],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: address ? [address] : [],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: office_hours ? [office_hours] : [],
  },
];
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4 w-full">
          {!contactInfo?.data?.id ? (
            <div className="col-span-full text-center py-8">
              <NotFoundComponent
                message={contactInfo?.message || "Contact info not found."}
              />
            </div>
          ) : (
            contactDetails?.map((item, index) => (
              <Card
                key={index}
                className="py-0 bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg text-white"
              >
                <CardContent className="p-2 py-3 md:p-4 flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-lg mb-2 lg:mb-4 shadow-xl border border-secondary/50">
                    <item.icon className="lg:h-8 h-6 lg:w-8 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm lg:text-lg mb-2">{item.title}</h3>
                  {item?.details?.map((detail, i) => (
                    <p key={i} className="text-sm text-white/90">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoCards;
