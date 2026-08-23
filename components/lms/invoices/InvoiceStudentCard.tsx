import { UserInfo } from "@/apiServices/invoiceService";
import Image from "next/image";

interface InvoiceStudentCardProps {
  student: UserInfo;
  invoiceId?: string;
}

export function InvoiceStudentCard({ student, invoiceId }: InvoiceStudentCardProps) {
  return (
    <div className="bg-white rounded-xl border p-5 flex items-center gap-4 print-card">
      <div className="w-14 h-14 relative">
        <Image
          src={(student?.profile_image && typeof student?.profile_image === "string" && student?.profile_image.trim() !== "") ? student?.profile_image : "/images/profile_avatar.png"}
          alt={student?.name || "Student"}
          fill
          className="rounded-full object-cover object-center"
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-secondary">{student?.name}</h2>
        <div className="text-sm text-gray-800 space-y-1">
          <p>Name : {student?.phone}</p>
          <p>Email : {student?.email}</p>
          {invoiceId && (
            <strong>Invoice ID : {invoiceId}</strong>
          )}
        </div>
      </div>
    </div>
  );
}
