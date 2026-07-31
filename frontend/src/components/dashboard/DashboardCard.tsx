import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";

export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: .22 }}><Card className={className}><CardContent>{children}</CardContent></Card></motion.div>;
}
