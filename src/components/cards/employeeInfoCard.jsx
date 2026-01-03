import React from 'react'
import { LuUser } from 'react-icons/lu';

const EmployeeInfoCard = ({employeeName,phone, count, hideDeleteBtn}) => {
  return (
    <div className="group flex items-center justify-between gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100">


      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        <LuUser />
      </div>

      <div className="flex-1 flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{employeeName}</p>
        <p className="text-xs text-gray-500">Phone: {phone}</p>
      </div>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 text-green-600`}>
        <span className="text-xs font-medium capitalize">Case Count: {count}</span>
      </div>

    </div>
  );
};

export default EmployeeInfoCard