"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { EnrollmentsData } from "@/apiServices/studentEnrollmentService";

interface Props {
    enrollmentDetails: EnrollmentsData;
    couponCode: string;
    setCouponCode: (code: string) => void;
    handleApplyCoupon: () => void;
    isApplying: boolean;
}

const EnrollPaymentSummary = ({
    enrollmentDetails,
    couponCode,
    setCouponCode,
    handleApplyCoupon,
    isApplying,
}: Props) => {
    const courseName = enrollmentDetails.title;
    const price = enrollmentDetails.batch.price;
    const discount = enrollmentDetails.batch.total_discount_amount;
    const total = enrollmentDetails.batch.after_discount;
    const image = enrollmentDetails.featured_image;

    return (
        <Card className="py-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-secondary border-b mb-4 pb-2">
                    Payment Summary
                </h2>

                {/* Course */}
                <div className="mb-6">
                    <p className="text-secondary font-medium mb-3">Course Name</p>
                    <div className="flex items-center gap-4">
                        <Image
                            src={(image && typeof image === "string" && image.trim() !== "") ? image : "/images/course-img.png"}
                            alt={courseName || "Course image"}
                            width={148}
                            height={108}
                            className="rounded-lg object-cover"
                        />
                        <h4 className="text-lg font-medium text-secondary">{courseName}</h4>
                    </div>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                    <p className="text-secondary font-medium mb-3">Coupon Code</p>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 h-10 bg-card px-6 py-3"
                        />
                        <Button onClick={handleApplyCoupon} disabled={isApplying}>
                            {isApplying ? "Applying..." : "Apply"}
                        </Button>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="mb-4">
                    <p className="text-secondary font-medium mb-4">Payment Details</p>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-black/80">Price</span>
                            <span> {price} ৳</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-black/80">Discount</span>
                            <span>- {discount} ৳</span>
                        </div>
                        <div className="border-t border-border pt-3">
                            <div className="flex justify-between">
                                <span className="text-black/80 font-semibold">Total</span>
                                <span className="text-primary font-semibold text-lg">
                                     {total} ৳
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnrollPaymentSummary;
