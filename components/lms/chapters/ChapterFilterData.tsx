import { getBranches } from "@/apiServices/branchService"
import { getBatches } from "@/apiServices/batchService"
import ChapterFilter from "./ChapterFilter"

export default async function ChapterFilterData() {
    const [branchesRes, batchesRes] = await Promise.all([
        getBranches({ per_page: 999 }),
        getBatches({ per_page: 999 }),
    ])

    return (
        <ChapterFilter
            branches={branchesRes.data.branches}
            batches={batchesRes.data.batches}
        />
    )
}
