import { ChairmanMessage } from "@/apiServices/employeeService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Props {
  member: ChairmanMessage;
}

const TeamMemberCard = ({ member }: Props) => {
  const isTypeTwo = member.type === 2;

  return (
    <div
      className={`grid px-4 border border-primary ${
        isTypeTwo ? "md:grid-cols-[280px_1fr]" : "md:grid-cols-[1fr_280px]"
      } border rounded-xl shadow-md hover:shadow-lg transition bg-white`}
    >
      {/* Image */}
      <div
        className={`flex items-center py-4 ${
          isTypeTwo ? "justify-start order-1" : "justify-end order-2"
        }`}
      >
        <div className="relative p-3 rounded-lg bg-[url(/images/message-for-md.png)] bg-no-repeat bg-size-[100%] min-h-full md:min-h-70 w-full flex justify-center items-center">
          <div
            className={`bg-white rounded-full p-1 h-36 w-36 shadow-md flex items-center justify-center ${
              isTypeTwo ? "-right-10" : "-left-10"
            }`}
          >
            <Avatar className="h-32 w-32 border-4 border-primary rounded-full">
              <AvatarImage
                src={member.chairman_image}
                alt={member.name}
                className="object-scale-down rounded-full"
              />
            </Avatar>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 py-6 ${isTypeTwo ? "order-2" : "order-1"}`}>
        <div className={isTypeTwo ? "text-right" : "text-left"}>
          <h3 className="text-2xl md:text-4xl font-bold text-secondary mb-3">
            {member.name}
          </h3>
          <p className="text-base font-extrabold text-secondary/80 mt-1">
            {member.designation}
          </p>
          <span className="text-primary">E-Learning and Earning Ltd.</span>
        </div>

        {/* Message */}
        <div className="mt-6 relative">
          <p className="text-black/60 text-lg md:text-xl leading-relaxed max-w-fit">
            {member.message_content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
