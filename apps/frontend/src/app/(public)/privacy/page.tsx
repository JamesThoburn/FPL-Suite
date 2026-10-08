import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Privacy Notice — FPL Suite",
    robots: { index: false, follow: false },
}

export default function PrivacyPage() {
    return (
        <main className="mx-auto min-h-dvh max-w-3xl bg-surface-public-page px-6 py-12 text-text-public-primary sm:px-10">
            <p className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
                DEVELOPMENT DRAFT — NOT A FINAL PRIVACY NOTICE. This
                placeholder is for testing only and is not ready for public use.
            </p>

            <h1 className="font-(family-name:--font-manrope) text-4xl font-semibold tracking-tight">
                Privacy Notice
            </h1>

            <p className="mt-6 leading-7">
                This page is a temporary placeholder while FPL Suite’s privacy
                notice is being prepared. It does not explain the final
                information collected, how it is used, or how it is shared.
            </p>

            <p className="mt-4 leading-7">
                Do not rely on this draft as a privacy disclosure. It must be
                replaced with accurate information before public signup is
                enabled.
            </p>

            <Link
                className="mt-8 inline-flex text-sm font-semibold text-text-secondary-link underline"
                href="/signup"
            >
                Return to sign up
            </Link>
        </main>
    )
}