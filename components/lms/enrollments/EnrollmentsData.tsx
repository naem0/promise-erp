
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getEnrollments } from "@/apiServices/enrollmentService";
import EnrollmentsClientTable from "./EnrollmentsClientTable";

export default async function EnrollmentsData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
    const per_page = typeof searchParams.per_page === "string" ? Number(searchParams.per_page) : 15;

    const params = {
        page,
        per_page,
        search:
            typeof searchParams.search === "string"
                ? searchParams.search
                : undefined,
        sort_order:
            typeof searchParams.sort_order === "string"
                ? searchParams.sort_order
                : "desc",
        batch_id:
            typeof searchParams.batch_id === "string"
                ? searchParams.batch_id
                : undefined,
        branch_id:
            typeof searchParams.branch_id === "string"
                ? searchParams.branch_id
                : undefined,
        course_id:
            typeof searchParams.course_id === "string"
                ? searchParams.course_id
                : undefined,
    };

    let data;
    try {
        data = await getEnrollments(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const enrollments = data?.data?.enrollments || [];
    const paginationData = data?.data?.pagination;

    if (enrollments.length <= 0) {
        return <NotFoundComponent message={data?.message} title="Enrollment List" />;
    }

    return (
        <EnrollmentsClientTable
            enrollments={enrollments}
            paginationData={paginationData}
            page={page}
            perPage={per_page}
        />
    );
}

