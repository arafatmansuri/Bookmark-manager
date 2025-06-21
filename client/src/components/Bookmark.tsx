import { Clock, Copy, ExternalLink, Heart, Pencil, Trash2 } from "lucide-react";

interface BookmarkProps {
  title: string;
  url: string;
  date: Date;
  category?: { name: string; color: string }[];
}
const monthName = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};
export function BookmarkCard({ category, date, title, url }: BookmarkProps) {
  return (
    <div className="flex flex-col gap-7 justify-end dark:bg-gray-800 rounded-md px-6 py-6 hover:-translate-y-1 transition-transform duration-300 delay-50 dark:border-gray-700 border border-gray-300">
      <div>
        {category && (
          <div className="flex gap-2 mb-4">
            {category.map((cat, index) => (
              <span
                key={index}
                className={`px-4 py-1 rounded-md text-xs font-medium`}
                style={{ backgroundColor: `${cat.color}` }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
        <h4 className="text-sm dark:text-gray-400 text-gray-500">{url}</h4>
      </div>
      <span className="text-xs dark:text-gray-500 text-gray-400 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Created{" "}
        {monthName[date.getMonth().toString()]} {date.getDate()},{" "}
        {date.getFullYear()}, {date.getHours()}:{date.getMinutes()}{" "}
        {date.getHours() > 12 ? "PM" : "AM"}
      </span>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 in-hover:cursor-pointer">
          <Heart className="h-4 w-4 text-gray-500" />{" "}
          <Copy className="h-4 w-4 text-gray-500" />{" "}
          <ExternalLink className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex gap-4 in-hover:cursor-pointer">
          <Pencil className="h-4 w-4 text-gray-500" />{" "}
          <Trash2 className="h-4 w-4 text-gray-500" />{" "}
        </div>
      </div>
    </div>
  );
}
