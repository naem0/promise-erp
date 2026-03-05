import {
  ChairmanMessage,
  getPublicAllExecutives,
} from "@/apiServices/employeeService";
import TeamMemberCard from "./TeamMemberCard";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const TeamMemberCardWrapper = async () => {
  let memberDatas;
  try {
    memberDatas = await getPublicAllExecutives();
  } catch (error: unknown) {
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
  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {members.length > 0 ? (
          members.map((member) => (
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
