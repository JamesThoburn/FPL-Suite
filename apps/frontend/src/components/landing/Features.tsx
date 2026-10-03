import type { ReactNode } from "react"
import Link from "next/link"
import Icon from "@/components/ui/Icon"

type FeatureIconType = "planner" | "players" | "leagues"

const featureIconPaths: Record<FeatureIconType, ReactNode> = {
  planner: <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />,
  players: (
    <>
      <path d="M4 3v18h17M8 15l4-5 4 2 5-8" />
      <circle cx="21" cy="4" r="1" />
    </>
  ),
  leagues: (
    <path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8" />
  ),
}

function FeatureIcon({ type }: { type: FeatureIconType }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {featureIconPaths[type]}
    </svg>
  )
}

type FeatureCardProps = {
  icon: FeatureIconType
  tag: string
  title: string
  description: string
  caption: string
  children: ReactNode
}

function FeatureCard({ icon, tag, title, description, caption, children }: FeatureCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-border-landing-feature-card bg-surface-landing-feature-card px-5.5 py-5.75 min-[601px]:px-3.25 min-[601px]:py-4.5 min-[851px]:px-4.5 min-[851px]:py-5.25 min-[1101px]:px-5.75 min-[1101px]:pt-6.25 min-[1101px]:pb-4.75">
      <div className="mb-5 flex items-center justify-between gap-3.75 min-[601px]:mb-5 min-[1500px]:mb-6.25">
        <span className="flex size-10.25 items-center justify-center rounded-md bg-surface-feature-icon text-text-feature-icon min-[601px]:size-8.5 min-[1101px]:size-8.5 min-[1500px]:size-10.75">
          <FeatureIcon type={icon} />
        </span>
        <span className="text-[7px] tracking-[1.2px] text-text-feature-card-top-span-last-child min-[601px]:text-[5px] min-[601px]:tracking-[.7px] min-[1500px]:text-[7px] min-[1500px]:tracking-[1.2px]">{tag}</span>
      </div>
      <h3 className="mb-2.25 font-(family-name:--font-manrope) text-xl leading-normal font-semibold tracking-[-.6px] min-[601px]:text-sm min-[851px]:text-base min-[1101px]:text-lg min-[1500px]:mb-2.5">{title}</h3>
      <p className="min-h-0 max-w-75 text-[11px] leading-[1.9] text-text-landing-feature-card-p min-[601px]:min-h-18.5 min-[601px]:text-[9px] min-[851px]:text-[10px] min-[1101px]:min-h-16 min-[1101px]:max-w-65 min-[1101px]:text-[11px]">{description}</p>
      {children}
      <span className="mt-auto text-[6px] tracking-[1.6px] text-text-feature-caption min-[601px]:text-[5px] min-[601px]:tracking-[1.2px]">{caption}</span>
    </article>
  )
}

function MiniTransfer() {
  return (
    <div className="mt-5.5 mb-5 min-h-31.25 rounded-[5px] border border-border-mini-transfer bg-surface-mini-transfer p-3.5 min-[601px]:px-2.25 min-[1101px]:px-2.25 min-[1500px]:px-3 min-[1500px]:pt-3.25">
      <div className="flex items-center gap-2.25">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-mini-avatar-outgoing text-[10px] text-text-mini-avatar-outgoing min-[601px]:size-5.75 min-[601px]:text-[8px] min-[1500px]:size-6.75 min-[1500px]:text-[10px]">M</span>
        <span>
          <strong className="block text-[11px] font-semibold text-text-mini-transfer-strong min-[601px]:text-[8px] min-[1500px]:text-[10px]">Maddison</strong>
          <small className="mt-0.75 block text-[8px] text-text-mini-transfer-small min-[601px]:text-[6px] min-[1500px]:text-[7px]">Transfer out</small>
        </span>
        <span className="ml-auto text-[10px] text-text-mini-transfer-price min-[601px]:text-[7px] min-[1500px]:text-[9px]">£7.6m</span>
      </div>
      <div className="flex h-5.5 items-center justify-center text-text-transfer-direction [&_svg]:h-3 [&_svg]:w-3 [&_svg]:rotate-90">
        <Icon name="arrow" size={19} strokeWidth={1.6} />
      </div>
      <div className="flex items-center gap-2.25">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-mini-avatar-incoming text-[10px] text-text-mini-avatar-incoming min-[601px]:size-5.75 min-[601px]:text-[8px] min-[1500px]:size-6.75 min-[1500px]:text-[10px]">P</span>
        <span>
          <strong className="block text-[11px] font-semibold text-text-mini-transfer-strong min-[601px]:text-[8px] min-[1500px]:text-[10px]">Palmer</strong>
          <small className="mt-0.75 block text-[8px] text-text-mini-transfer-small min-[601px]:text-[6px] min-[1500px]:text-[7px]">Transfer in</small>
        </span>
        <span className="ml-auto text-[10px] text-text-mini-transfer-price min-[601px]:text-[7px] min-[1500px]:text-[9px]">£11.2m</span>
      </div>
    </div>
  )
}

