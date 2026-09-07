"use client";
import React from "react";

export function SuperAdminSidebar() {
  return (
    <aside className='p-4 w-56 bg-gray-100 border-r'>
      <h2 className='font-semibold mb-2'>Super Admin</h2>
      <ul className='space-y-1 text-sm'>
        <li>Overview</li>
        <li>Admins</li>
        <li>Vendors</li>
        <li>Tenders</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
}

export default SuperAdminSidebar;
