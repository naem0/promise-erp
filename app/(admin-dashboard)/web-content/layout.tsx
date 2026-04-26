import { Suspense } from "react";

export default function homePageAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-4">
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </div>
  );
}
