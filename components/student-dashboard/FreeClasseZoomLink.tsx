import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeSeminar } from "@/apiServices/studentDashboardService";
import Link from "next/link";

interface FreeClasseSessionProps {
  seminarData: FreeSeminar;
}
const FreeClasseZoomLink = ({ seminarData }: FreeClasseSessionProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-2xl text-secondary border-b border-secondary/50 pb-2">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 text-orange-500" />
            <div>
              <p className="font-semibold text-secondary text-lg">
                {seminarData?.seminar_date}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-orange-500" />
            <div>
              <p className="font-semibold text-secondary text-lg">{seminarData?.seminar_time_formatted}</p>
            </div>
          </div>

          {/* Medium */}
          <div>
            <p className="mb-1 font-semibold text-secondary">
              Medium: {seminarData?.location}
            </p>
          </div>

          {/* Joining Link */}
          <div className="space-y-2">
            <p className="font-semibold text-secondary">Joining Link:</p>
            <div className="flex items-center gap-2">
              <Link
                href={seminarData?.seminar_link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 break-all text-blue-600 text-sm hover:underline"
              >
                {seminarData?.seminar_link ?? "---"}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-green-600 hover:text-green-700"
                aria-label="Copy joining link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeClasseZoomLink;
