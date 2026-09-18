import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, children, ...props }, ref) => {
  const displayText = text !== "Button" ? text : (typeof children === "string" ? children : text);

  return (
    <button
      ref={ref}
      className={cn(
        "group relative h-[36px] min-w-[95px] px-3.5 py-1.5 cursor-pointer overflow-hidden rounded-xl border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/25 bg-white text-center text-xs font-bold text-[#7A3E48] shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#7A3E48] hover:bg-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-1.5 translate-x-0 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0 text-xs font-bold text-[#7A3E48]">
        {displayText}
      </span>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-8 items-center justify-center gap-1.5 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-xs font-bold">
        <span>{displayText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
      <div className="absolute left-[12%] top-[40%] h-2 w-2 scale-[1] rounded-md bg-[#7A3E48] transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2] group-hover:bg-[#7A3E48]"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
