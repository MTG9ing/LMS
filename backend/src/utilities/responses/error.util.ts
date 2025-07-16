import { BaseResponse } from "../../dtos/baseResponse.dto";

export function buildErrorResponse(
  message: string,
  extras?: Record<string, any>
): BaseResponse<null> {
  return {
    success: false,
    returnedAt: new Date().toISOString(),
    message,
    data: null,
    extras,
  };
}
