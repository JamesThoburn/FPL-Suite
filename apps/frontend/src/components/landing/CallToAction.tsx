import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function CallToAction() {
  return (
    <section className="relative mb-8 flex flex-col items-start gap-6.5 overflow-hidden rounded-lg bg-surface-callout px-6 py-7.5 text-text-landing-cta min-[601px]:flex-row min-[601px]:items-center min-[601px]:justify-between min-[601px]:gap-6.25 min-[601px]:px-7.5 min-[601px]:py-8.25 min-[851px]:gap-8.75 min-[851px]:px-11.25 min-[851px]:py-9.75 min-[1500px]:mb-14">
      <div className="relative z-1">
        <div className="flex items-center gap-2 text-[5px] font-semibold tracking-[1px] text-text-landing-cta-public-eyebrow min-[601px]:text-[5px] min-[601px]:tracking-[1.4px] min-[1500px]:text-[7px]">THE NEXT GAMEWEEK IS A NEW OPPORTUNITY.</div>
        <h2 className="my-2.5 font-(family-name:--font-manrope) text-[32px] font-medium tracking-[-1px] min-[601px]:text-[30px] min-[1101px]:text-[30px] min-[1500px]:text-[35px]">Your game. Your edge.</h2>
        <p className="text-[11px] text-text-landing-cta-p">Make a little more of every gameweek.</p>
      </div>
      <div className="relative z-1">
        <Link className="inline-flex items-center justify-between gap-5.75 whitespace-nowrap rounded-[5px] bg-surface-public-button-pale px-4.75 py-3.75 text-[10px] font-semibold text-text-public-button-pale hover:bg-surface-public-button-pale-hover min-[1101px]:text-[11px]" href="/signup">
          Get started for free <Icon name="arrow" size={19} strokeWidth={1.6} />
        </Link>
        <span className="mt-3 block text-center text-[7px] text-text-landing-cta-div-nth-child-2-span min-[1500px]:text-[8px]">No credit card. No complications.</span>
      </div>
      <div className="pointer-events-none absolute -top-18.75 -right-6.25 h-87.5 w-78.75 rotate-[-17deg] border border-border-cta-pitch before:absolute before:top-1/2 before:right-0 before:left-0 before:border-t before:border-border-cta-pitch" aria-hidden="true">
        <i className="absolute top-1/2 left-1/2 size-22.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-cta-pitch" />
      </div>
    </section>
  )
}
