import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProfileTab from "./MyProfileTab";
import PasswordTab from "./PasswordTab";

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full px-4">
      <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto border-b border-gray-200 rounded-none">
        <TabsTrigger
          value="profile"
          className="cursor-pointer border-2 border-secondary data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:shadow-none bg-transparent py-3 text-secondary data-[state=active]:text-white font-medium"
        >
          My Profile
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="cursor-pointer border-2 border-secondary data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:shadow-none bg-transparent py-3 text-secondary data-[state=active]:text-white font-medium"
        >
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4">
        <MyProfileTab />
      </TabsContent>
      <TabsContent value="password" className="mt-4">
        <PasswordTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
