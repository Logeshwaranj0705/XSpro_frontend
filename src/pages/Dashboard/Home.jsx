import React, { useContext, useEffect, useState } from "react";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";

import AnalysisData from "../../components/dashboard/AnalysisData";
import EmployeeData from "../../components/dashboard/EmployeeData";
import MessagerData from "../../components/dashboard/MessagerData";
import MessagerDataSchedule from "../../components/dashboard/MessagerDataSchedule";
import NotesData from "../../components/dashboard/NotesData";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";

import { FaUserFriends } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/cards/InfoCard";

const Home = () => {
  useUserAuth();

  const { user, selectedUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        API_PATH.DASHBOARD.GET_ALL_DASHBOARDDATA,
        {
          params: { userId: selectedUserId || undefined },
        }
      );
      setDashboardData(data || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user, selectedUserId]);

  if (!user || loading) {
    return (
      <DashBoardLayout activeMenu="Dashboard">
        <ToastContainer />
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout activeMenu="Dashboard">
      <ToastContainer />

      {dashboardData ? (
        <div className="space-y-4 px-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<FaUserFriends />}
              label="Total Analysis"
              value={dashboardData.analysis?.length || 0}
              color="bg-primary"
            />
            <InfoCard
              icon={<MdMessage />}
              label="Actions Taken"
              value={dashboardData.action?.length || 0}
              color="bg-orange-500"
            />
            <InfoCard
              icon={<RiTeamLine />}
              label="Employee Usage"
              value={dashboardData.employeeUsage?.length || 0}
              color="bg-red-500"
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="xl:col-span-2 h-full">
              <AnalysisData
                analysis={dashboardData.analysis || []}
                onSeeMore={() => navigate("/analysis")}
              />
            </div>

            <div className="h-full">
              <NotesData
                notes={dashboardData.notes || []}
                onDeleted={fetchDashboard}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="xl:col-span-1 h-full">
              <EmployeeData
                employee={dashboardData.employeeUsage || []}
                onSeeMore={() => navigate("/analysis")}
              />
            </div>

            <div className="xl:col-span-2 h-full">
              <MessagerDataSchedule
                status={dashboardData.action || []}
                onSeeMore={() => navigate("/messager")}
              />
            </div>
          </div>
          <div className="h-full">
            <MessagerData
              status={dashboardData.noAction || []}
              onSeeMore={() => navigate("/messager")}
            />
          </div>

        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No data found...</p>
      )}
    </DashBoardLayout>
  );
};

export default Home;