function MiniPlayer() {
  return (
    <div className="mt-5.5 mb-5 min-h-31.25 rounded-[5px] border border-border-mini-transfer bg-surface-mini-transfer p-3.5 min-[601px]:px-2.25 min-[1101px]:px-2.25 min-[1500px]:px-3 min-[1500px]:pt-3.25">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-player-avatar text-[10px] text-text-player-avatar min-[601px]:size-5.75 min-[601px]:text-[8px] min-[1500px]:size-6.75 min-[1500px]:text-[10px]">I</span>
        <span>
          <strong className="block text-[11px] font-semibold text-text-mini-transfer-strong min-[601px]:text-[8px] min-[1500px]:text-[10px]">Alexander Isak</strong>
          <small className="mt-0.75 block text-[8px] text-text-mini-transfer-small min-[601px]:text-[6px] min-[1500px]:text-[7px]">NEW · Forward</small>
        </span>
        <span className="ml-auto whitespace-nowrap rounded-sm bg-surface-form-tag px-1.75 py-1.25 text-[6px] tracking-[.5px] text-text-form-tag min-[601px]:p-0.75 min-[601px]:text-[4px] min-[1500px]:px-1.25 min-[1500px]:py-1 min-[1500px]:text-[5px]">IN FORM</span>
      </div>
      <div className="mt-4.25 grid grid-cols-3 border-t border-border-mini-player-stats pt-3.25 min-[601px]:mt-2.5 min-[1500px]:mt-4 min-[1500px]:pt-3">
        <span className="border-r border-border-mini-player-stats-span pr-1 text-[7px] text-text-mini-player-stats-span min-[601px]:text-[5px] min-[601px]:pl-1.25 min-[1500px]:text-[6px] min-[1500px]:pl-2">
          Form<strong className="mt-1.5 block text-sm text-text-mini-transfer-strong min-[601px]:text-[10px] min-[1500px]:text-xs">8.2</strong>
        </span>
        <span className="border-r border-border-mini-player-stats-span pl-2 text-[7px] text-text-mini-player-stats-span min-[601px]:text-[5px] min-[601px]:pl-1.25 min-[1500px]:text-[6px] min-[1500px]:pl-2">
          Price<strong className="mt-1.5 block text-sm text-text-mini-transfer-strong min-[601px]:text-[10px] min-[1500px]:text-xs">£8.9m</strong>
        </span>
        <span className="pl-2 text-[7px] text-text-mini-player-stats-span min-[601px]:text-[5px] min-[601px]:pl-1.25 min-[1500px]:text-[6px] min-[1500px]:pl-2">
          Next fixture
          <strong className="mt-1.5 block w-fit bg-surface-mini-player-stats-easy-fixture px-1.25 py-0.75 text-[9px] text-text-mini-player-stats-easy-fixture min-[601px]:text-[6px] min-[1500px]:text-[8px]">LEI (H)</strong>
        </span>
      </div>
    </div>
  )
}

