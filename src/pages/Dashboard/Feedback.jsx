import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

const Feedback = () => {
  useUserAuth();

  const { user, selectedUserId } = useContext(UserContext);

  const [employeeData, setEmployeeData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEmployeeKey, setSelectedEmployeeKey] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const fetchingEmployeeData = async () => {
    if (!user || loadingEmployees) return;

    setLoadingEmployees(true);
    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      const res = await axiosInstance.get(
        `${API_PATH.ANALYSIS.GET_EMPLOYEE_USAGE_COUNT}${query}`
      );
      setEmployeeData(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchingEmployeeData();
  }, [user, selectedUserId]);

  useEffect(() => {
    if (!selectedEmployeeKey) {
      setAssignments([]);
      return;
    }

    const fetchFeedback = async () => {
      setLoadingFeedback(true);
      try {
        const res = await axiosInstance.get(
          `/api/tracker/assignments/${selectedEmployeeKey}`
        );
        setAssignments(
          Array.isArray(res.data?.points) ? res.data.points : []
        );
      } catch {
        toast.error("Failed to load feedback");
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchFeedback();
  }, [selectedEmployeeKey]);

  const feedbackList = useMemo(() => {
    return assignments.filter((a) => a.feedback);
  }, [assignments]);

  const handleExport = () => {
    if (!feedbackList.length || !selectedEmployeeKey) return;

    const employee = employeeData.find(
      (e) =>
        e.employeeName
          .toLowerCase()
          .replace(/\s+/g, "_") === selectedEmployeeKey
    );

    const data = feedbackList.map((f) => ({
      Loan_no: f.loan_no || "",
      "Customer Name": f.name || "",
      Feedback: f.feedback || "",
      "Employee Name": employee?.employeeName || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedback");
    XLSX.writeFile(wb, "feedback.xlsx");
  };

  return (
    <DashBoardLayout activeMenu="Feedback">
      <ToastContainer />

      <div className="h-[87dvh] flex flex-col px-2 sm:px-4 overflow-hidden">
        <div className="shrink-0 mt-3 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center p-3 sm:p-4 rounded-xl shadow-sm bg-white">
          <h1 className="text-xl sm:text-2xl font-bold">
            Feedback
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedEmployeeKey}
              onChange={(e) =>
                setSelectedEmployeeKey(e.target.value)
              }
              className="w-full sm:w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Choose Executive</option>
              {employeeData.map((emp, index) => (
                <option
                  key={index}
                  value={emp.employeeName
                    .toLowerCase()
                    .replace(/\s+/g, "_")}
                >
                  {emp.employeeName}
                </option>
              ))}
            </select>

            <button
              onClick={handleExport}
              disabled={!feedbackList.length}
              className="w-full sm:w-auto px-4 py-3 bg-green-600 text-white rounded-xl disabled:opacity-50 cursor-pointer"
            >
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 mt-3 sm:mt-4 bg-white rounded-xl p-3 sm:p-4 overflow-auto">
          {loadingFeedback ? (
            <p className="text-sm sm:text-base">
              Loading feedback...
            </p>
          ) : feedbackList.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base flex justify-center">
              No feedback available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {feedbackList.map((f, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl p-4 shadow-sm hover:shadow transition"
                >
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {f.name}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500">
                    {f.loan_no}
                  </p>

                  <p className="mt-2 text-sm sm:text-base text-gray-700">
                    {f.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Feedback;



