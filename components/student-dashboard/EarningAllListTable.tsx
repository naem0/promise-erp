"use client";
import { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import EarningImagModal from "./EarningImagModal";
import {
  getStudentEarningList,
  StudentEarningItem,
  StudentEarningsApiResponse,
} from "@/apiServices/studentDashboardService";

import { toast } from "sonner";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { useSearchParams } from "next/navigation";
import TableSkeleton from "@/components/TableSkeleton";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import EarningDeleteButton from "./EarningDeleteButton";
import { useSession } from "next-auth/react";

const EarningAllListTable = () => {
  const [earningsData, setEarningsData] =
    useState<StudentEarningsApiResponse | null>(null);
  const [earnings, setEarnings] = useState<StudentEarningItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const handleImageClick = (images: string[]) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (!token) return;
    const fetchEarnings = () => {
      try {
        startTransition(async () => {
          const params: Record<string, unknown> = {
            search: searchParams.get("search") || undefined,
            status: searchParams.get("status") || undefined,
            sort_order:
              searchParams.get("sort_order") === "asc" ||
              searchParams.get("sort_order") === "desc"
                ? searchParams.get("sort_order")
                : "desc",

            per_page: Number(searchParams.get("per_page")) || 15,
            page: Number(searchParams.get("page")) || 1,
          };

          const res = await getStudentEarningList({ params, token });

          if (res.success) {
            setEarningsData(res);
            setEarnings(res?.data?.earnings || []);
          } else {
            toast.error(res.message || "Failed to fetch earnings");
          }
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Earnings fetch failed:", error.message);
          toast.error("Failed to fetch earnings");
        }
        console.error("Earnings fetch failed:", error);
      }
    };

    fetchEarnings();
  }, [searchParams, token]);

  if (isPending) {
    return <TableSkeleton columns={9} rows={15} className="mt-4" />;
  }
  if (earnings.length === 0 && !isPending) {
    return (
      <NotFoundComponent
        message={earningsData?.message || "No Earning Data Found"}
        title="Earning List"
      />
    );
  }

  return (
    <>
      <div className="w-full mt-4">
        <Card className="border-secondary/10 px-3">
          {/* Card Content */}
          <CardContent className="p-0">
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow className=" border-b border-primary/10">
                    <TableHead className="font-semibold">#SL</TableHead>
                    {/* <TableHead className="font-semibold text-center">
                      Action
                    </TableHead> */}
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">
                      Earning (USD)
                    </TableHead>
                    <TableHead className="font-semibold">
                      Earning (BDT)
                    </TableHead>
                    <TableHead className="font-semibold">Platform</TableHead>
                    <TableHead className="font-semibold">
                      Payment Method
                    </TableHead>
                    <TableHead className="font-semibold">Job</TableHead>
                    <TableHead className="font-semibold">Image</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {earnings.map((earning, index) => (
                    <TableRow
                      key={earning?.id}
                      className="hover:bg-secondary/10 transition-colors border-b border-primary/10"
                    >
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      {/* <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge
                              variant="default"
                              role="button"
                              tabIndex={0}
                              className="cursor-pointer select-none"
                            >
                              Action
                            </Badge>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="center">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`#`}
                                className="flex items-center cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Manage
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`#`}
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Views
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <EarningDeleteButton id={earning?.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell> */}

                      <TableCell className="text-primary">
                        {earning.earned_at}
                      </TableCell>

                      <TableCell>{earning.amount_usd}</TableCell>
                      <TableCell>{earning.amount_bdt}</TableCell>
                      <TableCell>{earning.marketplace_name}</TableCell>
                      <TableCell>{earning.payment_method}</TableCell>
                      <TableCell>{earning.job_title}</TableCell>

                      <TableCell>
                        <Image
                          width={60}
                          height={60}
                          src={
                            earning.earning_images.length > 0
                              ? earning.earning_images[0]
                              : "/images/placeholder_img.jpg"
                          }
                          alt={earning.job_title || "Earning Image"}
                          className="rounded-md cursor-pointer border"
                          onClick={() =>
                            handleImageClick(
                              earning.earning_images.length > 0
                                ? earning.earning_images
                                : ["/images/placeholder_img.jpg"]
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {earningsData?.data?.pagination && (
            <Pagination pagination={earningsData.data.pagination} />
          )}
        </Card>
      </div>

      <EarningImagModal
        images={selectedImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EarningAllListTable;
