import { getBranches } from "@/apiServices/branchService"
import { getDivisions } from "@/apiServices/divisionService"
import TeacherFilter from "./TeacherFilter"

export default async function TeacherFilterData() {
    const [divisionsRes, branchesRes] = await Promise.all([
        getDivisions({ per_page: 999 }),
        getBranches({ per_page: 999 }),
    ])

    return (
        <TeacherFilter
            divisions={divisionsRes.data.divisions}
            branches={branchesRes.data.branches}
        />
    )
}
