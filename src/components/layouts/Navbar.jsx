import React, { useState, useContext, useEffect, useRef } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { MdTerrain } from "react-icons/md";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const { user, selectedUserId, setSelectedUserId } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.role !== "admin") return;

    axiosInstance
      .get(API_PATH.ADMIN.GET_ALL_USERS)
      .then(({ data }) => setAllUsers(data.users || []))
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentName =
    selectedUserId
      ? allUsers.find((u) => u._id === selectedUserId)?.fullname
      : "Admin";

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-[56px] sticky top-0 z-[999]">

      <div className="flex items-center gap-4">
        <button onClick={() => setOpenSideMenu(!openSideMenu)}>
          {openSideMenu ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
        </button>

        <h2 className="text-lg font-medium flex items-center gap-1">
          XSpro Tracker <MdTerrain className="text-blue-600" />
        </h2>
      </div>
      {user?.role === "admin" && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenUserMenu(!openUserMenu)}
            className="
              flex items-center gap-2
              text-sm font-medium text-gray-700
              cursor-pointer
              focus:outline-none
            "
          >
            {currentName}
            <span className="text-[10px] text-gray-500">▼</span>
          </button>

          {openUserMenu && (
            <div className="
              absolute right-0 mt-2
              w-40
              bg-white
              border border-gray-200
              rounded-md
              shadow-lg
              overflow-hidden
              z-50
            ">
              <div
                onClick={() => {
                  setSelectedUserId(null);
                  setOpenUserMenu(false);
                }}
                className="
                  px-4 py-2 text-sm
                  cursor-pointer
                  hover:bg-gray-100
                  font-medium
                "
              >
                Admin
              </div>

              {allUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setSelectedUserId(u._id);
                    setOpenUserMenu(false);
                  }}
                  className="
                    px-4 py-2 text-sm
                    cursor-pointer
                    hover:bg-gray-100
                  "
                >
                  {u.fullname}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {openSideMenu && (
        <div className="fixed top-[56px] left-0 w-64 bg-white shadow-md">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
