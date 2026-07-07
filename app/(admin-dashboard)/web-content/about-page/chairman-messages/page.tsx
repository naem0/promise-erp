import { Metadata } from "next";
import { Suspense } from "react";
import ChairmanMessagesData from "@/components/web-content/about-page/chairman-messages/ChairmanMessagesData";
import ChairmanMessagesFilterData from "@/components/web-content/about-page/chairman-messages/ChairmanMessagesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ChairmanMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Management Messages
          </h1>

          <PermissionGuard requiredPermission="create-chairman-messages">
            <Button asChild className="">
              <Link href="/web-content/about-page/chairman-messages/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Message
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <ChairmanMessagesFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
          <ChairmanMessagesData searchParams={searchParams} />
        </Suspense>
      </div>
  );
}
