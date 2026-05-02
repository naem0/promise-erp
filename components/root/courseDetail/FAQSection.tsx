"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CourseDetail } from "@/apiServices/courseDetailPublicService";
import DOMPurify from "dompurify";

interface FAQSectionProps {
  course: CourseDetail;
}

export const FAQSection = ({ course }: FAQSectionProps) => {
  const faqs = course.faqs || [];

  if (faqs.length === 0) return null;

  return (
    <Card className="bg-muted/30 py-0">
      <CardContent className="p-4 lg:p-8">
        <h2 className="text-xl lg:text-3xl font-bold text-center mb-5 lg:mb-8 animate-in fade-in duration-500">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faqs?.map((faq) => (
            <AccordionItem
              key={faq?.id}
              value={`faq-${faq?.id}`}
              className="border-b"
            >
              <AccordionTrigger className="hover:no-underline cursor-pointer">
                <span className="font-bold text-left">{faq?.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(faq.answer || ""),
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
