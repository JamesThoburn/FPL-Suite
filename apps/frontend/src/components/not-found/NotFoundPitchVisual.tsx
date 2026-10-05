

export default function NotFoundPitchVisual() {
    return (
        <section
            className="relative min-h-107.5 overflow-hidden rounded-xl bg-surface-callout p-6 text-white shadow-[0_24px_80px_var(--color-shadow-tool-card-hover)] sm:min-h-130 sm:p-10"
            aria-label="Page not found illustration"
        >
            <div className="absolute inset-6 rounded-lg border border-white/20 sm:inset-10">
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 sm:h-36 sm:w-36" />
                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
                <div className="absolute -left-px top-1/2 h-36 w-16 -translate-y-1/2 border border-l-0 border-white/20 sm:h-44 sm:w-24" />
                <div className="absolute -right-px top-1/2 h-36 w-16 -translate-y-1/2 border border-r-0 border-white/20 sm:h-44 sm:w-24" />
            </div>

            <div className="relative z-10 flex items-center justify-between text-[8px] font-semibold tracking-[0.18em] text-white/65">
                <span>FPL SUITE / LOST BALL</span>
                <span>90:00</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Manrope',sans-serif] text-[clamp(116px,20vw,270px)] font-semibold leading-none tracking-[-0.08em] text-white/8">
                    404
                </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 rounded-lg border border-white/15 bg-surface-floating-performance p-5 shadow-[0_18px_45px_var(--color-shadow-floating-performance)] backdrop-blur sm:bottom-10 sm:left-10 sm:right-10 sm:p-6">
                <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-performance-icon text-text-performance-icon">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M4 12h16M12 4v16" />
                            <circle cx="12" cy="12" r="9" />
                        </svg>
                    </span>
                    <div>
                        <span className="block text-[7px] font-semibold tracking-[0.15em] text-text-floating-performance-div-span">
                            VAR CHECK COMPLETE
                        </span>
                        <strong className="mt-1 block text-sm font-semibold text-text-floating-performance-strong">
                            No page found. Decision final.
                        </strong>
                    </div>
                    <span className="ml-auto hidden rounded-full bg-surface-form-tag px-3 py-2 text-[7px] font-bold tracking-[0.12em] text-text-form-tag sm:block">
                        NO GOAL
                    </span>
                </div>
            </div>
        </section>
    )
}
