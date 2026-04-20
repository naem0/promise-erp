"use client";

import { MoreVertical, Star, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  review: {
    id: string;
    studentName: string;
    studentImage: string;
    rating: number;
    courseName: string;
    batch: string;
    date: string;
    comment: string;
  };
  onEdit: (id: string) => void;
}

export default function ReviewCard({ review, onEdit }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md bg-white rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-slate-100 mt-1">
              <AvatarImage src={review.studentImage} alt={review.studentName} />
              <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                {review.studentName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-800 text-lg mb-1">{review.studentName}</h4>
              <p className="text-[13px] text-slate-600 leading-normal line-clamp-2 mb-3">
                {review.comment}
              </p>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-100 text-slate-200"
                      }`}
                  />
                ))}
              </div>

              <h5 className="font-bold text-[#159e42] text-base mb-1">{review.courseName}</h5>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-500">{review.batch}</span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  📅 {review.date}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 cursor-pointer">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-lg shadow-lg border-slate-100">
              <DropdownMenuItem onClick={() => onEdit(review.id)} className="flex gap-2.5 py-2.5  text-slate-600 cursor-pointer">
                <Edit size={16} className="text-blue-500" />
                <span className="font-medium">Edit</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
