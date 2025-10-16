'use client'
interface ButtonProps{
    variant: 'dark' | 'light';
    onClick: ()=>void;
    label: string;
}

export default function Button({
  onClick,
  label,
  variant
}: ButtonProps) {

    return (
      <button
        className={` text-md font-semibold px-9 py-2 outline-1 rounded-md  cursor-pointer   ${
          variant === "dark"
            ? "bg-black text-white hover:bg-neutral-800"
            : "bg-white text-black hover:bg-neutral-200"
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    );
}
