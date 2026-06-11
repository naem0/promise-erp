import { Consultant, getConsultants } from "@/apiServices/crmLeadsActions";
import ErrorComponent from "@/components/common/ErrorComponent";
import CRMLeadReportsFilter from "./CRMLeadReportsFilter";

export default async function CRMLeadReportsFilterData() {
    let consultants: Consultant[] = [];

    try {
        const res = await getConsultants();
        consultants = res?.data?.consultants || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching consultants: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching consultants.`} />
                </div>
            );
        }
    }

    return (
        <CRMLeadReportsFilter
            consultants={consultants}
        />
    );
}
