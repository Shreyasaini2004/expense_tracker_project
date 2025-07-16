import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type, id, name }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-[13px] text-slate-800 mb-1">
        {label}
      </label>
      <div className="input-box flex items-center border border-slate-300 rounded px-2">
        <input
          id={inputId}
          name={name || inputId}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none py-2"
          value={value}
          onChange={onChange}
          autoComplete="on"
        />
        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={20}
              className="text-violet-500 cursor-pointer"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={20}
              className="text-slate-400 cursor-pointer"
              onClick={toggleShowPassword}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