function MiniLeague() {
  return (
    <div className="mt-5.5 mb-5 min-h-31.25 rounded-[5px] border border-border-mini-transfer bg-surface-mini-transfer p-[9px_14px] min-[601px]:px-2.25 min-[1101px]:px-2.25 min-[1500px]:px-2">
      <div className="flex items-center gap-3 px-2.25 py-2.25 text-[9px] text-text-mini-league-div min-[601px]:gap-1.25 min-[601px]:text-[6px] min-[851px]:gap-1.75 min-[851px]:text-[8px] min-[1101px]:gap-2.5 min-[1101px]:px-1.75">
        <span>1</span>
        <strong className="text-[9px] font-medium text-text-mini-league-strong min-[601px]:text-[6px] min-[851px]:text-[8px]">No Kane, No Gain</strong>
        <b className="ml-auto whitespace-nowrap text-[10px] font-medium text-text-mini-league-b min-[601px]:text-[7px] min-[851px]:text-[9px]">968</b>
      </div>
      <div className="flex items-center gap-3 rounded-[3px] bg-surface-mini-league-mini-league-you px-2.25 py-2.25 text-[9px] text-text-mini-league-div min-[601px]:gap-1.25 min-[601px]:text-[6px] min-[851px]:gap-1.75 min-[851px]:text-[8px] min-[1101px]:gap-2.5 min-[1101px]:px-1.75">
        <span>2</span>
        <strong className="text-[9px] font-medium text-text-mini-league-strong min-[601px]:text-[6px] min-[851px]:text-[8px]">
          Weekend Wanderers <small className="ml-1 hidden text-[5px] text-text-mini-league-small min-[1101px]:inline">YOU</small>
        </strong>
        <b className="ml-auto whitespace-nowrap text-[10px] font-medium text-text-mini-league-b min-[601px]:text-[7px] min-[851px]:text-[9px]">
          942 <i className="text-[7px] not-italic text-text-mini-league-i">↗</i>
        </b>
      </div>
      <div className="flex items-center gap-3 px-2.25 py-2.25 text-[9px] text-text-mini-league-div min-[601px]:gap-1.25 min-[601px]:text-[6px] min-[851px]:gap-1.75 min-[851px]:text-[8px] min-[1101px]:gap-2.5 min-[1101px]:px-1.75">
        <span>3</span>
        <strong className="text-[9px] font-medium text-text-mini-league-strong min-[601px]:text-[6px] min-[851px]:text-[8px]">The Pep Talk</strong>
        <b className="ml-auto whitespace-nowrap text-[10px] font-medium text-text-mini-league-b min-[601px]:text-[7px] min-[851px]:text-[9px]">926</b>
      </div>
    </div>
  )
}

export default function Features() {
  return (
    <section className="scroll-mt-7.5 py-9.25 min-[601px]:py-15.25 min-[601px]:pb-13.5" id="features">
      <div className="mb-5.25 flex flex-col items-start justify-between gap-3.5 min-[851px]:flex-row min-[851px]:items-end min-[851px]:gap-5 min-[1101px]:mb-6.75">
        <div>
          <div className="flex items-center gap-2 text-[6px] font-semibold tracking-[1.4px] text-text-public-eyebrow min-[851px]:text-[7px] min-[1500px]:text-[8px]">EVERYTHING IN YOUR CORNER</div>
          <h2 className="mt-2.5 max-w-77.5 font-(family-name:--font-manrope) text-[25px] leading-[1.35] font-semibold tracking-[-.9px] min-[601px]:max-w-none min-[601px]:text-2xl min-[851px]:text-[27px] min-[851px]:leading-[1.4] min-[851px]:mt-3">One suite. A whole new perspective.</h2>
        </div>
        <Link className="inline-flex items-center gap-2.25 whitespace-nowrap text-[9px] font-[550] text-text-secondary-link hover:text-text-secondary-link-hover min-[851px]:pb-1.75 min-[1500px]:gap-3.25 min-[1500px]:text-[11px]" href="/dashboard">
          Explore the workspace <Icon name="arrow" size={19} strokeWidth={1.6} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3.75 min-[601px]:grid-cols-3 min-[601px]:gap-2.75 min-[1101px]:gap-3.5 min-[1500px]:gap-5">
        <FeatureCard
          icon="planner"
          tag="01 / PLAN"
          title="Think a few moves ahead."
          description="Map out your transfers, manage your budget, and turn a good idea into a gameweek plan."
          caption="THE TRANSFER PLANNER"
        >
          <MiniTransfer />
        </FeatureCard>
        <FeatureCard
          icon="players"
          tag="02 / DISCOVER"
          title="See beyond the hype."
          description="Form, fixtures, and the underlying numbers. Find the picks that make sense for your team."
          caption="THE PLAYER EXPLORER"
        >
          <MiniPlayer />
        </FeatureCard>
        <FeatureCard
          icon="leagues"
          tag="03 / COMPETE"
          title="Keep your rivals closer."
          description="Follow the race, spot the differences, and make the most of a little healthy competition."
          caption="YOUR MINI LEAGUES"
        >
          <MiniLeague />
        </FeatureCard>
      </div>
    </section>
  )
}
