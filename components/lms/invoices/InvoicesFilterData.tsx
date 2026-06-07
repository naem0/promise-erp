import { getElPaymentMethods, PaymentMethod } from "@/apiServices/studentDashboardService";
import InvoicesFilter from "./InvoicesFilter";

export default async function InvoicesFilterData() {
    let paymentMethods: PaymentMethod[] = [];
    try {
        const res = await getElPaymentMethods();
        paymentMethods = res?.data || [];
    } catch (e) {
        console.error("Error fetching payment methods in InvoicesFilterData:", e);
    }

    return (
        <InvoicesFilter paymentMethods={paymentMethods} />
    );
}
