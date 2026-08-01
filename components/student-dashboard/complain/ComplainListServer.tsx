import {
  getStudentComplains,
  ComplainItem,
} from "@/apiServices/studentComplainService";
import AddComplainDialog from "./AddComplainDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Layers } from "lucide-react";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function ComplainListServer() {
  let complains: ComplainItem[] = [];
  let errorMessage: string | null = null;

  try {
    const response = await getStudentComplains();
    if (response && response?.success ) {
      complains = response.data.complains;
    } else {
      errorMessage = response?.message || "Failed to load complains.";
    }
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error)
      throw error;
    console.error("ComplainListServer error:", error);
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Failed to load complains.";
    }
  }

  const getStatusBadge = (statusLabel: string, status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
          >
            {statusLabel || "Pending"}
          </Badge>
        );
      case 1:
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
          >
            {statusLabel || "Resolved"}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-secondary border-gray-200 font-medium"
          >
            {statusLabel || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">My Complains</h1>
          <p className="text-sm text-muted-foreground">
            Submit and track all your support & issue complaints here.
          </p>
        </div>
        <AddComplainDialog />
      </div>

      {/* Error display using shared ErrorComponent */}
      {errorMessage ? (
        <ErrorComponent message={errorMessage} />
      ) : complains?.length === 0 ? (
        /* Empty display using shared NotFoundComponent */
        <NotFoundComponent
          title="No Complains Found"
          message="You haven't submitted any complains yet. If you face any issues, click above to submit a complain."
        />
      ) : (
        <div className="space-y-4">
          {complains?.map((item) => (
            <Card
              key={item?.id}
              className="border border-border/60 hover:shadow-sm transition-shadow rounded-xl py-4"
            >
              <CardContent className="px-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item?.title}
                  </h3>
                  <div>{getStatusBadge(item?.status_label, item?.status)}</div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/40">
                  {item?.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-1">
                  {item?.course_name && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-secondary">
                        <strong className="font-medium">
                          Course:
                        </strong>{" "}
                        {item?.course_name}
                      </span>
                    </div>
                  )}
                  {item?.batch_name && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-secondary">
                        <strong className="font-medium">
                          Batch:
                        </strong>{" "}
                        {item?.batch_name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-secondary">
                      <strong className="font-medium">
                        Submitted:
                      </strong>{" "}
                      {item.created_at}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
