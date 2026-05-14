import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white shadow-[0_16px_32px_rgba(61,137,255,0.28)] hover:-translate-y-0.5 hover:bg-[#2f7df5]",
        secondary:
          "glass-panel text-foreground hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-strong",
        ghost:
          "bg-transparent text-muted hover:bg-surface-soft hover:text-foreground",
        danger: "bg-danger text-white hover:bg-[#ff5576]",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  size,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
