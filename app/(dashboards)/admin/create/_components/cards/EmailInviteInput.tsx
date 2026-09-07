"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { X, Mail, Plus } from "lucide-react";
import { Label } from "@/_components/ui/label";

interface EmailInviteInputProps {
  /** When true, invited vendors are shown but cannot be added or removed (live tender edit). */
  readOnly?: boolean;
}

const EmailInviteInput = ({ readOnly = false }: EmailInviteInputProps) => {
  const { watch, setValue } = useFormContext<ITenderFormSteps>();
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const invitedEmails = watch("step1.invited_emails") || [];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedEmail) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (invitedEmails.includes(trimmedEmail)) {
      setEmailError("This email has already been added");
      return;
    }

    setValue("step1.invited_emails", [...invitedEmails, trimmedEmail]);
    setEmailInput("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setValue(
      "step1.invited_emails",
      invitedEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <Label htmlFor='email-invite' className='text-sm font-medium'>
          Invite Vendors by Email
        </Label>
        <p className='text-xs text-gray-500 mt-1 mb-3'>
          {readOnly
            ? "Invitations for this published tender cannot be changed here."
            : "Add email addresses of vendors you want to invite to this tender"}
        </p>

        {!readOnly && (
          <div className='flex gap-2'>
            <div className='flex-1'>
              <Input
                id='email-invite'
                type='email'
                placeholder='Enter vendor email address'
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={handleKeyDown}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className='text-xs text-red-500 mt-1'>{emailError}</p>
              )}
            </div>
            <Button
              type='button'
              onClick={handleAddEmail}
              variant='outline'
              className='flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Add
            </Button>
          </div>
        )}
      </div>

      {invitedEmails.length > 0 && (
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>
            Invited Vendors ({invitedEmails.length})
          </Label>
          <div className='border rounded-md p-3 bg-gray-50 max-h-60 overflow-y-auto'>
            <div className='space-y-2'>
              {invitedEmails.map((email, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between bg-white px-3 py-2 rounded border'>
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <Mail className='w-4 h-4 text-gray-400 flex-shrink-0' />
                    <span className='text-sm text-gray-700 truncate'>
                      {email}
                    </span>
                  </div>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemoveEmail(email)}
                      className='ml-2 h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600'>
                      <X className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {invitedEmails.length === 0 && !readOnly && (
        <div className='border-2 border-dashed rounded-md p-6 text-center text-gray-400'>
          <Mail className='w-8 h-8 mx-auto mb-2 opacity-50' />
          <p className='text-sm'>No vendors invited yet</p>
          <p className='text-xs mt-1'>
            Add email addresses above to invite vendors
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailInviteInput;
