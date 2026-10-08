import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import Brand from "@/components/ui/Brand"
import AuthVisual from "@/components/auth/AuthVisual"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"

export const metadata: Metadata = {
    title: "Choose a new password | FPL Suite",
}

export default async function ResetPasswordPage() {
    const cookieStore = await cookies()
    const recoveryWasVerified =
        cookieStore.get("fpl-suite-password-recovery")?.value === "1"

    const supabase = await createSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const canResetPassword = Boolean(user) && recoveryWasVerified

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

                {canResetPassword ? (
                    <ResetPasswordForm />
                ) : (
                    <main className="mx-auto my-auto w-full max-w-91.25 px-6 py-10 text-center min-[601px]:max-w-72.5 min-[601px]:px-0 min-[1101px]:max-w-92">
                        <h1 className="text-[30px] font-semibold text-text-auth-form-content-h1">
                            That reset link may have expired.
                        </h1>
                        <p className="mt-4 text-[11px] leading-6 text-text-auth-form-content-p">
                            Request a new password reset link and use the
                            latest email we send you.
                        </p>
                        <Link
                            className="mt-6 inline-flex rounded-[5px] bg-action-primary px-5 py-3 text-[11px] font-semibold text-text-public-button"
                            href="/forgot-password"
                        >
                            Request a new link
                        </Link>
                    </main>
                )}
            </section>

            <AuthVisual />
        </div>
    )
}