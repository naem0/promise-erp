import { getConsultants } from "@/apiServices/crmLeadsActions";
import LeadsActivityFilter from "./LeadActivitiesFilter";
import ErrorComponent from "@/components/common/ErrorComponent";
 
export default async function LeadsActivityFilterData() {
 
    let consultants = [];
 
    try {
        const res = await getConsultants();
        consultants = res?.data?.consultants || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching consultants: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching consultants.`} />
          </div>);
      }
    }
 
    return (
        <LeadsActivityFilter
            consultants={consultants}
        />
    );
}
