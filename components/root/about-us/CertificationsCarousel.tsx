import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// Certification data
const certifications = [
  {
    id: 1,
    title: "ISO Certified Institute",
    description:
      "E-Learning & Earning Ltd. is proudly certified under ISO 9001:2015 Quality Management System — which reflects our commitment to maintaining global standards in training, service delivery, and operational excellence. This certification ensures that every process — from course design to student support — follows a structured, quality-driven workflow.",
    image: "/images/iso-image.svg",
    alt: "iso certification",
  },
  {
    id: 2,
    title: "BCC Accredited Training Provider",
    description:
      "E-Learning & Earning Ltd. is officially accredited by the Bangladesh Computer Council (BCC) as a trusted training provider. This recognition reflects our capability to deliver structured, industry-relevant skill development programs nationwide.",
    image: "/images/bcc-accerdit.svg",
    alt: "bcc accreditation",
  },
  {
    id: 3,
    title: "BASIS Recognized Member",
    description:
      "We are a proud recognized member of BASIS — the national association for the software & ITES industry. This affiliation strengthens our commitment to contributing to Bangladesh's ICT ecosystem.",
    image: "/images/basis-recognize.svg",
    alt: "basis membership",
  },
  {
    id: 4,
    title: "Certified BACCO Member",
    description:
      "E-Learning & Earning Ltd. is a certified member of BACCO, validating our compliance, reliability, and active contribution within the Business Process Outsourcing and ITES sector.",
    image: "/images/bacco.svg",
    alt: "bacco certification",
  },
  {
    id: 5,
    title: "NSDA Registered Training Institute",
    description:
      "Recognized by the National Skills Development Authority (NSDA), under the Prime Minister's Office, as an official IT training provider committed to delivering quality skill development programs.",
    image: "/images/nsda.svg",
    alt: "nsda registration",
  },
  {
    id: 6,
    title: "DYD Registered Training Organization",
    description:
      "Certified by the Department of Youth Development (DYD), Government of Bangladesh, for providing youth-focused skill development and training programs.",
    image: "/images/dyd.svg",
    alt: "dyd certification",
  },
];

export default function CertificationsSection() {
  return (
    <div className="w-full px-4 py-10 space-y-10">
      <div className="">
        <h3 className="text-3xl font-semibold mb-4 text-secondary">
          Certified for Excellence
        </h3>
        <p className="text-black/60 leading-relaxed">
          Building trust through globally verified standards and industry-{" "}
          <br></br>leading certifications that define our commitment to quality.
        </p>
      </div>

      <div className="space-y-12">
        <div className="grid xl:grid-cols-2 items-center gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`grid lg:grid-cols-2 items-center rounded-xl gap-4 bg-[#EFF3EA] shadow p-2 h-full`}
            >
              {/* Image */}
              <Card className="py-0 shadow-none">
                <CardContent className="p-2 flex justify-center">
                  <div className="relative w-full h-[280px] md:h-[380px]">
                    <Image
                      src={cert.image}
                      alt={cert.alt}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Text */}
              <div className="px-4 py-4">
                <h3 className="text-xl text-secondary lg:text-2xl font-semibold mb-3">
                  {cert.title}
                </h3>
                <p className="text-black/60 leading-relaxed text-base">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
