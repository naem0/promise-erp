"use server";


import { deleteCategory, SingleCategoryResponse } from "@/apiServices/categoryService";


const DeleteCategoryAction = async (id: number): Promise<SingleCategoryResponse> => {
  try {
    const result: SingleCategoryResponse = await deleteCategory(id);
    return {
      success: !!result?.success,
      message: result?.message || (result?.success ? "Category deleted successfully" : "Delete failed"),
      code: result?.code,
      errors: result?.errors,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong!";
    return { success: false, message, code: 500 } as SingleCategoryResponse;
  }
};

export default DeleteCategoryAction;
