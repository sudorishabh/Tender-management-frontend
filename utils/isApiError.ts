/**
 * Type guard to check if an error is a tRPC API error with data.message
 */
export function isApiError(
  error: unknown
): error is { data: { message: string; code?: string } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: { message: string } }).data?.message === "string"
  );
}

/**
 * Type guard for tRPC error shape
 */
export interface TRPCClientErrorShape {
  message: string;
  data?: {
    code?: string;
    message?: string;
    zodError?: {
      fieldErrors?: Record<string, string[]>;
      formErrors?: string[];
    } | null;
  };
}

/**
 * Type guard to check if an error is a tRPC client error
 */
export function isTRPCClientError(
  error: unknown
): error is TRPCClientErrorShape {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as TRPCClientErrorShape).message === "string"
  );
}

/**
 * Extract a user-friendly error message from any error
 * Prioritizes: data.message > message > generic fallback
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage: string = "Something went wrong. Please try again."
): string {
  // Handle tRPC API errors with data.message
  if (isApiError(error)) {
    return error.data.message;
  }

  // Handle errors with direct message property
  if (isTRPCClientError(error)) {
    return error.message;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
}

/**
 * Extract Zod validation errors from a tRPC error
 * Returns an object with field-specific errors
 */
export function getZodErrors(error: unknown): Record<string, string[]> | null {
  if (isApiError(error) && error.data && "zodError" in error.data) {
    const zodError = (
      error.data as {
        zodError?: { fieldErrors?: Record<string, string[]> } | null;
      }
    ).zodError;
    return zodError?.fieldErrors || null;
  }
  return null;
}

/**
 * Check if an error is a specific tRPC error code
 */
export function isErrorCode(
  error: unknown,
  code:
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL_SERVER_ERROR"
): boolean {
  if (isApiError(error) && error.data.code) {
    return error.data.code === code;
  }
  return false;
}

/**
 * Error code descriptions for UI display
 */
export const ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: "The request was invalid. Please check your input.",
  UNAUTHORIZED: "Please sign in to continue.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested item was not found.",
  CONFLICT: "This action conflicts with existing data.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again.",
  PARSE_ERROR: "Failed to process the request.",
  TIMEOUT: "The request timed out. Please try again.",
  TOO_MANY_REQUESTS: "Too many requests. Please wait and try again.",
};

/**
 * Get a user-friendly message based on error code
 */
export function getCodeMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}
