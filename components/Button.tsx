import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  size = "medium",
  fullWidth = false,
  disabled = false,
}: Props) {
  const buttonStyle = `bg-white hover:bg-white/80 text-theme-500 whitespace-nowrap ${
    sizeClasses[size]
  } ${fullWidth ? "w-full" : ""}
   ${
     disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
   } rounded-sm transition-all duration-200 ease-in-out`;

  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={buttonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={buttonStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const sizeClasses = {
  small: "text-xs py-2.5 px-4",
  medium: "text-sm  py-3 px-5",
  large: "text-lg py-3 px-6",
};
