import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FreeSeminarSocialMediaSection() {
    const items = [
        {
            icon: "/social-media/facebook.svg", // replace with your icon
            title: "Join Our",
            bold: "Community on Facebook",
            btn: "Click Here to Join",
            link: "https://www.facebook.com/elaeltd.official",
        },
        {
            icon: "/social-media/linkedin.svg",
            title: "Join Our",
            bold: "Community on LinkedIn",
            btn: "Click Here to Join",
            link: "https://www.linkedin.com/company/e-learning-and-earning-ltd",
        },
        {
            icon: "/social-media/youtube.svg",
            title: "Visit Our",
            bold: "Youtube Channel",
            btn: "Click Here to Visit",
            link: "https://www.youtube.com/@elaeltd.official",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
                <Card
                    key={i}
                    className="px-5 py-8 shadow-md rounded-xl h-full hover:scale-105 transition-transform"
                >
                    <CardContent className="flex flex-col items-center text-center gap-4 p-0">
                        {/* Icon */}
                        <div className="w-16 h-16 relative">
                            <Image
                                src={item.icon}
                                alt={`${item.bold} Icon`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold leading-tight">
                            {item.title} <br />
                            <span className="font-bold">{item.bold}</span>
                        </h3>

                        {/* Button */}
                        <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-primary text-primary rounded-full px-6 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition flex items-center gap-2"
                        >
                            {item.btn} <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
