import React from 'react'
import EmployeeInfoCard from "../cards/EmployeeInfoCard";

const EmployeePreview = ({ employee = [] }) => {
  return (
    <div className='card'>
      <div className='flex flex-col'>
        <h5 className='text-lg'>Executives Preview</h5>
        <p className='text-xs text-gray-400 mt-0.5'>
          View your executive work preview.
        </p>
      </div>

      <div className='mt-6 max-h-40 overflow-y-auto'>

        {employee.length === 0 && (
          <p className='text-center text-gray-400 text-sm py-4'>
            No data available
          </p>
        )}
        {employee.map((item, index) => (
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

export default EmployeePreview;
