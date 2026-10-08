"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import type { SubmitEvent } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

type Status = {
    message: string
    type: "error" | "success"
}

export default function ResetPasswordForm() {
    const [status, setStatus] = useState<Status | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isSubmittingRef = useRef(false)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isSubmittingRef.current) {
            return
        }

        isSubmittingRef.current = true
        setIsSubmitting(true)
        setStatus(null)

        const formData = new FormData(event.currentTarget)
        const password = String(formData.get("password") ?? "")
        const confirmPassword = String(
            formData.get("confirmPassword") ?? "",
        )

        if (password !== confirmPassword) {
            setStatus({
                message: "Those passwords don’t match.",
                type: "error",
            })
            isSubmittingRef.current = false
            setIsSubmitting(false)
            return
        }

        try {
            const { error } =
                await getSupabaseBrowserClient().auth.updateUser({
                    password,
                })

            if (error) {
                setStatus({
                    message:
                        "We couldn’t update your password. The reset link may have expired; request a new one and try again.",
                    type: "error",
                })
                return
            }

            setStatus({
                message:
                    "Your password has been updated. You can continue to your dashboard.",
                type: "success",
            })
        } catch {
            setStatus({
                message:
                    "We couldn’t update your password. Check your connection and try again.",
                type: "error",
            })
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto my-auto w-full max-w-91.25 px-6 pt-7 pb-8.75 min-[601px]:max-w-72.5 min-[601px]:px-0 min-[851px]:max-w-[320px] min-[1101px]:max-w-92 min-[1500px]:max-w-98.75">
            <div className="text-[7px] font-semibold tracking-[1.5px] text-text-public-eyebrow">
                ACCOUNT RECOVERY
            </div>

            <h1 className="my-3.75 text-[36px] leading-[1.18] font-semibold tracking-[-1.3px] text-text-auth-form-content-h1">
                Choose a new password.
            </h1>

            <p className="text-[10px] leading-[1.8] text-text-auth-form-content-p">
                Make it at least 8 characters long.
            </p>

            {status && (
                <p
                    className={`mt-4 rounded-[5px] border px-3.5 py-3 text-[9px] leading-[1.6] ${status.type === "error"
                            ? "border-red-200 bg-red-50 text-red-800"
                            : "border-green-200 bg-green-50 text-green-800"
                        }`}
                    role={status.type === "error" ? "alert" : "status"}
                    aria-live={status.type === "error" ? "assertive" : "polite"}
                >
                    {status.message}
                </p>
            )}

            <form className="mt-6" onSubmit={handleSubmit}>
                <label className="mb-5 block text-[10px] font-medium text-text-auth-label">
                    New password
                    <input
                        className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </label>

                <label className="mb-5 block text-[10px] font-medium text-text-auth-label">
                    Confirm new password
                    <input
                        className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input"
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </label>

                <button
                    className="inline-flex w-full items-center justify-between gap-6.25 rounded-[5px] bg-action-primary px-4 py-3.75 text-[11px] font-semibold text-text-public-button hover:bg-action-public-hover disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Updating password…" : "Update password"}
                </button>
            </form>

            {status?.type === "success" && (
                <Link
                    className="mt-5 inline-flex text-[10px] font-semibold text-text-auth-switch-a"
                    href="/dashboard"
                >
                    Continue to dashboard
                </Link>
            )}
        </div>
    )
}