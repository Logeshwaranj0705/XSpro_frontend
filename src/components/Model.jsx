import React, { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { HiX } from "react-icons/hi";


const Model = ({ isOpen, onClose, title, onUpload }) => {
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return alert("Please upload an Excel file!");
    onUpload(file);
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center 
      backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 relative animate-fadeIn">

        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 font-bold text-xl"
          >
            <HiX className="text-lg" />
          </button>
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="mt-6 p-6 border-2 border-dashed border-gray-300 
          rounded-xl text-center cursor-pointer hover:border-blue-500
          transition-all duration-200 bg-gray-50"
        >
          <LuUpload className="mx-auto text-4xl text-gray-600 mb-3" />

          {file ? (
            <p className="text-green-600 font-medium break-all">{file.name}</p>
          ) : (
            <p className="text-gray-500">Drag & drop Excel file here</p>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <label className="w-[100%] text-center cursor-pointer bg-blue-50 px-5 py-2 rounded-lg 
          text-blue-700 border border-blue-200
          hover:bg-blue-100 transition-all duration-200">
            Choose File Upload
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-7">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 
            transition-all"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
            transition-all"
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;
