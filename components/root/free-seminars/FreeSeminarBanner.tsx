"use client";
import Image from "next/image";
import { Clock, MapPin, Calendar, Users } from "lucide-react";
import { PublicFreeSeminar } from "@/apiServices/studentDashboardService";

const FreeSeminarBanner = ({ seminar }: { seminar: PublicFreeSeminar }) => {
    console.log("Seminar in Banner:", seminar);
    return (
        <div className="w-full bg-primary rounded-[30px] overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-8 relative">
                {/* Left Content */}
                <div className="flex-1 space-y-6 z-10 w-full">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                            {seminar.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 text-white text-sm lg:text-base font-medium">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>
                                {seminar?.seminar_duration || "N/A"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {seminar.seminar_type === 1 ? (
                                seminar.seminar_link ? (
                                    <a
                                        href={seminar.seminar_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-primary hover:bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>Join Now</span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        <span>Online Seminar</span>
                                    </div>
                                )
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5" />
                                    <span>{seminar.location}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white leading-relaxed w-full">
                        <p className="text-sm lg:text-base text-white/90 mb-6 font-light">
                            {seminar.about
                                ? seminar.about
                                : "No about available."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-auto">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 opacity-80" />
                                <div>
                                    <span className="font-medium text-sm lg:text-base">
                                        {seminar.seminar_date}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 opacity-80" />
                                <div>
                                    <span className="font-medium text-sm lg:text-base">
                                        {seminar.seminar_time}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 opacity-80" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm lg:text-base">
                                        {seminar.seminar_type === 1 ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 w-full flex justify-end relative">
                    <div className="relative w-full max-w-full aspect-4/3 lg:aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/50">
                      
                            <Image
                                src={seminar.image || "/images/placeholder_img.jpg"}
                                alt={seminar.title}
                                fill
                                className="object-cover"
                            />
                      

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Decorative elements - Adjusted positions */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default FreeSeminarBanner;
