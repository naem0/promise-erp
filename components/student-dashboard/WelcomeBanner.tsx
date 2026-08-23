import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const WelcomeBanner = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>Unauthorized</div>;
  }
  return (
    <section className="py-4 lg:py-6 px-4">
      <div className="relative overflow-hidden border rounded-xl bg-primary/5 p-2 shadow-lg ">
        <div className="relative z-10 flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={(session?.user?.image && typeof session?.user?.image === "string" && session?.user?.image.trim() !== "") ? session?.user?.image : "/images/profile_avatar.png"} alt={session?.user?.name ?? "User"} />
            <AvatarFallback className="bg-primary font-semibold">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-base font-semibold text-primary">
            <p className="text-primary">{session?.user?.name}</p>
            <p className="text-primary">{session?.user?.email}</p>
          </h2>
        </div>
        {/* <WavePattern /> */}
      </div>
    </section>
  );
};

export default WelcomeBanner;
