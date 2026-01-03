import React, { useContext } from 'react';
import { SIDE_MENU_DATA, SIDE_MENU_ADMIN_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from '../cards/CharAvatar';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login", { replace: true });
  };

  const handleClick = (item) => {
    if (item.path === "/logout") {
      handleLogout();
      return;
    }
    navigate(item.path);
  };

  const menuData = user?.role === "admin" ? SIDE_MENU_ADMIN_DATA : SIDE_MENU_DATA;

  return (
    <div className="w-64 h-[calc(100vh-56px)] bg-white border-r border-gray-200 p-5 sticky top-[56px] z-20 flex flex-col">
      
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="profile"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <CharAvatar
            fullname={user?.fullname}
            width="w-20"
            height="h-20"
            style="text-4xl"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullname}
        </h5>
      </div>

      <div className="flex flex-col gap-1 flex-grow">
        {menuData
          .filter(item => item.label !== "Logout")
          .map((item, index) => (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px]
                py-3 px-6 rounded-lg mb-2
                transition-colors duration-300
                ${activeMenu === item.label
                  ? "text-white bg-primary"
                  : "text-gray-700 hover:bg-gray-200"}`}
              onClick={() => handleClick(item)}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          ))}
      </div>

      <div className="mt-auto">
        {menuData
          .filter(item => item.label === "Logout")
          .map((item, index) => (
            <button
              key={`logout_${index}`}
              className="w-full flex items-center gap-4 text-[15px]
                         py-3 px-6 rounded-lg
                         text-red-600 bg-red-100 hover:bg-red-500 hover:text-white
                         transition-colors duration-300"
              onClick={() => handleClick(item)}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          ))}
      </div>

    </div>
  );
};

export default SideMenu;
