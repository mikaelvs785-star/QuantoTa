import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700", secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-100", outline: "border bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800", ghost: "hover:bg-slate-100 dark:hover:bg-slate-800", danger: "bg-red-600 text-white hover:bg-red-700" }, size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-5 text-base", icon: "size-10" } }, defaultVariants: { variant: "primary", size: "md" } });
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant, size, asChild, ...props }, ref) => { const Component = asChild ? Slot : "button"; return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />; });
Button.displayName = "Button";
