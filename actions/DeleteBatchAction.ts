"use server";


import { deleteBatch } from "@/apiServices/batchService";

interface ActionResponse {
  success: boolean;
  message: string;
}

const DeleteBatchAction = async (id: number): Promise<ActionResponse> => {
  try {
    const result = await deleteBatch(id);
    return {
      success: true,
      message: result?.message || "Batch deleted successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    return { success: false, message };
  }
};

export default DeleteBatchAction;
