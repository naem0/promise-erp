import {
  ChairmanMessage,
  getPublicAllExecutives,
} from "@/apiServices/employeeService";
import TeamMemberCard from "./TeamMemberCard";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
interface Props {
  isAbout: boolean;
}
const TeamMemberCardWrapper = async ({ isAbout =false }: Props) => {
  let memberDatas;
  try {
    memberDatas = await getPublicAllExecutives();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error){
      throw error;
    };
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message="An unknown error occurred while fetching video galleries." />
        </div>
      );
    }
  }

  const members: ChairmanMessage[] = memberDatas?.data || [];

  // Sort: type === 1 first, type === 2 last
  const sortedMembers = [...members].sort((a, b) => {
    if (a.type === 1 && b.type !== 1) return -1;
    if (a.type !== 1 && b.type === 1) return 1;
    if (a.type === 2 && b.type !== 2) return 1;
    if (a.type !== 2 && b.type === 2) return -1;
    return 0;
  });

  const displayMembers = isAbout ? sortedMembers?.slice(0, 1) : sortedMembers;
  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {displayMembers?.length > 0 ? (
          displayMembers?.map((member) => (
            <TeamMemberCard key={member?.id} member={member} />
          ))
        ) : (
          <div className="col-span-2">
            <NotFoundComponent
              message={memberDatas?.message || "No employees found"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TeamMemberCardWrapper;
