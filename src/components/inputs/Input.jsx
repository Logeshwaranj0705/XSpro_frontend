import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaChevronDown } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-xs font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}

      {type === "select" ? (
        <div className="relative w-full">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              w-full box-border px-3 py-2 text-sm bg-white
              border border-gray-400 rounded-lg
              outline-none appearance-none
              focus:border-black transition
              ${value === "" ? "text-gray-400" : "text-slate-700"}
            `}
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <FaChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      ) : (
        <div
          className="
            w-full flex items-center
            border border-gray-400 rounded-lg
            px-3 py-2 bg-white
            focus-within:border-black transition
            box-border
          "
        >
          <input
            type={
              type === "password"
                ? showPassword
                  ? "text"
                  : "password"
                : type
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="
              w-full bg-transparent outline-none
              text-sm text-slate-700
              placeholder-gray-400
            "
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="ml-2 text-slate-600 flex-shrink-0"
            >
              {showPassword ? (
                <FaRegEyeSlash size={18} />
              ) : (
                <FaRegEye size={18} />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
