import DashboardShell from "@/components/dashboard/DashboardShell";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Dashboard | FPL Suite"
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>
        {children}
    </DashboardShell>
  )
}
