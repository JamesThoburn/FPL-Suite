import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { stadiumImage } from "@/lib/images";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-7.5 py-8.5 min-[601px]:grid-cols-2 min-[601px]:gap-6 min-[601px]:py-11.5 min-[851px]:gap-7 min-[851px]:py-11.5 min-[1101px]:gap-11.25 min-[1101px]:grid-cols-[1fr_1.03fr] min-[1101px]:pt-15.5 min-[1101px]:pb-16.25">
      <div>
        <div className="flex items-center gap-2 text-[7px] font-semibold tracking-[1.5px] text-text-public-eyebrow min-[601px]:text-[6px] min-[601px]:tracking-[1.2px] min-[851px]:text-[6px] min-[851px]:tracking-[1.2px] min-[1101px]:text-[8px] min-[1101px]:tracking-[1.7px]">
          <span className="size-1.25 rounded-full bg-surface-public-eyebrow-span" />
          YOUR FPL, A LITTLE SMARTER.
        </div>
        <h1 className="my-5.5 text-[44px] leading-[1.13] font-semibold tracking-[-2.2px] text-text-landing-hero-copy-h1 min-[366px]:text-[49px] min-[601px]:my-6.25 min-[601px]:text-[42px] min-[601px]:tracking-[-1.9px] min-[851px]:text-[49px] min-[851px]:tracking-[-2px] min-[1101px]:text-[49px] min-[1500px]:text-[clamp(43px,4.7vw,67px)] min-[1500px]:tracking-[-2.7px]">
          Less guesswork.
          <br />
          More{" "}
          <span className="text-text-landing-hero-copy-h1-span">
            green
            <br className="hidden min-[601px]:block" /> arrows.
          </span>
        </h1>
        <p className="max-w-86.25 text-xs leading-[1.9] text-text-landing-hero-copy-p min-[601px]:text-[10px] min-[851px]:text-[10px] min-[1101px]:text-[11px] min-[1500px]:text-[13px]">
          Your team. Your transfers. Your next big decision.
          <br className="hidden min-[601px]:block" /> Bring it all together with an FPL companion that
          <br className="hidden min-[601px]:block" /> puts you one move ahead.
        </p>
        <div className="mt-6.25 flex items-center gap-5.75 min-[601px]:flex-col min-[601px]:items-start min-[601px]:gap-3.75 min-[1101px]:flex-row min-[1101px]:items-center min-[1101px]:gap-4.5 min-[1500px]:gap-6.25">
          <Link className="inline-flex items-center justify-between gap-5.75 whitespace-nowrap rounded-[5px] bg-action-primary px-4.25 py-3.5 text-[10px] font-semibold text-text-public-button hover:bg-action-public-hover min-[601px]:gap-6.25 min-[601px]:px-4.5 min-[601px]:py-3.5 min-[601px]:text-[11px] min-[1101px]:gap-6.25 min-[1101px]:px-4.5 min-[1101px]:text-[11px] min-[1500px]:gap-8.75 min-[1500px]:px-5.5 min-[1500px]:py-4 min-[1500px]:text-xs" href="/signup">
            Find your edge <Icon name="arrow" size={19} strokeWidth={1.6} />
          </Link>
          <Link className="inline-flex items-center gap-2.25 whitespace-nowrap text-[9px] font-[550] text-text-secondary-link hover:text-text-secondary-link-hover min-[601px]:gap-2 min-[601px]:text-[9px] min-[1101px]:text-[9px] min-[1500px]:gap-3.25 min-[1500px]:text-[11px]" href="/dashboard">
            Take a look around <span className="text-[15px]">↗</span>
          </Link>
        </div>
        <div className="mt-4 flex gap-4.5 text-[7px] text-text-hero-reassurance min-[601px]:mt-5.25 min-[601px]:gap-2.5 min-[601px]:text-[6px] min-[1101px]:gap-3 min-[1101px]:text-[7px] min-[1500px]:mt-4.5 min-[1500px]:gap-5.25 min-[1500px]:text-[8px]">
          <span className="flex items-center gap-1.25">
            <span className="text-text-hero-reassurance-svg [&_svg]:w-3"><Icon name="check" size={15} strokeWidth={1.8} /></span>
            Free to get started
          </span>
          <span className="flex items-center gap-1.25">
            <span className="text-text-hero-reassurance-svg [&_svg]:w-3"><Icon name="check" size={15} strokeWidth={1.8} /></span>
            No FPL password needed
          </span>
        </div>
      </div>
      <HeroImage />
    </section>
  )
}

