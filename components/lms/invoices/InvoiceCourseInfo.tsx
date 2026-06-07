import { BatchInfo } from "@/apiServices/invoiceService";
import React from "react";

interface InvoiceCourseInfoProps {
  course: BatchInfo,
  branchName: string;
  enrollmentDate: string;
}

export function InvoiceCourseInfo({ course, branchName, enrollmentDate }: InvoiceCourseInfoProps) {
  return (
    <div className="bg-white rounded-xl border p-6 xl:col-span-7 print-card">
      <h3 className="text-base font-bold text-secondary mb-3 pb-2 border-b border-gray-100">
        Course Information
      </h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="shrink-0">Name </span>
          <span className="font-medium">
            : {course?.course?.title || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">Batch </span>
          <span className="font-medium">
            : {course?.name|| "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">Duration </span>
          <span className="font-medium">
            : {course?.batch_duration || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">Start Date </span>
          <span className="font-medium">
            : {course?.batch_start_date || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">End Date </span>
          <span className="font-medium">
            : {course?.batch_end_date || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">Branch </span>
          <span className="font-medium">
            : {branchName || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">Enrollment Date </span>
          <span className="font-medium">
            : {enrollmentDate || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
