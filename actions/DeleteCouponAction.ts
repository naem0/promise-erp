"use server";


import { deleteCoupon, SingleCouponResponse } from "@/apiServices/couponsService";
const DeleteCouponAction = async (id: number): Promise<SingleCouponResponse> => {
  try {
    const result: SingleCouponResponse = await deleteCoupon(id);

    return {
      success: !!result?.success,
      message: result?.message || (result?.success ? "Coupon deleted successfully" : "Delete failed"),
      code: result?.code,
      data: null,
      errors: result?.errors,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong!";
    return { success: false, message, code: 500, data: null };
  }
};

export default DeleteCouponAction;