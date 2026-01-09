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
      "Loan_no" : f.loan_no || "",
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

      <div className="h-screen flex flex-col px-4 overflow-hidden">
        <div className="shrink-0 mt-4 flex justify-between items-center p-4 rounded-xl shadow-sm bg-white">
          <h1 className="text-2xl font-bold">Feedback</h1>

          <div className="flex gap-3">
            <select
              value={selectedEmployeeKey}
              onChange={(e) => setSelectedEmployeeKey(e.target.value)}
              className="w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-3 bg-green-600 text-white rounded-xl disabled:opacity-50"
            >
              Export
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl p-4 overflow-auto">
          {loadingFeedback ? (
            <p>Loading feedback...</p>
          ) : feedbackList.length === 0 ? (
            <p className="text-gray-500">No feedback available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackList.map((f, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl p-4 shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {f.name}
                  </p>

                  <p className="font-semibold text-gray-800">
                    {f.loan_no}
                  </p>

                  <p className="mt-2 text-gray-600">
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
