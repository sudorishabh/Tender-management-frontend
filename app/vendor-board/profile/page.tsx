"use client";
import Heading from "@/components/Shared/Heading";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Mail,
  Phone,
  User,
  Building,
  FileText,
  Calendar,
} from "lucide-react";

const VendorProfilePage = () => {
  // Mock data - in a real app, this would come from an API
  const vendorProfile = {
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "+91 98765 43210",
    panCardNumber: "ABCDE1234F",
    panCardDoc: "pan_card_document.pdf",
    status: "Active",
    createdAt: "2023-01-15",
    business: {
      name: "Smith Enterprises",
      classification: "Medium Enterprise",
      registrationNumber: "REG12345678",
      registrationDoc: "business_registration.pdf",
      establishedYear: "2010",
    },
  };

  return (
    <div className='pt-[3.8rem] px-8 py-6'>
      <Heading
        title='Vendor Profile'
        description='Your vendor profile and business information'
        keywords='Profile, Vendor, Business'
      />

      <div className='mt-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Profile Information</h1>
          <Button className='bg-blue-600 hover:bg-blue-700 flex items-center gap-2'>
            <Edit className='h-4 w-4' />
            Edit Profile
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Personal Information Card */}
          <Card className='bg-white shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-medium flex items-center'>
                <User className='h-5 w-5 mr-2 text-blue-600' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Full Name</p>
                    <p className='font-medium'>{vendorProfile.fullName}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <div className='flex items-center'>
                      <Mail className='h-4 w-4 mr-1 text-gray-400' />
                      <p>{vendorProfile.email}</p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Phone Number</p>
                    <div className='flex items-center'>
                      <Phone className='h-4 w-4 mr-1 text-gray-400' />
                      <p>{vendorProfile.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Status</p>
                    <p className='font-medium'>
                      <span className='inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800'>
                        {vendorProfile.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>PAN Card Number</p>
                    <p className='font-medium'>{vendorProfile.panCardNumber}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>PAN Card Document</p>
                    <Button
                      variant='outline'
                      className='mt-1 text-blue-600 border-blue-200'>
                      <FileText className='h-4 w-4 mr-1' />
                      View Document
                    </Button>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Account Created</p>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-1 text-gray-400' />
                    <p>{vendorProfile.createdAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information Card */}
          <Card className='bg-white shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-medium flex items-center'>
                <Building className='h-5 w-5 mr-2 text-blue-600' />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Business Name</p>
                    <p className='font-medium'>{vendorProfile.business.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Classification</p>
                    <p className='font-medium'>
                      {vendorProfile.business.classification}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Registration Number</p>
                    <p className='font-medium'>
                      {vendorProfile.business.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Established Year</p>
                    <p className='font-medium'>
                      {vendorProfile.business.establishedYear}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Registration Document</p>
                  <Button
                    variant='outline'
                    className='mt-1 text-blue-600 border-blue-200'>
                    <FileText className='h-4 w-4 mr-1' />
                    View Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;
