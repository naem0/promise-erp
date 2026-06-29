export default function RequisitionDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header & Key Info Panel */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-24 bg-slate-200 rounded-lg" />
            <div className="h-9 w-28 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="h-8 w-8 bg-slate-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Requested Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="h-6 w-36 bg-slate-200 rounded" />
              <div className="flex items-center gap-3">
                <div className="h-9 w-20 bg-slate-200 rounded-lg" />
                <div className="h-9 w-24 bg-slate-200 rounded-lg" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <div className="p-4 space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 pb-2 border-b">
                  <div className="h-4 bg-slate-200 rounded col-span-1" />
                  <div className="h-4 bg-slate-200 rounded col-span-2" />
                  <div className="h-4 bg-slate-200 rounded col-span-1" />
                  <div className="h-4 bg-slate-200 rounded col-span-1" />
                  <div className="h-4 bg-slate-200 rounded col-span-1" />
                  <div className="h-4 bg-slate-200 rounded col-span-1" />
                </div>
                {/* Table Rows */}
                {[1, 2, 3].map((row) => (
                  <div key={row} className="grid grid-cols-7 gap-4 py-2 border-b last:border-0 items-center">
                    <div className="h-5 bg-slate-200 rounded col-span-1 w-12" />
                    <div className="h-4 bg-slate-200 rounded col-span-2" />
                    <div className="h-4 bg-slate-200 rounded col-span-1 w-12 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded col-span-1 w-12 mx-auto" />
                    <div className="h-6 bg-slate-200 rounded col-span-1 w-14 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded col-span-1 w-12 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Note Area */}
            <div className="space-y-2">
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="h-20 bg-slate-100 rounded-lg" />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <div className="h-9 w-24 bg-slate-200 rounded-lg" />
              <div className="h-9 w-28 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column: Approval Dashboard */}
        <div className="lg:col-span-1 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="h-6 w-44 bg-slate-200 rounded mb-2" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="h-7 w-7 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 bg-slate-50 border rounded-xl p-4 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
