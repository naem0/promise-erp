
import { getBranches } from "@/apiServices/branchService"
import { getDistricts } from "@/apiServices/districtService"
import { getDivisions } from "@/apiServices/divisionService"
import BatchFilter from "./BatchFilter"

export default async function BatchFilterData() {
    const [divisionsRes, districtsRes, branchesRes] = await Promise.all([
        getDivisions({ per_page: 999 }),
        getDistricts({ per_page: 999 }),
        getBranches({ per_page: 999 }),
    ])

    return (
        <BatchFilter
            divisions={divisionsRes.data.divisions}
            districts={districtsRes.data.districts}
            branches={branchesRes.data.branches}
        />
    )
}
