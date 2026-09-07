import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { ZodError } from "zod";

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: unknown;
  stack?: string;
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error("API Error:", error);

  // Handle ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        errors: error.errors,
      },
      { status: 422 }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        code: "INTERNAL_ERROR",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      success: false,
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

// Success response helper
export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

// Created response helper
export function createdResponse<T>(data: T) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}
