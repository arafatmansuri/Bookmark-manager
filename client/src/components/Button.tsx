interface ButtonProps {
  text: string;
  variant: "primary" | "secondary" | "favorite" | "filtered";
  size: "sm" | "md" | "lg";
  onClick?: () => void;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  color?: string;
  classes?: string;
  type: "submit" | "reset" | "button" | undefined;
}
const variantClasses: {
  primary: string;
  secondary: string;
  favorite: string;
  filtered: string;
} = {
  primary: `bg-blue-600 hover:bg-blue-700 font-semibold`,
  secondary: `dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-gray-700 bg-gray-300 hover:bg-gray-200 border border-transparent font-medium`,
  favorite: `dark:bg-red-900 border border-red-700 text-red-400 font-medium`,
  filtered: `bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600`,
};
const sizeClassess: { sm: string; md: string; lg: string } = {
  sm: `px-5 py-2 rounded-full text-sm font-medium border-2`,
  md: `px-5 py-2 rounded-xl`,
  lg: `py-3 px-4 rounded-xl`,
};
const commonClasses: string = `shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 `;
export function Button({
  text,
  variant,
  size,
  onClick,
  startIcon,
  color,
  endIcon,
  classes,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${commonClasses} ${variantClasses[variant]} ${sizeClassess[size]} ${classes}`}
      onClick={onClick}
    >
      {color && (
        <div
          className={`w-3 h-3 rounded-full`}
          style={{ backgroundColor: color }}
        ></div>
      )}{" "}
      {startIcon}
      {text}
      {endIcon}
    </button>
  );
}
