"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BlogCategory } from "@/apiServices/blogWebService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, Tag, Check, LayoutGrid } from "lucide-react";

interface BlogMobileCategoryFilterProps {
  categories: BlogCategory[];
  uniqueTags: string[];
}

export default function BlogMobileCategoryFilter({
  categories,
  uniqueTags,
}: BlogMobileCategoryFilterProps) {
  const params = useParams();
  const currentSlug = params?.slug as string | undefined;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block xl:hidden w-full">
      <div className="flex items-center gap-2 w-full bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
        {/* Horizontal Category Chips Container */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 scroll-smooth">
          {/* 'All' Chip */}
          <Link
            href="/blog"
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              !currentSlug
                ? "bg-primary text-white shadow-xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            All
          </Link>

          {categories.map((category) => {
            const isSelected = currentSlug === category.slug;
            return (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                <span>{category.title}</span>
                {category.blog_count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {category.blog_count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Filter Modal Trigger Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 text-gray-700 relative"
              aria-label="Categories & Tags Filter"
            >
              <Filter className="h-4 w-4 text-gray-700" strokeWidth={1.5} />
              {currentSlug && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                Categories & Tags
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Categories Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Categories
                </h4>
                <div className="flex flex-col gap-1.5">
                  <Link
                    href="/blog"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      !currentSlug
                        ? "bg-primary text-white font-semibold"
                        : "bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {!currentSlug && <Check className="h-4 w-4" />}
                      All Categories
                    </span>
                  </Link>

                  {categories.map((category) => {
                    const isSelected = currentSlug === category.slug;
                    return (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-primary text-white font-semibold"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isSelected && <Check className="h-4 w-4" />}
                          {category.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {category.blog_count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Popular Tags Section */}
              {uniqueTags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Popular Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
