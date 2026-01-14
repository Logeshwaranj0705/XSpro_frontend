import React, { useEffect, useState, useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import * as XLSX from "xlsx";
import { FaFolder } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnalysisOverview from "../../components/analysis/AnalysisOverview";
import EmployeeOverview from "../../components/analysis/EmployeeOverview";
import Model from "../../components/Model";
import AnalysisPreview from "../../components/analysis/AnalysisPreview";
import EmployeePreview from "../../components/analysis/EmployeePreview";
import { UserContext } from "../../context/userContext";

const Analysis = () => {
  useUserAuth();
  const { user, selectedUserId } = useContext(UserContext);

  const [analysisData, setAnalysisData] = useState({ analysis: [] });
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [openAddAnalysisModal, setOpenAddAnalysisModal] = useState(false);
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    toast.info("Upload Executive Sheet First", {
      position: "top-right",
      autoClose: 3000
    });
  }, []);

  const fetchingAnalysisData = async () => {
    if (!user || loading) return;
    setLoading(true);

    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";

      const analysisRes = await axiosInstance.get(
        `${API_PATH.ANALYSIS.GET_ALL_ANALYSIS}${query}`
      );
      if (analysisRes.data) setAnalysisData(analysisRes.data);

      const employeeRes = await axiosInstance.get(
        `${API_PATH.ANALYSIS.GET_EMPLOYEE_USAGE_COUNT}${query}`
      );
      if (employeeRes.data) setEmployeeData(employeeRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingAnalysisData();
  }, [user, selectedUserId]);

  const convertExcelToJSON = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(sheet, { defval: "" }));
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });

  const handleSaveNotes = async () => {
    if (!notes.trim()) return toast.error("Please write some notes first!");

    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      await axiosInstance.post(
        `${API_PATH.ANALYSIS.SET_NOTES}${query}`,
        { note: notes }
      );
      toast.success("Notes saved successfully!");
      setNotes("");
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const handleDeleteAnalysis = async () => {
    if (!window.confirm("Delete all analysis data for this user?")) return;

    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      await axiosInstance.delete(
        `${API_PATH.ANALYSIS.DELETE_ANALYSIS}${query}`
      );
      toast.success("Analysis deleted successfully!");
      fetchingAnalysisData();
    } catch {
      toast.error("Failed to delete analysis");
    }
  };

  const handleDeleteEmployee = async () => {
    if (!window.confirm("Delete all employee data for this user?")) return;

    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      await axiosInstance.delete(
        `${API_PATH.EMPLOYEE.DELETE_EMPLOYEE}${query}`
      );
      toast.success("Employee data deleted successfully!");
      fetchingAnalysisData();
    } catch {
      toast.error("Failed to delete employee data");
    }
  };

  const handleUploadAnalysis = async (file) => {
    try {
      setUploading(true);

      const data = await convertExcelToJSON(file);
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";

      await axiosInstance.post(
        `${API_PATH.ANALYSIS.ADD_ANALYSIS}${query}`,
        { data }
      );

      toast.success("Customer sheet uploaded!");
      fetchingAnalysisData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload analysis");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadEmployee = async (file) => {
    try {
      setUploading(true);

      const data = await convertExcelToJSON(file);
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";

      await axiosInstance.post(
        `${API_PATH.EMPLOYEE.ADD_EMPLOYEE}${query}`,
        { data }
      );

      toast.success("Executive sheet uploaded!");
      fetchingAnalysisData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload employee sheet");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      const res = await axiosInstance.get(
        `${API_PATH.ANALYSIS.DOWNLOAD_ANALYSIS}${query}`,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "analysis_details.xlsx";
      link.click();

      toast.success("Excel downloaded!");
    } catch {
      toast.error("Failed to download Excel");
    }
  };

  const handleUpdateEmployee = async () =>{
    try{
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      await axiosInstance.post(
        `${API_PATH.ANALYSIS.UPDATE_WORK}${query}`,
      );
      toast.success("Work updated successfully");
    } catch {
      toast.error("Faild to update work");
    }
  };

  return (
    <DashBoardLayout activeMenu="Analysis">
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white px-8 py-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-700">
              Processing Excel file...
            </p>
          </div>
        </div>
      )}

      <div className="my-6 mx-auto">
        <ToastContainer />

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3">
              <AnalysisOverview
                analysis={analysisData.analysis}
                onAddAnalysis={() => setOpenAddAnalysisModal(true)}
                onDeleteAnalysis={handleDeleteAnalysis}
              />
            </div>

            <div className="col-span-3">
              <AnalysisPreview analysis={analysisData.analysis} />
            </div>

            <div className="col-span-3 md:col-span-2">
              <EmployeeOverview
                employee={employeeData}
                onAddEmployee={() => setOpenAddEmployeeModal(true)}
                onDeleteEmployee={handleDeleteEmployee}
              />
            </div>

            <div className="col-span-3 md:col-span-1 flex flex-col gap-6">
              <EmployeePreview employee={employeeData} />

              <div className="bg-white p-5 rounded-xl shadow-lg">
                <h5 className="mb-3 text-lg">Feedback</h5>
                <textarea
                  className="w-full border rounded p-3 text-sm"
                  placeholder="Write your daily feedback..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>

            <div className=" flex col-span-3 gap-6">
              <button
                onClick={handleUpdateEmployee}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded cursor-pointer"
              >
                <FiEdit />
                Update Work
              </button>
              
              <button
                onClick={handleDownloadExcel}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded cursor-pointer"
              >
                <FaFolder />
                Download Excel
              </button>
            </div>
          </div>
        )}
      </div>

      <Model
        isOpen={openAddAnalysisModal}
        onClose={() => setOpenAddAnalysisModal(false)}
        title="Upload Customer Excel"
        onUpload={handleUploadAnalysis}
      />

      <Model
        isOpen={openAddEmployeeModal}
        onClose={() => setOpenAddEmployeeModal(false)}
        title="Upload Executive Excel"
        onUpload={handleUploadEmployee}
      />
    </DashBoardLayout>
  );
};

export default Analysis;
