"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Printer, Download } from "lucide-react";

interface FilterFormValues {
  search?: string;
  branch?: string;
  type?: string;
  status?: string;
  date?: string;
  pageSize?: string;
}

export default function DeliveryFilter() {
  const [pageSize, setPageSize] = useState("10");
  const { register, control } = useForm<FilterFormValues>({
    defaultValues: {
      search: "",
      branch: "",
      type: "dhaka", // Styled as active/selected in the mockup image
      status: "dhaka", // Styled as active/selected in the mockup image
      date: "",
      pageSize: "10",
    },
  });

  const { onBlur: dateOnBlur, ...dateProps } = register("date");

  return (
    <div className="bg-card border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">
      {/* Header and Controls (Moved from Table) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Filters
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium px-4 h-10 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-[#292464] hover:bg-[#292464]/95 text-white font-medium px-4 h-10 border-0 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6">
        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-2">
          <div className="relative">
            <Input
              placeholder="Type Requisition ID/Challan"
              className="pr-10 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 rounded-lg text-slate-800 dark:text-slate-100 text-sm h-10!"
              {...register("search")}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Delivery Branch */}
        <div className="relative">
          <Controller
            name="branch"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full border-slate-200 dark:border-slate-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg h-10! text-slate-400 data-[size=default]:h-10!">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="cumilla">Cumilla</SelectItem>
                  <SelectItem value="brahmanbaria">Brahmanbaria</SelectItem>
                  <SelectItem value="feni">Feni</SelectItem>
                  <SelectItem value="gazipur">Gazipur</SelectItem>
                  <SelectItem value="satkhira">Satkhira</SelectItem>
                  <SelectItem value="bandarban">Bandarban</SelectItem>
                  <SelectItem value="chattogram">Chattogram</SelectItem>
                  <SelectItem value="narsingdi">Narsingdi</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Delivery Type */}
        <div className="relative">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full border-slate-200 dark:border-slate-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg h-10! text-slate-400 data-[size=default]:h-10!">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Status */}
        <div className="relative">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full border-slate-200 dark:border-slate-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg h-10! text-slate-400 data-[size=default]:h-10!">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="delivering">Delivering</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Date */}
        <div className="relative">
          <div className="relative">
            <Input
              type="text"
              placeholder="mm/dd/yyyy"
              className="pr-10 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 rounded-lg text-slate-800 dark:text-slate-100 text-sm h-10!"
              onFocus={(e) => (e.target.type = "date")}
              {...dateProps}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
                dateOnBlur(e);
              }}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Show (Page Size Select - Moved from Table) */}
        <div className="relative">
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-full border-slate-200 dark:border-slate-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg h-10! text-slate-700 dark:text-slate-300 font-medium data-[size=default]:h-10!">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
