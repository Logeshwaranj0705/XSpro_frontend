import React, { useState, useMemo } from 'react'
import moment from 'moment'
import PaidUserInfo from '../cards/paidUserInfo';

const MessagerDue = ({ status = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStatus = useMemo(() => {
    if (!searchTerm.trim()) return status;
    return status.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toString().includes(searchTerm) ||
      item.loan_no.toString().includes(searchTerm)
    );
  }, [searchTerm, status]);

  const hasData = filteredStatus && filteredStatus.length > 0;

  return (
    <div className='card p-5'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div className='flex flex-col'>
          <h5 className='text-lg'>Messager Records</h5>
          <p className='text-xs text-gray-400 mt-0.5'>
            Customers message record over time.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-1.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none transition w-full md:w-56"
        />
      </div>

      <div className='mt-4 relative min-h-[240px] max-h-78 overflow-y-auto'>
        {hasData ? (
          filteredStatus.map((item) => (
            <PaidUserInfo
              key={item._id}
              name={item.name}
              loan_no={item.loan_no}
              employeeName={item.employeeName}
              statusMessage={item.statusMessage}
              phone={item.phone}
              date={moment(item.date).format("Do MMM YYYY")}
              status={item.status}
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="
            absolute inset-0 flex flex-col items-center justify-center
            bg-white/70 backdrop-blur-sm rounded-xl
            border border-dashed border-gray-300
          ">
            <p className="text-gray-500 text-sm mb-2">No customer data found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagerDue;
