import { Suspense } from "react";
import ContactMap from "./ContactMap";
import ContactForm from "./ContactForm";
import ContactMapSkeleton from "./ContactMapSkeleton";

const ContactFormWrapper = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4 lg:gap-8">
          <ContactForm />
          <Suspense fallback={<ContactMapSkeleton />}>
            <ContactMap />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ContactFormWrapper;
