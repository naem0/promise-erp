
const InvoiceDetailFallback = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default InvoiceDetailFallback;
