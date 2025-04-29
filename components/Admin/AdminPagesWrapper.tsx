import React from "react";

const AdminPagesWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className='w-full pt-12 px-8'>{children}</div>;
};

export default AdminPagesWrapper;
