import RequisitionShippingForm from "@/components/inventory/requisitions/shipping/RequisitionShippingForm";
import { getShippingDetails } from "@/apiServices/inventoryDeliveriesService";
import { getDeliveryPartners } from "@/apiServices/inventoryDeliveryPartnersService";
import { getEmployees } from "@/apiServices/employeeService";

interface BulkShippingPageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function BulkRequisitionShippingPage({
  searchParams,
}: BulkShippingPageProps) {
  const { ids } = await searchParams;

  let requisitionsData: any[] = [];
  let deliveryPartners: any[] = [];
  let employees: any[] = [];
  let errorMsg = "";

  if (ids) {
    try {
      // 1. Fetch shipping details of the selected requisitions
      const shippingRes = await getShippingDetails(ids);
      if (shippingRes && shippingRes.success && shippingRes.data) {
        requisitionsData = Array.isArray(shippingRes.data)
          ? shippingRes.data
          : [shippingRes.data];
      }

      // 2. Fetch delivery partners
      const partnersRes = await getDeliveryPartners({ per_page: 100 });
      if (partnersRes && partnersRes.success && partnersRes.data) {
        deliveryPartners = partnersRes.data.delivery_partners || [];
      }

      // 3. Fetch employees (users)
      const employeesRes = await getEmployees({ per_page: 100 });
      if (employeesRes && employeesRes.success && employeesRes.data) {
        employees = employeesRes.data.employees || [];
      }
    } catch (err: any) {
      console.error("Error fetching shipping page data:", err);
      errorMsg = err.message || "Failed to load requisition/shipping details.";
    }
  }

  return (
    <div className="mx-auto">
      {errorMsg ? (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          <span className="font-semibold">Error:</span> {errorMsg}
        </div>
      ) : (
        <RequisitionShippingForm
          initialRequisitions={requisitionsData}
          deliveryPartners={deliveryPartners}
          employees={employees}
        />
      )}
    </div>
  );
}

