import { cn } from "@/lib/utils";
type Props = { name: string; src?: string; className?: string };
export function Avatar({ name, src, className }: Props) { return <div className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700", className)}>{src ? <img src={src} alt={name} className="size-full object-cover" /> : name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</div>; }
