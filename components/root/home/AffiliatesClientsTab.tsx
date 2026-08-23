import { PartnerItem } from "@/apiServices/homePageService";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
interface PartnerItemProps {
  items: PartnerItem[];
}
const AffiliatesClientsTab = ({ items }: PartnerItemProps) => {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4 gap-2">
      {items.map((item) => (
        <Card
          key={item?.id}
          className="rounded-2xl flex flex-col items-center justify-center hover:shadow-md transition"
        >
          <CardContent className="flex flex-col items-center px-4">
            <div className="relative mb-3 shadow-none">
              <Image
                src={(item?.image && typeof item?.image === "string" && item?.image.trim() !== "") ? item?.image : "/images/placeholder_img.jpg"}
                alt={item?.title}
                height={80}
                width={160}
                className="rounded-lg object-contain"
              />
            </div>
            <p className="text-base font-semibold text-center text-secondary">
              {item?.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AffiliatesClientsTab;
