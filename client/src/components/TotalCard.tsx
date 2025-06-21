import React from "react";
interface TotalCardProps {
  text: string;
  totalCount: number;
  icon: React.ReactElement;
  classes?: string;
  color?: string;
  totalCountStyle?: string;
  width?:string;
}
export function TotalCard({
  text,
  totalCount,
  icon,
  classes,
  color,
  totalCountStyle,
  width
}: TotalCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl p-6 dark:border-gray-700 border-gray-200 ${
        color
          ? color
          : "dark:bg-gray-800 dark:text-gray-400 text-gray-600 border shadow-sm"
      } ${width ? width : ""}`}
    >
      <div className={`${classes} p-2 h-10 rounded-lg`}>{icon}</div>
      <div>
        <h1 className="font-medium text-sm">{text}</h1>
        <h1
          className={`text-2xl font-bold ${
            totalCountStyle ? totalCountStyle : "dark:text-white text-gray-900"
          }`}
        >
          {totalCount}
        </h1>
      </div>
    </div>
  );
}
