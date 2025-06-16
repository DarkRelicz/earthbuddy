import React, { ReactElement } from 'react'

interface ButtonProps {
  onClickCallback?: () => void;
  title: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  addClassName?: string;
  colour?: string;
}

function Button({ onClickCallback, title, type, disabled, addClassName, colour="bg-[#4F7BFF]" }: ButtonProps) {
  return (
    <button
      onClick={onClickCallback}
      type={type}
      disabled={disabled}
      className={`w-full py-3 mb-4 ${colour} text-white font-semibold rounded-lg hover:bg-[#3c64d8] transition-colors shadow-sm ${ addClassName }`}>
      {title}
    </button>
  )
}

export default Button