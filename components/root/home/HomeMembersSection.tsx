import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/common/SectionTitle";
import { getMembersByType, MemberItem } from "@/apiServices/homePageService";
import ErrorComponent from "@/components/common/ErrorComponent";

const HomeMembersSection = async () => {
  let members: MemberItem[] = [];
  let membersData;
  try {
    membersData = await getMembersByType(4);
    members = membersData?.data?.partners || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error) {
      return (
        <div className="py-6 w-full mx-auto lg:py-12">
          <ErrorComponent
            message={membersData?.message || "Failed to load members"}
          />
        </div>
      );
    } else {
      return (
        <div className="py-6 w-full mx-auto lg:py-12">
          <ErrorComponent message={"Failed to load members"} />
        </div>
      );
    }
  }
  if (members.length === 0 || !membersData || !membersData.data) {
    return null;
  }

  return (
    <section className="py-8 md:py-14 ">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Our Members"
          subtitle="Member Organizations"
          iswhite={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card
              key={member?.id}
              className="rounded-xl py-0 shadow-sm hover:shadow-md transition"
            >
              <CardContent className="flex items-center justify-center py-2 px-3">
                <div className="relative w-full h-22 rounded-lg">
                  <Image
                    src={(member?.image && typeof member?.image === "string" && member?.image.trim() !== "") ? member?.image : "/images/placeholder.jpg"}
                    alt={member?.title || "Logo"}
                    fill
                    className="object-cover h-20 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeMembersSection;
