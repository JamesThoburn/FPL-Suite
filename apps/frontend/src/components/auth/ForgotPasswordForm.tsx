"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type Status = {
    message: string;
    type: "error" | "success";
}

export default function ForgotPasswordForm() {
    const [status, setStatus] = useState<Status | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get("error") === "recovery") {
            setStatus({
                message:
                    "That reset link couldn’t be used. Request a new one and try again.",
                type: "error",
            })
        }
    }, [])

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isSubmittingRef.current) {
            return
        }

        isSubmittingRef.current = true
        setIsSubmitting(true)
        setStatus(null)

        const formData = new FormData(event.currentTarget)
        const email = String(formData.get("email") ?? "").trim()

        try {
            const redirectTo = new URL(
                "/auth/recovery-callback",
                window.location.origin,
            ).toString()

            const { error } =
                await getSupabaseBrowserClient().auth.resetPasswordForEmail(
                    email,
                    { redirectTo },
                )

            if (error) {
                setStatus({
                    message:
                        "We couldn’t start password recovery right now. Please try again later.",
                    type: "error",
                })
                return
            }

            setStatus({
                message:
                    "If an account is associated with that email, you’ll receive a password reset link.",
                type: "success",
            })
        } catch {
            setStatus({
                message:
                    "We couldn’t start password recovery. Check your connection and try again.",
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
                Reset your password.
            </h1>

            <p className="text-[10px] leading-[1.8] text-text-auth-form-content-p">
                Enter your account email and we’ll send a link to choose a new
                password.
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
                    Email address
                    <input
                        className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                    />
                </label>

                <button
                    className="inline-flex w-full items-center justify-between gap-6.25 rounded-[5px] bg-action-primary px-4 py-3.75 text-[11px] font-semibold text-text-public-button hover:bg-action-public-hover disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending link…" : "Send reset link"}
                </button>
            </form>

            <p className="mt-5.75 text-center text-[9px] text-text-auth-form-content-auth-switch">
                Remembered it?{" "}
                <Link
                    className="font-[550] text-text-auth-switch-a"
                    href="/login"
                >
                    Back to log in
                </Link>
            </p>
        </div>
    )
}