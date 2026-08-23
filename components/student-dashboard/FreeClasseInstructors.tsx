import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Instructor } from "@/apiServices/studentDashboardService";
import Image from "next/image";

interface FreeClasseInstructorsProps {
  seminarData: Instructor[];
}
const FreeClasseInstructors = ({ seminarData }: FreeClasseInstructorsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl text-secondary font-bold border-b border-secondary/50 pb-2">
          Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {seminarData?.length > 0
          ? seminarData?.map((instructor) => (
              <div
                key={instructor.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-start"
              >
                <Avatar className="h-24 w-24">
                  <Image
                    src={(instructor?.profile_image && typeof instructor?.profile_image === "string" && instructor?.profile_image.trim() !== "") ? instructor?.profile_image : "/images/placeholder_img.jpg"}
                    alt={instructor?.name}
                    width={100}
                    height={100}
                    className="object-scale-down rounded-full shadow-2xl border-2 border-secondary"
                  />
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg text-secondary">
                      {instructor?.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {instructor?.designation}
                    </p>
                    <p className="text-primary text-sm">Certified Trainer 🎯</p>
                    <p className="text-muted-foreground text-sm">
                      {instructor?.experience} + Years of Experience
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-center text-sm">Expert in:</p>
                  <div className="flex gap-2">
                    {instructor?.instructors_tools?.map((tool) => (
                      <div
                        key={tool?.id}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
                      >
                        <Image
                          src={(tool?.image && typeof tool?.image === "string" && tool?.image.trim() !== "") ? tool?.image : "/images/placeholder_img.jpg"}
                          alt={tool?.image || "image"}
                          width={30}
                          height={30}
                          className="object-scale-down rounded-full shadow-2xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          : null}
      </CardContent>
    </Card>
  );
};

export default FreeClasseInstructors;
