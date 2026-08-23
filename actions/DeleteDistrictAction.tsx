"use server";


import { deleteDistrict } from "@/apiServices/districtService";

interface ActionResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: unknown;
}

const DeleteDistrictAction = async (id: number): Promise<ActionResponse> => {
  try {
    const result = await deleteDistrict(id);
    return {
      success: true,
      message: result?.message || "Student deleted successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    return { success: false, message };
  }
};

export default DeleteDistrictAction;
