"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      type='button'
      aria-label='Go back'
      onClick={() => router.back()}
      className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
      <ArrowLeft className='w-5 h-5' />
    </button>
  );
};

export default BackButton;
