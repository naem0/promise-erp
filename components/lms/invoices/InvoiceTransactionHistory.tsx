
import { PaymentHistory } from "@/apiServices/invoiceService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceTransactionHistoryProps {
  transactions: PaymentHistory[];
}

export function InvoiceTransactionHistory({
  transactions,
}: InvoiceTransactionHistoryProps) {
  return (
    <div className="bg-white rounded-xl border p-6 lg:col-span-5 flex flex-col justify-between print-card">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Transaction History
        </h3>
        <div className="rounded-lg border overflow-hidden">
          <Table className="w-full text-xs text-left">
            <TableHeader className="bg-[#e8f3ef] hover:bg-[#e8f3ef]">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Payment By
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Transaction ID & Date
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700 text-right">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t, idx) => (
                <TableRow
                  key={idx}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <TableCell className="px-4 py-3 font-medium text-gray-900">
                    {t?.payment_details?.payment_method_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    <span className="font-semibold text-gray-800">
                      TX ID: {t.payment_details?.transaction_id ?? "N/A"}
                    </span>
                    <br />
                    <span className="text-[10px] text-gray-400">
                      Date : {t?.payment_details?.date || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-medium text-gray-900">
                    ৳ {t?.payment_details?.paid_amount ?? 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
