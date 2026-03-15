import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CourseInstructor } from "@/apiServices/courseDetailPublicService";
import { PublicInstructor } from "@/apiServices/studentDashboardService";
import Image from "next/image";

const INSTRUCTOR_PLACEHOLDER = "https://placehold.co/200x200/4f46e5/ffffff/png?text=Instructor";

export const InstructorsSection = ({ instructors, title }: { instructors: CourseInstructor[] | PublicInstructor[] ; title: string }) => {
  if (instructors?.length === 0) return null;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-500">{title || "Instructors"}</h2>
        <Carousel opts={{align: "start", loop: true}} className="w-full max-w-full">
          <CarouselContent>
            {instructors?.map((instructor, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/1 lg:basis-1/2">
                <Card className="shadow-md animate-in fade-in duration-500 hover:scale-95 transition-transform p-0">
                  <CardContent className="p-6 space-y-4 sm:flex gap-6">
                    <div className="bg-muted rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={instructor.profile_image || INSTRUCTOR_PLACEHOLDER}
                        alt={instructor.name}
                        width={200}
                        height={200}
                        className="object-cover aspect-square"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-1">{instructor.name}</h3>
                      {/* <p className="text-sm text-muted-foreground">{instructor.email}</p> */}
                      <p className="text-muted-foreground mb-1">{instructor.designation}</p>
                      <p className="text-sm text-primary mb-1">Certified Trainer</p>
                      <p className="text-sm text-muted-foreground mb-3">{instructor.experience} of Experience</p>

                      <p className="text-secondary font-medium">Expert in</p>
                      <div className="flex gap-2 mt-2">
                        {instructor?.instructors_tools?.map((tool, idx) => (
                          <Image
                            src={tool.image || INSTRUCTOR_PLACEHOLDER}
                            alt={('title' in tool ? tool.title : instructor.name) || instructor.name}
                            width={36}
                            height={36}
                            key={idx}
                            className="rounded h-10 w-10 object-cover"
                          >

                          </Image>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-primary text-white" />
          <CarouselNext className="bg-primary text-white" />
        </Carousel>
      </CardContent>
    </Card >
  );
};
