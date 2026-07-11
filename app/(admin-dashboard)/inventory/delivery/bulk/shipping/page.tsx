import RequisitionShippingForm from "@/components/inventory/requisitions/shipping/RequisitionShippingForm";
import { getShippingDetails, RequisitionShippingDetail } from "@/apiServices/inventoryDeliveriesService";
import { getDeliveryPartners, DeliveryPartner } from "@/apiServices/inventoryDeliveryPartnersService";
import { getEmployees, Employee } from "@/apiServices/employeeService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface BulkShippingPageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function BulkRequisitionShippingPage({
  searchParams,
}: BulkShippingPageProps) {
  const { ids } = await searchParams;

  if (!ids) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message="No requisition IDs provided for bulk shipping." />
      </div>
    );
  }

  // 1. Fetch shipping details of the selected requisitions
  let shippingRes;
  try {
    shippingRes = await getShippingDetails(ids);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!shippingRes) {
    return null;
  }

  if (!shippingRes?.data) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message={shippingRes?.message || "Requisition/shipping details not found."} />
      </div>
    );
  }

  const requisitionsData: RequisitionShippingDetail[] = Array.isArray(shippingRes.data)
    ? shippingRes.data
    : [shippingRes.data];

  // 2. Fetch delivery partners
  let partnersRes;
  try {
    partnersRes = await getDeliveryPartners({ per_page: 100 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error fetching delivery partners: ${error.message}`} />
        </div>
      );
    }
    return (
      <div className="py-8 md:py-12">
        <ErrorComponent message="An unexpected error occurred while fetching delivery partners." />
      </div>
    );
  }

  const deliveryPartners: DeliveryPartner[] = partnersRes?.data?.delivery_partners || [];

  // 3. Fetch employees (users)
  let employeesRes;
  try {
    employeesRes = await getEmployees({ per_page: 100 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error fetching employees: ${error.message}`} />
        </div>
      );
    }
    return (
      <div className="py-8 md:py-12">
        <ErrorComponent message="An unexpected error occurred while fetching employees." />
      </div>
    );
  }

  const employees: Employee[] = employeesRes?.data?.employees || [];

  return (
    <div className="mx-auto">
      <RequisitionShippingForm
        initialRequisitions={requisitionsData}
        deliveryPartners={deliveryPartners}
        employees={employees}
      />
    </div>
  );
}

