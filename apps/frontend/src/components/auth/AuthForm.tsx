"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Icon from "@/components/ui/Icon"
import GoogleMark from "./GoogleMark"
import { SubmitEvent, useEffect, useRef, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { AUTH_PERSISTENCE_COOKIE } from "@/lib/supabase/cookie-policy"
import { stringifySetCookie } from "cookie"

export type AuthMode = "login" | "signup"

export default function AuthForm({ mode }: { mode: AuthMode }) {
    const signup = mode === "signup"
    const supabase = getSupabaseBrowserClient();
    const router = useRouter();
    const [status, setStatus] = useState<{ message: string; type: "error" | "success" } | null>(null);
    const isSubmittingRef = useRef(false);
    const [submittingAction, setSubmittingAction] = useState<"email" | "google" | null>(null);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get("error") === "google") {
            setStatus({
                message: "Google sign-in couldn’t be completed. Try again or use email and password.",
                type: "error",
            })
        }
    }, [])

    async function handleGoogleSignIn() {

        if (isSubmittingRef.current) {
            return;
        }

        isSubmittingRef.current = true;
        setSubmittingAction("google");
        setStatus(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                setStatus({
                    message: "We couldn't start Google sign-in. Please try again.",
                    type: "error",
                })
            }
        } catch {
            setStatus({
                message: "We couldn't start Google sign-in. Check your connection and try again.",
                type: "error",
            })
        } finally {
            isSubmittingRef.current = false;
            setSubmittingAction(null);
        }
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmittingRef.current) {
            return;
        }

        isSubmittingRef.current = true;
        setSubmittingAction("email");
        setStatus(null);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const name = String(formData.get("name") ?? "").trim();

        try {
            if (signup) {
                // Check that the name isn't full of spaces (note that .trim() would turn "    " to "")
                if (!name) {
                    setStatus({ message: "Enter your name to continue.", type: "error" });
                    return;
                }

                if (name.length > 80) {
                    setStatus({ message: "Your name must be 80 characters or fewer.", type: "error" });
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/welcome`,
                        data: {
                            full_name: name,
                        },
                    },
                });

                if (error) {
                    setStatus({ message: error.message, type: "error" });
                    return;
                }

                setStatus({
                    message: "If there is no existing account with this email, you’ll receive a confirmation link. If you already have an account, try logging in.",
                    type: "success",
                });
                return;
            }

            const rememberMe = formData.get("remember") === "on";

            document.cookie = stringifySetCookie({
                name: AUTH_PERSISTENCE_COOKIE,
                value: rememberMe ? "persistent" : "session",
                path: "/",
                sameSite: "lax",
                secure: window.location.protocol === "https:",
                ...(rememberMe ? { maxAge: 400 * 24 * 60 * 60 } : {}),
            });

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setStatus({ message: error.message, type: "error" });
                return;
            }

            setStatus({
                message: "Signed in successfully, redirecting to dashboard.",
                type: "success",
            });
            window.setTimeout(() => router.replace("/dashboard"), 1000);
        } catch {
            setStatus({
                message: "We couldn’t complete your request. Check your connection and try again.",
                type: "error",
            });
        } finally {
            isSubmittingRef.current = false;
            setSubmittingAction(null);
        }
    }

    return (
        <div className="mx-auto my-auto w-full max-w-91.25 px-6 pt-7 pb-8.75 min-[601px]:max-w-72.5 min-[601px]:px-0 min-[601px]:pt-7.5 min-[601px]:pb-8.75 min-[851px]:max-w-[320px] min-[1101px]:max-w-92 min-[1101px]:px-0 min-[1101px]:pt-8.5 min-[1101px]:pb-10.5 min-[1500px]:max-w-98.75">
            <div className="flex items-center gap-2 text-[6px] font-semibold tracking-[1.3px] text-text-public-eyebrow min-[601px]:text-[6px] min-[851px]:tracking-[1.2px] min-[1101px]:text-[7px] min-[1101px]:tracking-[1.5px]">
                {signup ? "YOUR NEXT GREEN ARROW STARTS HERE" : "BACK IN YOUR CORNER"}
            </div>
            <h1 className="my-3.75 whitespace-pre-line text-[36px] leading-[1.18] font-semibold tracking-[-1.3px] text-text-auth-form-content-h1 min-[601px]:text-[31px] min-[851px]:text-[34px] min-[1101px]:text-[37px] min-[1500px]:text-[43px]">
                {signup ? "A smarter game\nstarts with you." : "Welcome back,\nmanager."}
            </h1>
            <p className="text-[10px] leading-[1.8] text-text-auth-form-content-p min-[1101px]:text-[11px] min-[1500px]:text-xs">
                {signup
                    ? "Make yourself at home. Your edge is waiting."
                    : "New gameweek. New possibilities. Let’s get into it."}
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
            <button
                className="mt-6.25 flex w-full items-center justify-center gap-2.75 rounded-[5px] border border-border-google-button bg-surface-card p-3.5 text-[11px] text-text-google-button hover:bg-surface-google-button-hover min-[1101px]:mt-6.75 min-[1101px]:p-3.25 min-[1500px]:p-4 min-[1500px]:text-xs"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submittingAction !== null}
            >
                <GoogleMark />
                {submittingAction === "google"
                    ? "Connecting to Google…"
                    : signup
                        ? "Sign up with Google"
                        : "Continue with Google"}
            </button>
            <div className="my-5.75 flex items-center gap-3.25 text-[8px] text-text-auth-divider min-[1101px]:my-5.5">
                <span className="h-px flex-1 bg-border-landing-feature-card" />
                {signup ? "or sign up with email" : "or log in with email"}
                <span className="h-px flex-1 bg-border-landing-feature-card" />
            </div>
            <form onSubmit={handleSubmit}>
                {signup && (
                    <label className="mb-5 block text-[10px] font-medium text-text-auth-label min-[1101px]:mb-4.5">
                        Your name
                        <input
                            className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input shadow-[0_1px_1px_var(--color-shadow-auth-label-input)] placeholder:text-text-auth-label-input-placeholder min-[1101px]:p-[13px_14px] min-[1500px]:p-4"
                            type="text"
                            name="name"
                            placeholder="Jamie Davies"
                            autoComplete="name"
                            required
                            maxLength={80}
                        />
                    </label>
                )}
                <label className="mb-5 block text-[10px] font-medium text-text-auth-label min-[1101px]:mb-4.5">
                    Email address
                    <input className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input shadow-[0_1px_1px_var(--color-shadow-auth-label-input)] placeholder:text-text-auth-label-input-placeholder min-[1101px]:p-[13px_14px] min-[1500px]:p-4" type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                </label>
                <label className="mb-5 block text-[10px] font-medium text-text-auth-label min-[1101px]:mb-4.5">
                    <span className="flex items-center justify-between">
                        Password
                        {!signup && (
                            <Link
                                href="/forgot-password"
                                className="bg-transparent p-0 text-[8px] font-normal text-text-forgot-password hover:text-text-forgot-password-hover"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </span>
                    <input
                        className="mt-2 block w-full rounded-[5px] border border-border-auth-label-input bg-surface-card p-3.5 text-[11px] text-text-auth-label-input shadow-[0_1px_1px_var(--color-shadow-auth-label-input)] placeholder:text-text-auth-label-input-placeholder min-[1101px]:p-[13px_14px] min-[1500px]:p-4"
                        type="password"
                        name="password"
                        placeholder={signup ? "Create a password" : "Enter your password"}
                        required
                        minLength={signup ? 8 : undefined}
                        autoComplete={signup ? "new-password" : "current-password"}
                    />
                </label>
                {signup ? (
                    <p className="-mt-2.5 mb-4.75 text-[7px] leading-[1.7] text-text-password-hint min-[1101px]:text-[8px]">
                        A little security goes a long way. Use at least 8 characters.
                    </p>
                ) : (
                    <label className="my-px mb-4.75 flex items-center gap-2 text-[9px] text-text-remember-me">
                        <input className="m-0 size-3 shrink-0 accent-text-remember-me-input" type="checkbox" name="remember" />
                        Keep me logged in
                    </label>
                )}
                <button
                    className="mt-1.5 inline-flex w-full items-center justify-between gap-6.25 rounded-[5px] bg-action-primary px-4 py-3.75 text-[11px] font-semibold text-text-public-button hover:bg-action-public-hover disabled:cursor-not-allowed disabled:opacity-60 min-[1101px]:px-4.25 min-[1101px]:py-3.5 min-[1500px]:p-4.25"
                    type="submit"
                    disabled={submittingAction !== null}
                >
                    {submittingAction === "email"
                        ? signup
                            ? "Creating your account…"
                            : "Logging in…"
                        : signup
                            ? "Create my account"
                            : "Log in"}
                    <Icon name="arrow" size={19} strokeWidth={1.6} />
                </button>
            </form>
            <p className="mt-4 text-center text-[8px] leading-[1.7] text-text-auth-terms min-[1101px]:text-[9px]">
                By creating an account or continuing with Google, you agree to
                the{" "}
                <Link
                    className="underline decoration-text-auth-terms-button underline-offset-[3px]"
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Terms of Service
                </Link>{" "}
                and acknowledge the{" "}
                <Link
                    className="underline decoration-text-auth-terms-button underline-offset-[3px]"
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Privacy Policy
                </Link>
                .
            </p>
            <p className="mt-5.75 text-center text-[9px] text-text-auth-form-content-auth-switch min-[1101px]:text-[10px]">
                {signup ? "Already part of the Suite?" : "New to FPL Suite?"}{" "}
                <Link className="ml-1 font-[550] text-text-auth-switch-a" href={signup ? "/login" : "/signup"}>
                    {signup ? "Log in" : "Create an account"} <span>↗</span>
                </Link>
            </p>
        </div>
    )
}
