import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HomeMemberSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="rounded-xl">
                    <CardContent className="flex items-center justify-center p-6">
                        <Skeleton className="h-[60px] w-[160px] rounded-md" />
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

export default HomeMemberSkeleton