"use client";

import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Mail, MessageCircle } from "lucide-react";
import { LeadInfo } from "@/apiServices/crmLeadsHistoryService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LeadActionCardProps {
    lead: LeadInfo;
}

const LeadActionCard = ({ lead }: LeadActionCardProps) => {
    const phoneNumber = lead.phone || "";

    const handleCall = () => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const handleSMS = () => {
        if (phoneNumber) {
            window.location.href = `sms:${phoneNumber}`;
        }
    };

    const handleEmail = () => {
        if (lead.email) {
            const subject = encodeURIComponent(`Inquiry regarding ${lead.interested_course || "Course"} - Promise ERP`);
            const body = encodeURIComponent(`Hello ${lead.name},\n\nThank you for your interest in ${lead.interested_course || "our course"}. We would like to discuss this further with you.\n\nBest regards,\nPromise ERP Team`);
            window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
        }
    };

    const handleWhatsApp = () => {
        const targetNumber = lead.whatsapp || lead.phone;
        if (targetNumber) {
            const cleanNumber = targetNumber.replace(/\D/g, "");
            const formattedPhone = targetNumber.startsWith("+") ? cleanNumber : `88${cleanNumber}`;
            window.open(`https://wa.me/${formattedPhone}`, "_blank");
        }
    };

    return (
        <Card className="shadow-sm border-slate-100 mb-6">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={handleCall}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-secondary hover:bg-secondary/90 text-white rounded-xl"
                        disabled={!phoneNumber}
                    >
                        <Phone className="w-4 h-4" />
                        Call
                    </Button>
                    <Button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary/90 text-white rounded-xl"
                        disabled={!phoneNumber && !lead.whatsapp}
                    >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </Button>
                    <Button
                        onClick={handleSMS}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-[#9148EF] hover:bg-[#7e3ad6] text-white rounded-xl"
                        disabled={!phoneNumber}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Message
                    </Button>
                    <Button
                        onClick={handleEmail}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-xl"
                        disabled={!lead.email}
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadActionCard;
