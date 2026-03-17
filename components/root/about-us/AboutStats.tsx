import { Card, CardContent } from "@/components/ui/card";
import { InfoItem } from "./AboutOpportunities";

const AboutStats = ({
  gridCols = 3,
  infoData,
}: {
  gridCols?: number;
  infoData: InfoItem[];
}) => {
  return (
    <div className="pt-4 md:pt-6">
      {/* Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-4`}
      >
        {infoData.map((item) => {
          return (
            <Card key={item.id} className="bg-[#EFF3EA] shadow py-0">
              <CardContent className="p-6">
                <h2 className="text-4xl font-bold text-primary">
                  {item.value}
                </h2>
                <p className="mt-2 text-secondary">{item.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AboutStats;
