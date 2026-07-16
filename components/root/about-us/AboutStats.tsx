import { SingleCountDown } from "@/apiServices/homePageService";
import { Card, CardContent } from "@/components/ui/card";

export interface InfoItem {
gridCols?: number;
infoData: SingleCountDown[] | null;
}

const AboutStats = ({ gridCols = 3, infoData }: InfoItem) => {
  return (
    <div className="pt-4 md:pt-6">
      {/* Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-4`}
      >
        {infoData?.map((item) => {
          return (
            <Card key={item.id} className="bg-white shadow py-0">
              <CardContent className="p-6">
                <h2 className="text-4xl font-bold text-primary">
                  {item?.count}
                </h2>
                <p className="mt-2 text-secondary">{item?.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AboutStats;
