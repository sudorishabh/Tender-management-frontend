// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Predefined error types
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request", code: string = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized", code: string = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden", code: string = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found", code: string = "NOT_FOUND") {
    super(message, 404, code);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict", code: string = "CONFLICT") {
    super(message, 409, code);
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string = "Validation Error",
    code: string = "VALIDATION_ERROR"
  ) {
    super(message, 422, code);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    message: string = "Internal Server Error",
    code: string = "INTERNAL_ERROR"
  ) {
    super(message, 500, code);
  }
}
