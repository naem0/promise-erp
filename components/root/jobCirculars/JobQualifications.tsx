import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}

const JobQualifications = ({ jobCirculars }: JobCircularParams) => {
  const qualifications = jobCirculars?.tools || [];
  return (
    <Card className="gap-4 shadow-sm py-0">
      <div className="h-2 bg-linear-to-r from-secondary via-primary to-secondary rounded-tl-xl rounded-tr-xl "></div>
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
          Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {qualifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-black">{item.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobQualifications;
