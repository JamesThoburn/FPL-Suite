import Sidebar from "@/components/dashboard/Sidebar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Dashboard | FPL Suite"
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-58 w-[calc(100%-232px)] max-[1200px]:ml-51.75 max-[1200px]:w-[calc(100%-207px)] max-[1000px]:ml-46.25 max-[1000px]:w-[calc(100%-185px)] max-[700px]:ml-0 max-[700px]:w-full">
                <main className="mx-auto max-w-360 px-10 pt-8.5 max-[1200px]:px-7 max-[1000px]:px-5.5 max-[700px]:px-4.75 max-[700px]:pt-6.25 min-[1450px]:pt-10.75">
                    {children}
                </main>
            </div>
        </div>
    </>
  )
}
