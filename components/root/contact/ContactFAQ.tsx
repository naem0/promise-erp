import { getPublicContactFaqs } from "@/apiServices/contactPageWeb";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactFAQ = async () => {
  let faqsData;
  try {
    faqsData = await getPublicContactFaqs();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="text-center py-8 md:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="text-center py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while fetching FAQs." />
        </div>
      );
    }
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        <Card className="shadow-sm border-t-4 border-t-[#1a1c4e]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1a1c4e]">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              {faqsData?.data?.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <NotFoundComponent
                    message={faqsData?.message || "FAQs not found."}
                  />
                </div>
              ) : (
                faqsData?.data?.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${faq.id}`}
                    className="border-b last:border-0"
                  >
                    <AccordionTrigger className="text-left cursor-pointer font-semibold text-secondary text-lg md:text-xl hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-black text-base py-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactFAQ;
