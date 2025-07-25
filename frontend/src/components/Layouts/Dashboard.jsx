import React, { useContext } from "react";
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar'; 
import SideMenu from './SideMenu'; 

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  console.log("👤 user in DashboardLayout:", user);

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
        <div className="grow mx-5">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
