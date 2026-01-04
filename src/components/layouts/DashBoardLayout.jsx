import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/userContext";

const DashBoardLayout = ({
  children,
  activeMenu,
  loading = false,
  loadingText = "Loading..."
}) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex w-full relative">
          <div className="hidden min-[1080px]:block w-64">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="flex-1 p-5 relative">
            {children}
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="bg-white px-8 py-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-700 text-center">
              {loadingText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardLayout;
