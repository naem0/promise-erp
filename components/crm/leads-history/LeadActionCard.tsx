"use client";

import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";
import { LeadInfo } from "@/apiServices/crmLeadsHistoryService";

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

    const handleWhatsApp = () => {
        const targetNumber = lead.whatsapp || lead.phone;
        if (targetNumber) {
            // Remove any non-digit characters for the API
            const cleanNumber = targetNumber.replace(/\D/g, "");
            // Use existing plus if present, otherwise assume +88
            const formattedPhone = targetNumber.startsWith("+") ? cleanNumber : `88${cleanNumber}`;
            window.open(`https://wa.me/${formattedPhone}`, "_blank");
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <Button
                    onClick={handleCall}
                    className="w-full bg-secondary hover:bg-secondary/80 text-white flex items-center justify-center gap-2"
                    disabled={!phoneNumber}
                >
                    <Phone className="w-4 h-4" />
                    Call
                </Button>
                <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-primary hover:bg-primary/80 text-white flex items-center justify-center gap-2"
                    disabled={!phoneNumber}
                >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default LeadActionCard;
