/**
 * ApiError — typed wrapper around HTTP errors from the backend.
 * Keeps error-handling logic centralised in the service layer.
 */
export class ApiError extends Error {
  override readonly message: string;
  readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.statusCode = statusCode;
  }

  static fromHttpError(error: any): ApiError {
    const message = error?.error?.error ?? error?.message ?? 'An unexpected error occurred.';
    const status  = error?.status ?? 500;
    return new ApiError(message, status);
  }
}
