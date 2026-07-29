import { Search } from "lucide-react";
import { Input } from "./Input";
export function SearchBar({ placeholder = "Pesquisar...", className = "" }: { placeholder?: string; className?: string }) { return <div className={`relative w-full ${className}`}><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-10" placeholder={placeholder} /></div>; }
