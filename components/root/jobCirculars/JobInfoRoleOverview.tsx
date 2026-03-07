import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";
interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}
const JobInfoRoleOverview = ({jobCirculars}:JobCircularParams) => {
  return (
    <Card className="gap-2 shadow-sm py-0">
      <div className="h-2 bg-linear-to-r from-secondary via-primary to-secondary rounded-tl-xl rounded-tr-xl "></div>
      <CardHeader className="pb-0 pt-4">
        <CardTitle className="text-2xl font-bold text-secondary pb-0 flex items-center gap-2 mb-0">
          Role Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-black/60 leading-relaxed">
          {jobCirculars?.short_description || "Data not available"}
        </p>
      </CardContent>
    </Card>
  );
};

export default JobInfoRoleOverview;
