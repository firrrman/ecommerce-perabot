"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  defaultText: string;
  loadingText?: string;
}

export default function SubmitButton({
  defaultText,
  loadingText = "Memproses...",
  className = "",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      className={`relative flex items-center justify-center gap-2 ${className} ${pending ? "opacity-80 cursor-not-allowed" : ""
        }`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{pending ? loadingText : defaultText}</span>
    </button>
  );
}
