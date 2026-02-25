import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ContactInfoCardsSkeleton = () => {
  // We'll render 4 skeleton cards like in your actual component
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="bg-secondary/10 border-none shadow-lg text-white animate-pulse"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-white p-2 rounded-lg mb-4 shadow-xl border border-secondary/50">
                  <Skeleton className="h-8 w-8 rounded bg-white/40" />
                </div>
                <Skeleton className="h-5 w-24 mb-2 rounded bg-white/40" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded bg-white/40" />
                  <Skeleton className="h-3 w-16 rounded bg-white/40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoCardsSkeleton;
