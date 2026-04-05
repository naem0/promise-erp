import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import NewsFeedsFilterData from "@/components/web-content/news-feeds/NewsFeedsFilterData";
import NewsFeedsData from "@/components/web-content/news-feeds/NewsFeedsData";   
import PermissionGuard from "@/components/auth/PermissionGuard";

const NewsFeedsPage = ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">News Feeds</h1>
        <PermissionGuard requiredPermission="create-news-feed">
          <Button asChild>
              <Link href="/web-content/news-feeds/add">  
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add News Feed
              </Link>
          </Button>
        </PermissionGuard>
        </div>
        <Suspense fallback={<div>Loading Search...</div>}>
        <NewsFeedsFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <NewsFeedsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};  
export default NewsFeedsPage;
