import RolesWrapper from "@/components/access-control/RolesWrapper";
import { Suspense } from "react";
export default function RolesPage() {
  return (
    <Suspense fallback={<div>Loading roles...</div>}>
      <RolesWrapper />
    </Suspense>
  );
}

