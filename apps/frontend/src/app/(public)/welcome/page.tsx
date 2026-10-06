import type { Metadata } from "next"
import Link from "next/link"
import PublicFooter from "@/components/layout/PublicFooter"
import Brand from "@/components/ui/Brand"
import Icon from "@/components/ui/Icon"

export const metadata: Metadata = {
  title: "Welcome to FPL Suite",
  description: "Your next green arrow starts here.",
}

export default function WelcomePage() {
  return (
    <div className="min-h-dvh bg-surface-public-page">
      <header className="mx-auto flex max-w-360 items-center justify-between gap-2.5 border-b border-border-public-header px-4.25 py-5.5 min-[366px]:gap-3.75 min-[366px]:px-5.5 min-[601px]:gap-5 min-[601px]:px-8.75 min-[601px]:py-6.25 min-[1101px]:gap-7.5 min-[1101px]:px-16 min-[1101px]:py-7.25">
        <Brand />
        <Link
          className="inline-flex items-center gap-2 whitespace-nowrap text-[9px] text-text-secondary-link hover:text-text-secondary-link-hover min-[601px]:text-[10px] min-[851px]:text-xs"
          href="/"
        >
          Back home <span>↗</span>
        </Link>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-178px)] max-w-360 items-center justify-center overflow-hidden px-6 py-16 sm:px-9 sm:py-20 lg:px-16">
        <section className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 inline-flex size-12 items-center justify-center rounded-full bg-surface-public-button-pale text-action-primary">
            <Icon name="check" size={24} strokeWidth={2} />
          </div>
          <div className="flex items-center justify-center gap-2 text-[8px] font-semibold tracking-[0.16em] text-text-public-eyebrow sm:text-[10px]">
            YOU’RE ON THE TEAM
          </div>
          <h1 className="mt-5 font-(family-name:--font-manrope) text-[clamp(42px,7vw,76px)] leading-[1.05] font-semibold tracking-[-0.055em] text-text-landing-hero-copy-h1">
            Welcome to{" "}
            <span className="text-text-landing-hero-copy-h1-span whitespace-nowrap">FPL Suite</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-text-landing-hero-copy-p sm:text-base">
            If you’ve just confirmed your email, you’re all set. Sign in and
            get ready for a smarter season—your next green arrow starts here.
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-between gap-8.75 rounded-[5px] bg-action-primary px-5.5 py-4 text-[12px] font-semibold whitespace-nowrap text-text-public-button hover:bg-action-primary-hover"
            href="/login"
          >
            Continue to log in <Icon name="arrow" size={19} />
          </Link>
          <p className="mt-7 text-[11px] text-text-secondary-link sm:text-xs">
            Not ready to sign in?{" "}
            <Link className="font-semibold hover:text-text-secondary-link-hover underline" href="/">
              Take a look around
            </Link>
          </p>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
