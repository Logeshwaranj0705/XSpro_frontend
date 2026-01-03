import React from 'react';
import { LuCheck, LuUser } from 'react-icons/lu';
import { HiX } from "react-icons/hi";

const PaidUserInfo = ({ name, loan_no,employeeName, phone, date, status, statusMessage }) => {

  const statusStyles =
    status === "paid"
      ? "bg-green-50 text-green-600"
      : "bg-red-50 text-red-500";
  const displayMessage =
    status === "paid" ? "No action needed" : statusMessage;

  return (
    <div className="group flex items-center justify-between gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100">

      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        <LuUser />
      </div>

      <div className="flex-1 flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">loan_no: {loan_no}</p>
        <p className="text-xs text-gray-500">Phone: {phone}</p> 
        <p className="text-xs text-gray-500">Executive: {employeeName}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${statusStyles}`}>
        <span className="text-xs font-medium capitalize">
          {displayMessage}
        </span>
        {status === "paid" ? (
          <LuCheck size={16} />
        ) : (
          <HiX size={16} />
        )}
      </div>

    </div>
  );
};

export default PaidUserInfo;
