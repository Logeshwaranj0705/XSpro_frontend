import React, { useState, useEffect } from 'react'
import { prepareEmployeeByCount } from '../../utils/helper'
import { LuPlus } from "react-icons/lu"
import CustomEmployeeBarChart from '../charts/CustomEmployeeBarChart';
import { FaTrash } from 'react-icons/fa';

const EmployeeOverview = ({ employee, onAddEmployee, onDeleteEmployee }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        const result = prepareEmployeeByCount(employee || []);
        setBarChartData(result);
    }, [employee]);

    const hasData = barChartData && barChartData.length > 0;

    return (
        <div className='card relative'>
            <div className='flex items-center justify-between'>
                <div>
                    <h5 className='text-lg'>Executive Overview</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Track your executive over time.
                    </p>
                </div>
                <div className='flex gap-3'>
                    <button className='add-btn' onClick={ onDeleteEmployee}>
                        <FaTrash className='text-sm' />
                        Delete Data
                    </button>
                
                    <button className='add-btn' onClick={onAddEmployee}>
                        <LuPlus className='text-lg' />
                        Add Excel
                    </button>
                </div>
            </div>

            <div className='mt-10 relative min-h-[265px]'>

                {hasData && (
                    <CustomEmployeeBarChart 
                        data={barChartData}
                        xKey="name"
                    />
                )}

                {!hasData && (
                    <div 
                        className="
                            absolute inset-0 flex flex-col items-center justify-center
                            bg-white/70 backdrop-blur-sm rounded-xl
                            border border-dashed border-gray-300
                        "
                    >
                        <p className="text-gray-500 text-sm mb-2">No executive data available</p>

                        <button 
                            onClick={onAddEmployee}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg shadow"
                        >
                            Upload Excel
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default EmployeeOverview;
