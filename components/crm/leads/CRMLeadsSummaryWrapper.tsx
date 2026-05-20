import { CRMCategory, getCRMCategories } from "@/apiServices/crmCategoryService";
import { ArrowDown, ArrowUp, Briefcase, Users } from "lucide-react";

export default async function CRMLeadsSummaryWrapper() {
  let categories: CRMCategory[] = [];
  let results;
  
  try {
     results = await getCRMCategories();
    if (results?.success) {
      categories = results?.data?.categories;
    }
  } catch (error : unknown) {
    if (error instanceof Error) {
      console.error("Error fetching CRM categories:", error.message);
    } else {
      console.error("Unknown error fetching CRM categories");
    }
  }

  if ( !results || !results?.success || !results?.data || !categories.length) {
    return null;
  }

  const palette = [
    "#00B686", // green
    "#2D76E5", // blue
    "#9148EF", // purple
    "#E67E00", // orange
    "#E64A6E", // pink
    "#00B8E6", // cyan
  ];

  const getCardColor = (index: number): string => {
    if (index < palette.length) return palette[index];
    const extraIndex = index - palette.length;
    const hue =
      160 +
      Math.round(
        (extraIndex / Math.max(1, categories.length - palette.length)) *
          180,
      );
    return `hsl(${hue}, 65%, 45%)`;
  };

  // 2 fixed icons that will alternate
  const icons = [Users, Briefcase];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {categories.map((category, index) => {
        const bg = getCardColor(index);
        const Icon = icons[index % icons.length];
        
        // Parse from_last_week
        const fromLastWeek = (category as { from_last_week?: string }).from_last_week || "";
        const isPositive = fromLastWeek.startsWith("+");
        const isNegative = fromLastWeek.startsWith("-");
        
        const percentageText = fromLastWeek.replace(/^[+-]/, '').trim() || "0.0% From Last Week";

        return (
          <div 
            key={category.id} 
            className="text-white rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden"
            style={{ backgroundColor: bg }}
          >
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-lg">{category.name}</h3>
            </div>

            {/* Content & Large Icon */}
            <div className="flex items-end justify-between mt-4 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{category.total_lead}</span>
                <span className="text-xl font-medium opacity-90">Students</span>
              </div>
            </div>
            
            {/* Faint Background Icon */}
            <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 z-0" strokeWidth={1.5} />

            {/* Footer Pill */}
            <div className="mt-6 relative z-10">
              <div className="flex items-center gap-1 text-sm bg-white/20 w-fit px-3 py-1 rounded-md">
                {isPositive ? (
                  <ArrowUp className="w-4 h-4" />
                ) : isNegative ? (
                  <ArrowDown className="w-4 h-4" />
                ) : null}
                <span>{percentageText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
