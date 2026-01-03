import React from 'react'
import { getInitials } from '../../utils/helper';

const CharAvatar = ({ fullname, width, height , style }) => {
    const getRandomBgColor = () => {
  const colors = [
    "bg-red-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-indigo-300",
    "bg-orange-300",
    "bg-teal-300",
    "bg-cyan-300",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

  const bgColor = getRandomBgColor();

  return (
    <div className={`${width} ${height} ${style} flex items-center justify-center rounded-full text-gray-900 font-medium ${bgColor}`}>
        {getInitials(fullname || "")}
    </div>
  )
};


export default CharAvatar