import Link from "next/link";
import Icon from "../ui/Icon";

export default function NotFoundMessage() {
    return (
        <section className="max-w-xl">
            <p
                className="mt-5 font-['Manrope',sans-serif] text-[clamp(88px,14vw,180px)] font-semibold leading-[0.82] tracking-[-0.07em] text-text-landing-hero-copy-h1"
                aria-hidden="true"
            >
                404
            </p>
            <h1 className="mt-9 max-w-lg font-['Manrope',sans-serif] text-[clamp(36px,5vw,64px)] font-semibold leading-[1.08] tracking-[-0.045em] text-text-landing-hero-copy-h1">
                This page has drifted{" "}
                <span className="text-text-landing-hero-copy-h1-span">
                    out of play.
                </span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-text-landing-hero-copy-p">
                The link may be old, the page may have moved, or the final pass
                simply went astray. Let&apos;s get you back to a better position.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link className="inline-flex items-center justify-between gap-8.75 text-text-public-button bg-action-primary rounded-[5px] py-4 px-5.5 text-[12px] font-semibold whitespace-nowrap hover:bg-action-primary-hover" href="/">
                    Return to home <Icon name="arrow" />
                </Link>
                <Link className="inline-flex items-center gap-3.25 text-[11px] text-text-secondary-link hover:text-text-secondary-link-hover" href="/dashboard">
                    Open dashboard <span>↗</span>
                </Link>
            </div>
            <div className="mt-10 flex items-center gap-3 text-[9px] font-semibold tracking-[0.13em] text-text-hero-reassurance">
                <Icon name="check" />
                YOUR TEAM IS STILL EXACTLY WHERE YOU LEFT IT
            </div>
        </section>
    )
}
