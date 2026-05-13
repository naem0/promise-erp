import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncate = (text: string, limit: number = 30) => {
    if (!text) return "—";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
};

export const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
};
