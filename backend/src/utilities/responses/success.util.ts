import { BaseResponse } from "../../dtos/baseResponse.dto";

export function buildSuccessResponse<T>(
  data: T,
  message?: string,
  extras?: Record<string, any>
): BaseResponse<T> {
  return {
    success: true,
    returnedAt: new Date().toISOString(),
    message,
    data,
    extras,
  };
}
