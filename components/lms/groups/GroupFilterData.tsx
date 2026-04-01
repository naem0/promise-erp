import { getDivisions } from "@/apiServices/divisionService";
import { getDistricts } from "@/apiServices/districtService";
import { getBranches } from "@/apiServices/branchService";
import { getBatches } from "@/apiServices/batchService";
import GroupFilter from "./GroupFilter";

export default async function GroupFilterData() {
    const divisions = await getDivisions({ per_page: 999 }).then(res => res.data?.divisions || []);
    const districts = await getDistricts({ per_page: 999 }).then(res => res.data?.districts || []);
    const branches = await getBranches({ per_page: 999 }).then(res => res.data?.branches || []);
    const batches = await getBatches({ per_page: 999 }).then(res => res.data?.batches || []);

    return (
        <GroupFilter
            divisions={divisions}
            districts={districts}
            branches={branches}
            batches={batches}
        />
    )
}