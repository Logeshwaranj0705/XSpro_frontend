import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/userContext";

const DashBoardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex w-full">
          <div className="hidden min-[1080px]:block w-64">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="flex-1 p-5">{children}</div>  
        </div>
      )}
    </div>
  );
};

export default DashBoardLayout;
