interface ButtonProps {
  text: string;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  onClick?: () => void;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
}
const variantClasses: { primary: string; secondary: string } = {
  primary: `bg-blue-600 hover:bg-blue-700 font-semibold`,
  secondary: `dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-gray-700`,
};
const sizeClassess: { sm: string; md: string; lg: string } = {
  sm: ``,
  md: `font-medium px-5 py-2`,
  lg: `w-full py-3 px-4`,
};
const commonClasses: string = `rounded-xl shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 `;
export function Button({ text, variant, size, onClick,startIcon }: ButtonProps) {
  return (
    <button
      className={`${commonClasses} ${variantClasses[variant]} ${sizeClassess[size]}`}
      onClick={onClick}
    >
      {startIcon}{text}
    </button>
  );
}
