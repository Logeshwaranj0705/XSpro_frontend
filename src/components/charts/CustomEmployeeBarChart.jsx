import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell
} from "recharts";

const CustomEmployeeBarChart = ({ data, xKey = "name" }) => {

  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const item = payload[0].payload;

      return (
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
          <p className='text-xs font-semibold text-purple-800 mb-1'>
            {item[xKey]}
          </p>

          <p className='text-sm text-gray-600'>
            Case Count:{" "}
            <span className='text-sm font-medium text-gray-900'>
              {item.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white mt-6'>
      <ResponsiveContainer width="100%" height={374}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomEmployeeBarChart;
