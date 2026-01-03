import React from "react";
import moment from "moment";
import PaidUserInfo from "../cards/PaidUserInfo";
import { LuArrowRight } from "react-icons/lu";

const MessagerData = ({ status = [],onSeeMore }) => {
  const hasData = status && status.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[240px] flex flex-col">
      <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h5 className="text-lg font-medium">Paid Customers Preview</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          Customers with no messages need.
        </p>
        </div>
        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base'/>
        </button>
      </div>

      <div className="mt-6 relative flex-1 min-h-[300px] max-h-[300px] overflow-y-auto">
        {hasData &&
          status.slice(0, 5).map((item) => (
            <PaidUserInfo
              key={item._id}
              name={item.name}
              loan_no={item.loan_no}
              employeeName={item.employeeName}
              phone={item.phone}
              date={moment(item.date).format("Do MMM YYYY")}
              status={item.status}
              hideDeleteBtn
            />
          ))}

        {!hasData && (
          <div
            className="
              absolute inset-0 flex flex-col items-center justify-center
              bg-white/70 backdrop-blur-sm rounded-xl
              border border-dashed border-gray-300
            "
          >
            <p className="text-gray-500 text-sm mb-2">No customer data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagerData;
