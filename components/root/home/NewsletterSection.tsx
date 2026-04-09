"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/common/SectionTitle";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getNewsletterItemResponse,
  getPublicNewsletterSection,
  NewsletterApiResponse,
  SubscribeToNewsletter,
} from "@/apiServices/homePageService";
import { Spinner } from "@/components/ui/spinner";

const NewsletterSection = () => {
  const [email, setEmail] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [subscriptionData, setSubscriptionData] =
    useState<getNewsletterItemResponse | null>(null);

  //Submit post api call
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      try {
        const res: NewsletterApiResponse = await SubscribeToNewsletter(email);
        if (res.success) {
          toast.success(res.message);
          setEmail("");
        } else {
          toast.error(res.message);
          setEmail("");
        }
      } catch (error) {
        console.error("Newsletter submission failed:", error);
        toast.error("Something went wrong. Please try again.");
        setEmail("");
      }
    });
  };

  // Fetch newsletter section data on mount
  useEffect(() => {
    startTransition(() => {
      (async () => {
        try {
          const res = await getPublicNewsletterSection();
          if (!res?.success) {
            return;
          } else {
            setSubscriptionData(res);
          }
        } catch (error: unknown) {
          console.error("Newsletter fetch failed:", error);
        }
      })();
    });
  }, []);

  return (
    <section className="relative py-8 md:py-14 w-full h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={subscriptionData?.data?.image || "/images/placeholder_img.jpg"}
          alt="Computer Lab Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 z-10 bg-secondary/60" />
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center space-y-6">
        <>
          {isPending ? (
            <div className="flex flex-col items-center gap-3 mb-10">
              <Skeleton className="h-10 w-64 bg-white/45" />
              <Skeleton className="h-5 w-40 bg-white/45" />
            </div>
          ) : (
            subscriptionData && (
              <SectionTitle
                title={subscriptionData?.data?.title}
                subtitle={subscriptionData?.data?.sub_title}
                iswhite={true}
              />
            )
          )}
        </>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className=" flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="h-12 bg-white border-none text-black placeholder:text-gray-500 text-base shadow-lg rounded-md"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer h-12 px-8 bg-primary hover:bg-primary-light text-white text-lg font-medium shadow-lg rounded-md transition-colors w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Spinner /> Subscribing
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
