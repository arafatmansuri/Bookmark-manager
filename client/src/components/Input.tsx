import React, { type HTMLInputTypeAttribute } from "react";
interface InputPorps {
  isLabel: boolean;
  labelText?: string;
  type: HTMLInputTypeAttribute;
  startIcon: React.ReactElement;
  placeholder?: string;
}
export function Input({
  isLabel,
  labelText,
  type,
  placeholder,
  startIcon,
}: InputPorps) {
  return (
    <div className="w-full">
      {isLabel && (
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {labelText}
        </label>
      )}
      <div className="relative">
        {startIcon}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full border pl-10 pr-4 py-3 border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
        />
      </div>
    </div>
  );
}
