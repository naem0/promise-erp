import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentPaymentHistories } from "@/apiServices/studentDashboardService";
import NotFoundComponent from "../common/NotFoundComponent";

export const PaymentHistoryCard = async () => {
  const params: Record<string, unknown> = {
    per_page: 30,
    page: 1,
  };

  const payment = await getStudentPaymentHistories({ params });
  const histories = payment?.data?.payment_histories ?? [];
  if (histories.length === 0) {
    return <NotFoundComponent message={payment?.message} title="Payment history" />;
  }

  return (
    <>
      {histories.map((payment) => (
        <Card
          key={payment.payment_details.id}
          className="mb-4 py-0 bg-secondary/5 border border-secondary/20"
        >
          <CardContent className="px-2 py-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-0">
              <Image
                src={(payment.payment_details.image && typeof payment.payment_details.image === "string" && payment.payment_details.image.trim() !== "") ? payment.payment_details.image : "/images/placeholder_img.jpg"}
                alt={payment.payment_details.title || "Course Image"}
                width={150}
                height={70}
                className="rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold leading-tight">
                  {payment.payment_details.title || "Untitled Course"}
                </h3>
              </div>
            </div>

            <div className="border-t border-secondary/20 my-3" />

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-3 px-4 text-sm">
              <div className="col-span-6 sm:col-span-2">
                <p className="text-base font-semibold text-secondary pb-2">
                  Price
                </p>
                <p className="font-semibold text-sm">
                  ট {payment.payment_details.price ?? "--"}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <p className="text-base font-semibold text-secondary pb-2">
                  Installment Type
                </p>
                <p className="font-semibold text-sm">
                   {payment.payment_details.installment_type}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <p className="text-base font-semibold text-secondary pb-2">
                  Paid Amount
                </p>
                <p className="font-semibold text-sm">
                  ট {payment.payment_details.paid_amount}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <p className="text-base font-semibold text-secondary pb-2">
                  Payment Date
                </p>
                <p className="font-semibold text-sm">
                   {payment.payment_details.payment_date}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <p className="text-base font-semibold text-secondary pb-2">
                  Due
                </p>
                <p
                  className={`font-semibold text-sm ${
                    payment.payment_details.due === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ট {payment.payment_details.due}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-2 flex items-center">
                <div>
                  <p className="font-semibold text-sm mb-1">Status</p>
                  <Badge
                    className={`font-semibold text-sm ${
                      payment.payment_details.status === "Paid"
                        ? "bg-primary/60 hover:bg-primary text-white"
                        : "bg-secondary/60 text-white hover:bg-secondary"
                    }`}
                  >
                    {payment.payment_details.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
export default PaymentHistoryCard;
