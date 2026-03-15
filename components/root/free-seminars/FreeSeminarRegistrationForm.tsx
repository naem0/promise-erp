"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerForFreeSeminar } from "@/apiServices/studentDashboardService";

interface FormData {
    address: string;
}

const FreeSeminarRegistrationForm = ({ seminarId }: { seminarId: number }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if (status === "unauthenticated" || !session?.accessToken) {
            router.push("/login");
            return;
        }

        try {
            const result = await registerForFreeSeminar(
                seminarId,
                data.address,
                session.accessToken
            );

            if (!result.success) {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(", ");
                    toast.error(errorMessages || "Validation error");
                } else {
                    toast.error(result.message || "Something went wrong. Please try again.");
                }
                return;
            }

            toast.success(result.message || "Successfully registered for the seminar");
            reset();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="space-y-8">
            {/* Registration Form Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
                <div className="bg-secondary py-5 px-6 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-bold font-hind">
                        সম্পূর্ণ ফ্রি-তে রেজিস্ট্রেশন করুন
                    </h3>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 block">
                                আপনার ঠিকানা
                            </label>
                            <Input
                                {...register("address")}
                                placeholder="আপনার ঠিকানা লিখুন"
                                className="w-full bg-white border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-md h-11 text-black/70 placeholder:text-black/50"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}

                            >
                                {isSubmitting ? "বুক হচ্ছে..." : "বুক করুন"}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Contact Box */}
            <div className="bg-linear-to-b from-white to-gray-50 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border-2 border-primary/40 p-8 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30"></div>
                <p className="text-secondary font-bold text-lg md:text-xl mb-3">
                    বিস্তারিত তথ্য অথবা কোর্স সম্পর্কে জানতে কল করুন-
                </p>
                <div className="flex items-center justify-center gap-3 text-2xl md:text-4xl font-bold text-secondary">
                    <Phone className="w-8 h-8 md:w-9 md:h-9 text-secondary" strokeWidth={2.5} />
                    <span>01550-666800</span>
                </div>
            </div>
        </div>
    );
};

export { FreeSeminarRegistrationForm };
