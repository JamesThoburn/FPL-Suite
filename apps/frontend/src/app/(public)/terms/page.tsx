import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Terms of Service — FPL Suite",
    robots: { index: false, follow: false },
}

export default function TermsPage() {
    return (
        <main className="mx-auto min-h-dvh max-w-3xl bg-surface-public-page px-6 py-12 text-text-public-primary sm:px-10">
            <p className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
                DEVELOPMENT DRAFT — NOT FINAL TERMS. This placeholder is for
                testing only and is not ready for public use.
            </p>

            <h1 className="font-(family-name:--font-manrope) text-4xl font-semibold tracking-tight">
                Terms of Service
            </h1>

            <p className="mt-6 leading-7">
                This page is a temporary placeholder while FPL Suite’s Terms
                of Service are being prepared. It does not define the terms
                that will govern use of the service.
            </p>

            <p className="mt-4 leading-7">
                Do not rely on this draft as a legal agreement. It must be
                replaced with complete, accurate terms before public signup is
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