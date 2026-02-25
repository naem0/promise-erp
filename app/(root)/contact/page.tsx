import ContactFAQ from "@/components/root/contact/ContactFAQ";
import ContactFormWrapper from "@/components/root/contact/ContactFormWrapper";
import ContactInfoCards from "@/components/root/contact/ContactInfoCards";
import ContactInfoCardsSkeleton from "@/components/root/contact/ContactInfoCardsSkeleton";
import WrapperHeroBanner from "@/components/root/contact/WrapperHeroBanner";
import { Suspense } from "react";

const ContactPage = () => {
  return (
    <>
      <WrapperHeroBanner />
      <Suspense fallback={<ContactInfoCardsSkeleton />}>
        <ContactInfoCards />
      </Suspense>
      <ContactFormWrapper />
      <Suspense
        fallback={
          <div className="text-center py-8 md:py-12">Loading FAQs...</div>
        }
      >
        <ContactFAQ />
      </Suspense>
    </>
  );
};

export default ContactPage;
