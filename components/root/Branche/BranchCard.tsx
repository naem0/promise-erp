
import { MapPin, Phone, Mail } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface WebBranch {
  id: number;
  name: string;
  address: string;
  phone: string[];
  email: string[];
  google_map: string;
}

interface BranchCardProps {
  branchInfo: WebBranch;
}

// ✅ Extract iframe src from API string
const getSrc = (html: string) => {
  const match = html?.match(/src="([^"]+)"/);
  return match ? match[1] : "";
};

const BranchCard = ({ branchInfo }: BranchCardProps) => {
  const { name, address, phone = [], email = [], google_map } = branchInfo;

  return (
    <Card className="flex flex-col xl:flex-row gap-4 px-4 py-3 bg-primary/10 transition-colors border border-primary/50 rounded-lg ">
      {/* Map section */}
      <div className="relative h-[162px] w-full xl:w-[200px] shrink-0 rounded-lg shadow border border-primary/50 overflow-hidden">
        {getSrc(google_map) ? (
          <iframe
            src={getSrc(google_map)}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full relative">
            <Image
              src="/images/placeholder_img.jpg"
              alt={name}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Info section */}
      <CardContent className="flex-1 px-2 flex flex-col py-1">
        <CardHeader className="p-0 mb-1">
          <h3 className="text-lg font-bold text-black">{name}</h3>
        </CardHeader>
        <div className="flex items-start gap-2 text-sm text-black mb-2">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-black" />
          <span className="leading-snug">{address}</span>
        </div>
        <div className="space-y-1">
          {phone?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-black">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{phone.join(" - ")}</span>
            </div>
          )}
          {email?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-black">
              <Mail className="h-4 w-4 shrink-0" />
              <span>{email.join(" - ")}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Call button */}
      {phone?.length > 0 && (
        <CardFooter className="flex items-end p-0">
          <Link
            href={`tel:${phone[0]}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow hover:opacity-90 transition-opacity"
            aria-label={`Call ${name}`}
          >
            <Phone className="h-5 w-5" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default BranchCard;