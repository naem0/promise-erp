import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}

const JobKeyResponsibilities = ({jobCirculars}: JobCircularParams) => {
  return (
    <Card className="gap-4 shadow-sm py-0">
      <div className="h-2 bg-linear-to-r from-secondary via-primary to-secondary rounded-tl-xl rounded-tr-xl "></div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
          Job Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(jobCirculars?.description) }} />
      </CardContent>
    </Card>
  );
};

export default JobKeyResponsibilities;

