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
  secondary: ``,
};
const sizeClassess: { sm: string; md: string; lg: string } = {
  sm: ``,
  md: ``,
  lg: `w-full py-3 px-4`,
};
const commonClasses: string = `rounded-xl shadow-lg hover:shadow-xl cursor-pointer`;
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
