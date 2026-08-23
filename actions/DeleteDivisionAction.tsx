"use server";


import { deleteDivision } from "@/apiServices/divisionService";


interface ActionResponse {
  success: boolean;
  message: string;
}

const DeleteDivisionAction = async (id: number): Promise<ActionResponse> => {
  try {
    const result = await deleteDivision(id);
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    return { success: false, message };
  }
};

export default DeleteDivisionAction;
