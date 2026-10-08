import type { Metadata } from "next"
import Link from "next/link"
import Brand from "@/components/ui/Brand"
import AuthVisual from "@/components/auth/AuthVisual"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"

export const metadata: Metadata = {
    title: "Reset your password | FPL Suite",
}

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-dvh flex-col bg-surface-auth-page min-[601px]:grid min-[601px]:min-h-screen min-[601px]:grid-cols-2 max-[1100px]:min-[601px]:grid-cols-[1.1fr_1fr]">
            <section className="flex min-h-dvh min-w-0 flex-col min-[601px]:min-h-0">
                <header className="flex items-center justify-between gap-3.75 px-6 py-6.25 min-[601px]:px-5.5 min-[1101px]:px-10.75">
                    <Brand />
                    <Link
                        className="text-[9px] text-text-auth-header-a-last-child"
                        href="/"
                    >
                        Back to home <span className="ml-2">↗</span>
                    </Link>
                </header>

                <ForgotPasswordForm />

                <footer className="flex justify-between gap-3.75 px-6 py-5.5 text-[6px] text-text-auth-footer min-[601px]:px-5.5 min-[1101px]:px-7.5">
                    <span>Built for the love of the game.</span>
                    <span>© {new Date().getFullYear()} FPL Suite</span>
                </footer>
            </section>

            <AuthVisual />
        </div>
    )
}