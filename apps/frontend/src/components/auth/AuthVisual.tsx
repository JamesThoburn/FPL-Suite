import Icon from "@/components/ui/Icon"
import { stadiumImage } from "@/lib/images"

const benefits = [
  "All your insights, in one place",
  "Built around your team",
  "Free to get started",
]

export default function AuthVisual() {
  return (
    <aside className="relative m-[15px_15px_15px_0] hidden min-h-[calc(100vh-30px)] overflow-hidden rounded-[9px] bg-surface-auth-visual text-text-auth-visual min-[601px]:block">
      <img className="absolute size-full object-cover object-[47%_center] opacity-80" src={stadiumImage} alt="A football stadium filled with supporters at dusk" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-surface-auth-visual-shade)_0%,var(--color-surface-auth-visual-shade-2)_35%,var(--color-surface-auth-visual-shade-3)_100%)]" />
      <div className="absolute top-6.75 left-5.5 right-5 flex items-center gap-1.75 text-[4px] tracking-[.7px] text-text-auth-visual-top min-[851px]:top-6.75 min-[851px]:left-6.75 min-[851px]:text-[5px] min-[1101px]:top-8.75 min-[1101px]:left-8.75 min-[1101px]:right-8.75 min-[1101px]:text-[6px] min-[1101px]:tracking-[1.6px] min-[1500px]:top-10.75 min-[1500px]:left-11.25 min-[1500px]:text-[8px]">
        <span className="size-1.25 rounded-full bg-surface-live-dot" /> YOUR TEAM. YOUR TRANSFERS. YOUR EDGE.
      </div>
      <div className="absolute right-5.75 bottom-27.5 left-6 min-[851px]:right-8.75 min-[851px]:bottom-25 min-[851px]:left-8 min-[1101px]:right-8.75 min-[1101px]:bottom-30 min-[1101px]:left-12 min-[1500px]:bottom-37.5 min-[1500px]:left-16.25">
        <div className="flex items-center gap-2 text-[5px] tracking-[1.6px] text-text-auth-visual-content-public-eyebrow min-[1101px]:text-[7px]">MORE THAN A GAMEWEEK.</div>
        <h2 className="my-4.5 font-(family-name:--font-manrope) text-[32px] leading-[1.2] font-medium tracking-[-1px] min-[851px]:text-[38px] min-[1101px]:text-[clamp(30px,3.65vw,52px)] min-[1101px]:tracking-[-1.7px] min-[1500px]:text-[59px]">
          For the love
          <br />
          of the game.
          <br />
          <span className="whitespace-nowrap text-[.7em] text-text-auth-visual-content-h2-span">And the green arrows.</span>
        </h2>
        <p className="text-[9px] leading-[1.9] text-text-auth-visual-content-p min-[1101px]:text-[10px] min-[1500px]:text-[13px]">
          The highs. The near misses. The captain who comes through.
          <br />A smarter companion for every moment of your FPL season.
        </p>
        <div className="mt-7.5 flex max-w-87.5 flex-wrap gap-3.25 text-text-auth-benefits-span min-[1101px]:gap-[15px_22px]">
          {benefits.map((benefit) => (
            <span className="flex items-center gap-1.75 text-[7px] min-[1101px]:text-[8px] min-[1500px]:text-[10px]" key={benefit}>
              <span className="text-text-auth-benefits-svg [&_svg]:w-3"><Icon name="check" size={15} strokeWidth={1.8} /></span>
              {benefit}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute right-5.75 bottom-7.5 left-5.75 flex items-center justify-between gap-2.5 border-t border-border-auth-visual-bottom pt-4.75 text-[4px] tracking-[1px] text-text-auth-visual-bottom min-[1101px]:right-8.75 min-[1101px]:bottom-8.75 min-[1101px]:left-8.75 min-[1101px]:gap-5 min-[1101px]:text-[6px] min-[1101px]:tracking-[1.6px]">
        <span>EVERY POINT COUNTS.</span>
        <div>
          <i className="size-1 rounded-full bg-surface-auth-visual-bottom-i first:w-3.5 first:rounded-[3px] first:bg-surface-auth-visual-bottom-i-first-child" />
          <i className="size-1 rounded-full bg-surface-auth-visual-bottom-i" />
          <i className="size-1 rounded-full bg-surface-auth-visual-bottom-i" />
        </div>
        <span>FPL SUITE / 01</span>
      </div>
    </aside>
  )
}
