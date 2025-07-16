export interface BaseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  returnedAt: string;
  extras?: Record<string, any>;
}
