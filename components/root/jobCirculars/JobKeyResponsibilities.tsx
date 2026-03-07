import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}

const JobKeyResponsibilities = ({jobCirculars}: JobCircularParams) => {
  return (
    <Card className="gap-4 shadow-sm py-0">
      <div className="h-2 bg-linear-to-r from-secondary via-primary to-secondary rounded-tl-xl rounded-tr-xl "></div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
          Key Responsibilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <p>{jobCirculars?.description || "Data not available"}</p>
      </CardContent>
    </Card>
  );
};

export default JobKeyResponsibilities;

