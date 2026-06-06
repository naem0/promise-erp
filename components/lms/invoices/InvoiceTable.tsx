
import { InvoicesResponse } from "@/apiServices/invoiceService";
import Pagination from "@/components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface InvoiceTableProps {
  data: InvoicesResponse;
  basePath?: string;
}

export function InvoiceTable({ data, basePath = "/lms/invoices" }: InvoiceTableProps) {
  const { invoices, pagination } = data?.data;
  const startIndex = pagination?.from ?? 1;

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left">
          <TableHeader className="bg-[#e8f3ef] hover:bg-[#e8f3ef] border-b">
            <TableRow className="hover:bg-transparent border-b">
              {[
                "Sl",
                "Actions",
                "Invoice ID",
                "Student Name",
                "Amount",
                "Due Date",
                "Paid At",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="px-6 py-4 font-semibold text-black border-r last:border-r-0 h-auto text-center"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <TableRow
                  key={invoice.id}
                  className="border-b hover:bg-gray-50"
                >
                  <TableCell className="px-6 py-4 border-r text-black">
                    {startIndex + index}
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r text-center">
                    <Link href={`${basePath}/${invoice.id}`}>
                      <Badge
                        variant="default"
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer select-none"
                      >
                        Action
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r">
                    <Link href={`${basePath}/${invoice.id}`} className="text-secondary underline cursor-pointer font-medium">
                      {invoice?.invoice_no ?? "-"}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full ">
                        <Image
                          src={
                            invoice?.profile_image ??
                            "/images/profile_avatar.png"
                          }
                          alt={invoice?.student_name ?? "Student Profile"}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <span className="text-black">
                        {invoice?.student_name ?? "-"} <br />
                        {invoice?.student_email ?? "-"}
                        <br />
                        {invoice?.student_phone ?? "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r text-center text-black">
                    ৳ {invoice?.final_amount ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r text-center text-black">
                    {invoice?.due_date ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 border-r text-center text-black">
                    {invoice?.paid_at ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                      {invoice?.status_text ?? "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-6 py-8 text-center text-lg text-black"
                >
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.total > 0 && (
        <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {pagination.last_page > 1 && <Pagination pagination={pagination} />}
        </div>
      )}
    </div>
  );
}
