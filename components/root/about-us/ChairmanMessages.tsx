import {
  ChairmanMessage,
  getPublicAllExecutives,
} from "@/apiServices/employeeService";
import ErrorComponent from "@/components/common/ErrorComponent";
import Image from "next/image";

const ChairmanMessages = async () => {
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
  const displayMember = members.find((member) => member.type === 1);

  if (!displayMember) {
    return null;
  }

  return (
    <section className="py-8 lg:py-12 bg-[url('/images/Message-From-Chairman-bg.png')] bg-cover bg-center bg-no-repeat ">
      <div className="max-w-full lg:max-w-6xl mx-auto">
        <div className={`grid px-4 md:grid-cols-[280px_1fr]`}>
          {/* Image */}
          <div className={`flex items-center py-0 md:py-4`}>
            <div className="relative w-full h-[300px] lg:h-[400px]">
              <Image
                src={"/images/ChairmanMessage.png"}
                alt="Chairman"
                fill
                className="object-scale-down w-full h-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`px-4 py-0`}>
            {/* Message */}
            <h3 className="text-secondary text-xl lg:text-3xl font-bold capitalize mb-4">
              Message From Chairman
            </h3>
            <div className="pb-4">
              <p className="text-black/60 text-lg leading-relaxed max-w-fit">
                {displayMember?.message_content || "chairman message"}
              </p>
            </div>
            <div className="">
              <h5 className="text-xl font-medium text-primary mb-1">
                {displayMember?.name || "Chairman Name"}
              </h5>
              <p className="text-base text-black/80 mt-1">
                {displayMember?.designation || "Designation"}
              </p>
              <p className="text-black/80">E-Learning and Earning Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanMessages;
