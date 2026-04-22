import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AffiliatesClientsTab from "./AffiliatesClientsTab";
import SectionTitle from "@/components/common/SectionTitle";
import {
  fetchHomeAffiliatePartners,
  PartnersApiResponse,
} from "@/apiServices/homePageService";
import { cacheTag } from "next/cache";

export default async function AffiliatesClientsPage() {

  "use cache";
  cacheTag("affiliates-clients");

  let affiliatesData: PartnersApiResponse | null = null;
  try {
    affiliatesData = await fetchHomeAffiliatePartners();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Request aborted");
    }
    else {
      console.log(error);
    }
  }

  const affiliates = affiliatesData?.data?.partners?.affiliate || [];
  const clients = affiliatesData?.data?.partners?.client || [];
  const concerns = affiliatesData?.data?.partners?.concern || [];

  if (!affiliatesData?.success || !affiliatesData?.data) {
    return null;
  }

  const isEmpty =
    affiliates.length === 0 &&
    clients.length === 0 &&
    concerns.length === 0;

  if (isEmpty) {
    return (
      <section className="py-8 md:py-14 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle
            title={affiliatesData?.data?.section_title}
            subtitle={affiliatesData?.data?.section_subtitle}
          />
          <p className="mt-6 text-gray-500 text-lg">
            No affiliates or clients available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={affiliatesData?.data?.section_title}
          subtitle={affiliatesData?.data?.section_subtitle}
        />

        <Tabs defaultValue="affiliates" className=" mt-8">
          <TabsList className="flex flex-col md:flex-row justify-center items-center w-full h-full mx-auto bg-white rounded-md shadow-sm mb-4">
            <TabsTrigger
              value="affiliates"
              className="cursor-pointer rounded-md px-6 py-1 text-xl border-0
      bg-white
      data-[state=active]:bg-primary
      data-[state=active]:text-white
      data-[state=active]:shadow-md
      w-full md:w-auto"
            >
              Affiliates
            </TabsTrigger>

            <TabsTrigger
              value="clients"
              className="cursor-pointer rounded-md px-6 py-1 text-xl border-0
      bg-white
      data-[state=active]:bg-primary
      data-[state=active]:text-white
      data-[state=active]:shadow-md
      w-full md:w-auto"
            >
              Clients
            </TabsTrigger>

            <TabsTrigger
              value="concerns"
              className="cursor-pointer rounded-md px-6 py-1 text-xl border-0
      bg-white
      data-[state=active]:bg-primary
      data-[state=active]:text-white
      data-[state=active]:shadow-md
      w-full md:w-auto"
            >
              Concerns
            </TabsTrigger>
          </TabsList>


          <TabsContent value="affiliates">
            <AffiliatesClientsTab items={affiliates} />
          </TabsContent>

          <TabsContent value="clients">
            <AffiliatesClientsTab items={clients} />
          </TabsContent>

          <TabsContent value="concerns">
            <AffiliatesClientsTab items={concerns} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
