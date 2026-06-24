import Image from "next/image";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { getCourseWiseDuePayments } from "@/apiServices/studentDashboardService";
import NotFoundComponent from "../common/NotFoundComponent";
import ErrorComponent from "../common/ErrorComponent";

const PaymentCard = async () => {
  let duePayments;
  try {
    duePayments = await getCourseWiseDuePayments();
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
    console.error("getCourseWiseDuePayments Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return <ErrorComponent message={message} />;
  }

  const duePayment = duePayments?.data?.due_payments || [];
  if (duePayment.length === 0) {
    return (
      <NotFoundComponent message={duePayments?.message} title="Due Payment" />
    );
  }

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
      {duePayment.map((payment) => (
        <Card key={payment.id} className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0">
              <Image
                src={payment.course_image || "/images/placeholder_img.jpg"}
                alt={payment.course_title}
                width={100}
                height={70}
                className="w-full h-full object-cover"
              />
            </div>

            <CardTitle className="text-base text-secondary font-semibold leading-snug">
              {payment.course_title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary font-semibold">Course Price</span>
              <span className="font-semibold text-black/80 ">
                {payment.price}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary font-semibold">Total Paid</span>
              <span className="font-semibold text-black/80">
                {payment.total_paid}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary font-semibold">Due Amount</span>
              <span className="font-semibold">{payment.due_amount}</span>
            </div>

            {/* <div className="flex justify-between">
            <span className="text-secondary font-semibold">Next Payment</span>
            <span className="font-semibold text-black/80 ">
              {payment.next_payment_date || "N/A"}
            </span>
          </div> */}
          </CardContent>
          {/* <CardFooter className="mx-auto">
            <DuePaymentPayNow />
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
};

export default PaymentCard;
