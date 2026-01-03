import React from "react";
import EmployeeInfoCard from "../cards/EmployeeInfoCard";
import { LuArrowRight } from "react-icons/lu";

const EmployeeData = ({ employee = [],onSeeMore }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[240px] flex flex-col h-full">
      <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h5 className="text-lg font-medium">Executives Preview</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          View your executive work preview.
        </p>
        </div>
        <button className='card-btn' onClick={onSeeMore}>
           See All <LuArrowRight className='text-base'/>
        </button>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        {employee.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">No data available</p>
        )}

        {employee.slice(0, 5).map((item, index) => (
          <EmployeeInfoCard
            key={item.id || index}
            employeeName={item.employeeName}
            phone={item.employeePhone}
            count={item.count}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeData;
