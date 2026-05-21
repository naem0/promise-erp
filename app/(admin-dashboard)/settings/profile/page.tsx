import ProfileTabs from "@/components/admin-dashboard/settings/ProfileTabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const ProfilePage = () => {
  return (
    <section className="mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-5">
        <Link href="/dashboard" className="text-secondary">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-secondary">
          Profile Settings
        </h1>
      </div>
      <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse rounded-xl" />}>
        <ProfileTabs />
      </Suspense>
    </section>
  );
};

export default ProfilePage;
