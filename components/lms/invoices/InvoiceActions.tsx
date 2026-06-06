"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { InvoiceDetailData } from "@/apiServices/invoiceService";

interface InvoiceActionsProps {
  invoiceId: string;
  invoiceData: InvoiceDetailData;
}

export function InvoiceActions({
  invoiceId,
  invoiceData,
}: InvoiceActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set fonts and title
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(33, 37, 41);

    doc.setFontSize(20);
    doc.text("PROMISE ERP - STUDENT INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Invoice ID: ${invoiceId} | Generated: ${new Date().toLocaleDateString()}`,
      14,
      26,
    );

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 30, 196, 30);

    // Student Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Student Information", 14, 38);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Student Name: ${invoiceData?.user?.name || "N/A"}`, 14, 45);
    doc.text(`Student ID: ${invoiceData?.user?.id || "N/A"}`, 14, 51);
    doc.text(`Batch: ${invoiceData?.batch?.name || "N/A"}`, 14, 57);

    // Course Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Course Details", 14, 69);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const courseY = 76;
    doc.text(`Instructor: ${invoiceData?.user?.name || "N/A"}`, 14, courseY);
    doc.text(`Phone: ${invoiceData?.user?.phone || "N/A"}`, 14, courseY + 6);
    doc.text(`Email: ${invoiceData?.user?.email || "N/A"}`, 14, courseY + 12);
    doc.text(
      `Course: ${invoiceData?.batch?.course?.title || "N/A"}`,
      14,
      courseY + 18,
    );
    doc.text(`Branch: ${invoiceData?.branch_name || "N/A"}`, 14, courseY + 24);

    doc.text(`Batch ID: ${invoiceData?.batch_id || "N/A"}`, 110, courseY);
    doc.text(
      `Batch Name: ${invoiceData?.batch?.name || "N/A"}`,
      110,
      courseY + 6,
    );
    doc.text(`Class Days: N/A`, 110, courseY + 12);
    doc.text(`Class Time: N/A`, 110, courseY + 18);
    doc.text(
      `Status: ${invoiceData?.status_label || "Active"}`,
      110,
      courseY + 24,
    );

    doc.line(14, courseY + 30, 196, courseY + 30);

    // Payment Summary
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payment Summary", 14, courseY + 38);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const payY = courseY + 45;
    doc.text(
      `Course Fee: BDT ${(invoiceData?.original_price ?? 0).toLocaleString()}`,
      14,
      payY,
    );
    doc.text(
      `Discount: BDT ${(invoiceData?.discount_amount ?? 0).toLocaleString()}`,
      14,
      payY + 6,
    );
    doc.text(
      `Coupon Use: BDT ${(invoiceData?.coupon_discount ?? 0).toLocaleString()}`,
      14,
      payY + 12,
    );

    doc.text(
      `Total Payment: BDT ${(invoiceData?.final_price ?? 0).toLocaleString()}`,
      110,
      payY,
    );
    doc.text(
      `Paid Amount: BDT ${(invoiceData?.payment_amount ?? 0).toLocaleString()}`,
      110,
      payY + 6,
    );
    doc.text(
      `Due Amount: BDT ${(invoiceData?.due_amount ?? 0).toLocaleString()}`,
      110,
      payY + 12,
    );

    doc.line(14, payY + 18, 196, payY + 18);

    // Transactions Table
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Transaction History", 14, payY + 26);

    const tableRows = (invoiceData?.payment_histories || []).map((t) => [
      t?.payment_details?.payment_method_name || "N/A",
      `${t?.payment_details?.transaction_id || "N/A"} - ${t?.payment_details?.date || "N/A"}`,
      `BDT ${(t?.payment_details?.paid_amount ?? 0).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: payY + 32,
      head: [["Payment By", "Transaction Details", "Amount"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [0, 184, 132] }, // Beautiful custom theme green color
      margin: { left: 14, right: 14 },
    });

    const studentName = invoiceData?.user?.name || "Student";
    doc.save(`Invoice_${studentName.replace(/\s+/g, "_")}_${invoiceId}.pdf`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <Button
        variant="outline"
        onClick={handleDownloadPDF}
        className="border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center gap-2 rounded-lg"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </Button>
      <Button onClick={handlePrint} className="cursor-pointer">
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}
