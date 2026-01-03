import React from "react";
import UserInfoCard from "../cards/UserInfoCard";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";

const AnalysisData = ({ analysis = [] ,onSeeMore}) => {
  const hasData = analysis && analysis.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[240px] flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
        <h5 className="text-lg font-medium">Customer Preview</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          View your customer data preview.
        </p>
        </div>
        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base'/>
        </button>
      </div>

      <div className="mt-6 relative flex-1 min-h-[260px] max-h-[260px] overflow-y-auto">
        {hasData &&
          analysis.slice(0, 5).map((item) => (
            <UserInfoCard
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

export default AnalysisData;
