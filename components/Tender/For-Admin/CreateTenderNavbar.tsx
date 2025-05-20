import { createTenderNavData } from "@/lib/CreateTenderConstants";
import { Check } from "lucide-react";
import React from "react";

const CreateTenderNavbar = ({
  active,
  setActive,
}: {
  active: number;
  setActive: (active: number) => void;
}) => {
  return (
    <div className='w-80 shrink-0'>
      <div className='sticky  top-24 bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden'>
        <div className='pt-4 pb-2 px-4 bg-gray-5 border-'>
          <h2 className='font-semibold text-gray-900'>Tender Creation Steps</h2>
        </div>
        <div className='p-2'>
          {createTenderNavData?.map((data, i) => (
            <div
              key={data.title}
              className={`flex items-start gap-3 hover:bg-gray-50 cursor-pointer rounded p-3 transition-all
                   ${
                     active === i
                       ? "bg-primary/5 border-l-4 border-primary"
                       : ""
                   }`}
              onClick={() => setActive(i)}>
              <div
                className={`flex items-center justify-center rounded-full w-8 h-8 mt-0.5 ${
                  i < active
                    ? "bg-green-100 text-green-700"
                    : active === i
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-500"
                }`}>
                {i < active ? (
                  <Check size={16} />
                ) : (
                  <data.icon
                    size={16}
                    className='text-primary'
                  />
                )}
              </div>
              <div>
                <p
                  className={`font-medium text-sm ${
                    active === i ? "text-primary" : "text-gray-900"
                  }`}>
                  {data.title}
                </p>
                <p className='text-xs text-gray-500 mt-0.5'>
                  {data.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateTenderNavbar;
