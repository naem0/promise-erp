import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/common/SectionTitle";
const members = [
    {
        name: "Bangladesh Computer Samity",
        logo: "/images/bacca.png",
    },
    {
        name: "National Skills Development Authority Bangladesh",
        logo: "/images/basis.png",
    },
    {
        name: "QCS Management Pvt. Ltd.",
        logo: "/images/computer-somity.png",
    },
    {
        name: "BASIS",
        logo: "/images/nsd.png",
    },
    {
        name: "BACCO",
        logo: "/images/qcs.png",
    },
    {
        name: "Department of Youth Development",
        logo: "/images/youth develop.png",
    },
];

const HomeMembersSection = () => {
    return (
        <section className="py-8 md:py-14 ">
            <div className="container mx-auto px-4">
                <SectionTitle
                    title="Our Members"
                    subtitle="Member Organizations"
                    iswhite={false}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {

                        members.map((member, i) => (
                            <Card
                                key={i}
                                className="rounded-xl py-0 shadow-sm hover:shadow-md transition"
                            >
                                <CardContent className="flex items-center justify-center p-6">
                                    <Image
                                        src={member?.logo}
                                        alt={member?.name || "Logo"}
                                        width={600}
                                        height={70}
                                        className="object-scale-down h-18"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </section>
    );
}

export default HomeMembersSection