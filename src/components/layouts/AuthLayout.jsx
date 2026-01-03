import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import image from "../../assets/icon.png";

const AuthLayout = ({ children, isActive }) => {

  const [state, setState] = useState(true);

  useEffect(() => {
    setState(isActive === "login");
  }, [isActive]);

  return (
    <div className='bg-blue-800'>
    <div className="flex w-screen h-screen">

      <div className={`w-[20%] bg-blue-800 relative transition-all duration-700 ease-in-out
      ${state ?
        "animate-slideLeftBar" :
        "animate-slideRightBar"
      }`}></div>

      <div
        className={`absolute top-0 w-[42%] h-screen bg-gray-100 z-20 min-w-[420px] rounded-tr-[270px] rounded-br-[270px]
        transition-all duration-700 ease-in-out
        ${state 
          ? " left-0 animate-slideLeft"
          : "left-0 animate-slideRight"
        }`}
      >
        <img src={image} alt="Logo" className="w-[35%] p-4 md:p-2 xl:p-0"/>
        {children}
      </div>

      <div className="flex-1 relative w-2/3">
        <Spline
        scene="https://prod.spline.design/LGhU4x0tZZb95lh1/scene.splinecode" 
      />
        <div className="absolute inset-0 bg-transparent"></div>
      </div>

    </div>
    </div>
  );
};

export default AuthLayout;
