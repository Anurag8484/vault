'use client'
interface ButtonProps{
    variant: 'dark' | 'light' | 'danger';
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
        className={` text-md font-semibold px-9 py-2 outline-1 rounded-md  cursor-pointer 
              ${
            variant === "dark"
              ? "bg-black text-white hover:bg-neutral-800":""
          }
              ${
            variant === "light"
              ? "bg-light text-black hover:bg-neutral-300":""
          }
              ${
            variant === "danger"
              ? "bg-red-600 text-white hover:bg-red-800" : ""
          }
          `}
            
            onClick={onClick}
      >
        {label}
      </button>
    );
}
