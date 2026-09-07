"use client";

import React, { ReactElement } from "react";
import { Card, CardContent } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import PdfViewerModal from "./PdfViewerModal";
import { Eye, FileCheck, FileUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/_components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface DocumentUploadFieldProps<T extends FieldValues> {
  /** react-hook-form control object (from useFormContext or useForm) */
  control: Control<T>;
  /** Field name path for the form field */
  name: FieldPath<T>;
  /** Current value - can be FileList (local) or string (S3 URL) */
  value?: FileList | string | null;
  /** Label for the document field */
  label: string;
  /** Description text shown below label */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Maximum file size in MB (default: 5) */
  maxSizeMB?: number;
  /** Accepted file types (default: application/pdf) */
  accept?: string;
  /** Custom validation rules to merge with defaults */
  rules?: Record<string, unknown>;
  /** Whether the document is being deleted */
  isDeleting?: boolean;
  /** Callback when remove button is clicked (for S3 files) */
  onRemove?: () => void;
  /** Custom class name for the container */
  className?: string;
  /** Show icon with label (default: true) */
  showIcon?: boolean;
  /** Size variant for the upload field: 'default' | 'compact' (default: 'default') */
  size?: "default" | "compact";
  /** Hide the header/label section (default: false) */
  hideHeader?: boolean;
}

/**
 * A reusable document upload field component that handles both local file uploads
 * and server-loaded documents (S3 URLs).
 *
 * Features:
 * - Consistent styling across the application
 * - Handles FileList (new uploads) and string (S3 URLs) values
 * - PDF preview modal integration
 * - Form validation with react-hook-form
 * - File size and type validation
 */
const DocumentUploadField = <T extends FieldValues>({
  control,
  name,
  value,
  label,
  description,
  required = false,
  maxSizeMB = 5,
  accept = "application/pdf",
  rules,
  isDeleting = false,
  onRemove,
  className,
  showIcon = true,
  size = "default",
  hideHeader = false,
}: DocumentUploadFieldProps<T>): ReactElement => {
  const fieldId = `file_${String(name).replace(/\./g, "_")}`;

  // Determine if the current value is from S3 (string) or local (FileList)
  const isS3File = typeof value === "string" && value.length > 0;
  const hasLocalFile =
    value && typeof value !== "string" && (value as FileList)?.[0];
  const hasFile = isS3File || hasLocalFile;

  // Get display name for the file
  const getFileName = (): string => {
    if (isS3File) {
      // Extract filename from S3 URL (format: prefix-uuid-filename)
      const parts = (value as string).split("-");
      return parts.length > 2 ? parts.slice(2).join("-") : (value as string);
    }
    if (hasLocalFile) {
      return ((value as FileList)[0] as File).name;
    }
    return "";
  };

  // Get file for PDF viewer
  const getFileForViewer = (): File | string => {
    if (isS3File) {
      return value as string;
    }
    if (hasLocalFile) {
      return (value as FileList)[0] as File;
    }
    return "";
  };

  // Default validation rules
  const defaultRules = {
    required: required ? `${label} is required` : false,
    validate: {
      isPdf: (val: FileList | string | undefined) => {
        if (!val) return true;
        // S3 URLs are already validated on upload
        if (typeof val === "string") return true;
        // Validate FileList
        if (val[0]) {
          const file = val[0] as File;
          if (accept === "application/pdf" && file.type !== "application/pdf") {
            return "Only PDF files are allowed";
          }
        }
        return true;
      },
      fileSize: (val: FileList | string | undefined) => {
        if (!val) return true;
        // S3 URLs are already validated on upload
        if (typeof val === "string") return true;
        // Validate FileList
        if (val[0]) {
          const file = val[0] as File;
          if (file.size > maxSizeMB * 1024 * 1024) {
            return `File size must be less than ${maxSizeMB}MB`;
          }
        }
        return true;
      },
    },
    ...rules,
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {!hideHeader && (
        <div>
          <h3 className='font-medium text-sm text-gray-800 flex items-center gap-1.5'>
            {showIcon && (
              <FileCheck
                size={14}
                className='text-primary'
              />
            )}
            {label}
            {required && <span className='text-red-500'>*</span>}
          </h3>
          {description && (
            <p className='text-xs text-gray-500 mt-1'>{description}</p>
          )}
        </div>
      )}

      {/* Card Container */}
      <Card
        className={cn(
          "border border-gray-200 shadow-sm",
          size === "compact" && "shadow-none"
        )}>
        <CardContent className={cn("p-3.5", size === "compact" && "p-3")}>
          <div className={cn("space-y-4", size === "compact" && "space-y-2")}>
            <FormField
              control={control}
              name={name}
              rules={defaultRules}
              render={({ field: { onChange, ref } }) => (
                <FormItem>
                  <FormControl>
                    <label
                      htmlFor={fieldId}
                      className='block cursor-pointer'>
                      <Input
                        id={fieldId}
                        type='file'
                        className='hidden'
                        accept={accept}
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                      />

                      {hasFile ? (
                        <div
                          className={cn(
                            "border-2 border-dashed cursor-pointer border-green-400 bg-green-50 rounded-lg flex items-center justify-center",
                            size === "compact"
                              ? "p-3 flex-row gap-3"
                              : "p-4 flex-col gap-2"
                          )}>
                          <FileCheck
                            className={cn(
                              size === "compact" ? "w-5 h-5" : "size-7",
                              "text-green-600"
                            )}
                          />
                          <div
                            className={cn(
                              size === "compact"
                                ? "text-left flex-1"
                                : "text-center"
                            )}>
                            <p className='line-clamp-1 text-green-700 font-medium text-xs max-w-full'>
                              {getFileName()}
                            </p>
                            <p className='text-xs text-green-600'>
                              Click to change file
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "border-2 border-dashed cursor-pointer border-gray-300 hover:border-primary hover:bg-gray-50 rounded-lg flex items-center justify-center transition-all",
                            size === "compact"
                              ? "p-3 flex-row gap-3"
                              : "p-4 flex-col gap-3"
                          )}>
                          <FileUp
                            className={cn(
                              size === "compact" ? "w-6 h-6" : "size-7",
                              "text-gray-400"
                            )}
                          />
                          <div
                            className={cn(
                              size === "compact" ? "text-left" : "text-center"
                            )}>
                            <p className='text-xs font-medium text-gray-700'>
                              Click to upload PDF
                            </p>
                            <p className='text-xs text-gray-500 mt-0.5'>
                              PDF only, max {maxSizeMB}MB
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            {hasFile && (
              <div className='flex gap-2'>
                {/* Preview Button */}
                <PdfViewerModal
                  value={getFileForViewer()}
                  isS3File={isS3File}
                  triggerButton={
                    <Button
                      type='button'
                      variant='outline'
                      className='flex-1 flex items-center justify-center gap-2 h-8 text-xs text-primary border-primary/30 hover:bg-primary/10'>
                      <Eye size={12} /> View Document
                    </Button>
                  }
                />

                {/* Remove Button (only for S3 files with onRemove callback) */}
                {isS3File && onRemove && (
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isDeleting}
                    onClick={onRemove}
                    className='flex items-center justify-center gap-2 h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'>
                    <Trash2 size={16} />
                    {isDeleting ? "Removing..." : "Remove"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadField;