function HeroImage() {
  return (
    <div className="relative h-80 overflow-hidden rounded-[9px] bg-surface-landing-hero-image min-[366px]:h-87.5 min-[601px]:h-105.5 min-[851px]:h-115 min-[1101px]:h-126.5">
      <img className="absolute size-full object-cover object-[46%_center]" src={stadiumImage} alt="A packed football stadium under the evening lights" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-surface-landing-image-shade)_0%,var(--color-surface-landing-image-shade-2)_40%,var(--color-surface-landing-image-shade-3)_100%)]" />
      <div className="absolute top-5.5 left-5.5 right-3 flex items-center gap-1.75 text-[5px] font-medium tracking-[1px] text-text-image-top-label min-[601px]:top-7.25 min-[601px]:left-4.75 min-[601px]:right-3 min-[601px]:text-[4px] min-[851px]:text-[4px] min-[1101px]:left-5.5 min-[1101px]:text-[5px] min-[1500px]:left-6.25 min-[1500px]:text-[6px] min-[1500px]:tracking-[1.4px]">
        <span className="size-1.25 rounded-full bg-surface-live-dot" /> MADE FOR MATCHDAY. AND EVERY DAY BEFORE.
      </div>
      <div className="absolute right-5.5 bottom-28.75 left-5.5 flex items-end justify-between text-[8px] leading-[1.8] tracking-[1.8px] text-text-image-editorial min-[601px]:bottom-28.75 min-[601px]:left-5 min-[601px]:text-[8px] min-[1101px]:bottom-33.25 min-[1101px]:text-[10px]">
        <span>
          THE BEAUTIFUL GAME.
          <br />A SMARTER WAY TO PLAY.
        </span>
        <span className="text-right text-[6px] tracking-[1px] opacity-70">
          51°33′ N<br />
          00°06′ W
        </span>
      </div>
      <div className="absolute right-4.75 bottom-5 left-4.75 flex items-center gap-2.75 rounded-md bg-surface-floating-performance px-3.25 py-4.25 shadow-[0_4px_20px_var(--color-shadow-floating-performance)] backdrop-blur-sm min-[601px]:right-3.5 min-[601px]:left-3.5 min-[601px]:gap-2 min-[601px]:px-2.5 min-[601px]:py-3.25 min-[1101px]:right-4.5 min-[1101px]:bottom-4.75 min-[1101px]:left-4.5 min-[1101px]:gap-2.5 min-[1101px]:px-3 min-[1101px]:py-4 min-[1500px]:right-6 min-[1500px]:bottom-6 min-[1500px]:left-6 min-[1500px]:gap-3.25 min-[1500px]:px-4.5 min-[1500px]:py-5">
        <span className="flex size-9.5 shrink-0 items-center justify-center rounded-full border border-border-performance-icon bg-surface-performance-icon text-text-performance-icon min-[601px]:size-8.75 min-[1500px]:size-10.75">
          <svg
            width="27"
            height="27"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m4 17 6-6 4 3 6-9m-6 0h6v6" />
          </svg>
        </span>
        <div>
          <span className="mb-1.75 block text-[5px] tracking-[.7px] text-text-floating-performance-div-span min-[601px]:text-[4px] min-[1101px]:text-[5px] min-[1500px]:text-[6px] min-[1500px]:tracking-[1px]">A LITTLE PLANNING. A BIG DIFFERENCE.</span>
          <strong className="font-(family-name:--font-manrope) text-[11px] font-semibold tracking-[-.3px] text-text-floating-performance-strong min-[601px]:text-[9px] min-[1101px]:text-[10px] min-[1500px]:text-xs">Your next green arrow starts here.</strong>
        </div>
        <div className="ml-auto flex h-9.25 items-end gap-0.75 max-[365px]:hidden min-[601px]:max-[850px]:hidden min-[1101px]:gap-1">
          <i className="h-3 w-1 rounded-sm bg-surface-performance-bars-i min-[1101px]:w-1.25" />
          <i className="h-4.25 w-1 rounded-sm bg-surface-performance-bars-i min-[1101px]:w-1.25" />
          <i className="h-5.75 w-1 rounded-sm bg-surface-performance-bars-i min-[1101px]:w-1.25" />
          <i className="h-7.25 w-1 rounded-sm bg-surface-performance-bars-i min-[1101px]:w-1.25" />
          <i className="h-8.75 w-1 rounded-sm bg-surface-performance-bars-i-nth-child-5 min-[1101px]:w-1.25" />
        </div>
      </div>
    </div>
  )
}
