import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaChevronDown } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value); 
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-3 pr-2">
      {label && <label className="text-xs font-medium text-slate-700">{label}</label>}

      {type === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={handleChange}
            className={`
              w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-black transition-all appearance-none
              ${value === "" ? "text-gray-400" : "text-slate-700"}
            `}
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options && options.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <FaChevronDown size={16} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border border-gray-400 rounded-lg px-3 py-2 bg-white focus-within:border-black transition-all">
          <input
            type={type === "password" ? (showPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
            value={value}
            onChange={handleChange}
          />
          {type === "password" && (
            <button
              type="button"
              className="text-slate-700 cursor-pointer flex items-center"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
