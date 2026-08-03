"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EarningImagesPreviewProps {
    images: string[];
}

export default function EarningImagesPreview({ images }: EarningImagesPreviewProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return <span className="text-slate-400 text-sm">—</span>;
    }

    const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <Dialog onOpenChange={() => setActiveIndex(0)}>
            <DialogTrigger asChild>
                <Badge
                    variant="secondary"
                    className="flex items-center gap-1 justify-center w-fit mx-auto cursor-pointer hover:bg-slate-200 transition-colors"
                >
                    <ImageIcon className="h-3 w-3" />
                    {images.length}
                </Badge>
            </DialogTrigger>

            <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <ImageIcon className="h-4 w-4 text-slate-500" />
                        Earning Images
                        <span className="text-xs font-normal text-slate-400 ml-1">
                            ({activeIndex + 1} / {images.length})
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {/* Main image */}
                <div className="relative w-full bg-slate-100" style={{ height: 360 }}>
                    <Image
                        src={images[activeIndex]}
                        alt={`Earning image ${activeIndex + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-slate-200 rounded-full p-1.5 shadow transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 text-slate-700" />
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-slate-200 rounded-full p-1.5 shadow transition-colors"
                            >
                                <ChevronRight className="h-4 w-4 text-slate-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 px-5 py-3 overflow-x-auto border-t bg-slate-50">
                        {images.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`relative shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                                    i === activeIndex
                                        ? "border-slate-700"
                                        : "border-transparent hover:border-slate-300"
                                }`}
                            >
                                <Image
                                    src={src}
                                    alt={`Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
