import Link from "next/link"
import Brand from "@/components/ui/Brand"
import Icon from "@/components/ui/Icon"

export default function LandingHeader() {
  return (
    <header className="mx-auto flex max-w-360 items-center justify-between gap-2.5 border-b border-border-public-header px-4.25 py-5.5 min-[366px]:gap-3.75 min-[366px]:px-5.5 min-[601px]:gap-5 min-[601px]:px-8.75 min-[601px]:py-6.25 min-[1101px]:gap-7.5 min-[1101px]:px-16 min-[1101px]:py-7.25">
      <Brand />
      <nav className="hidden items-center gap-4 text-[10px] text-text-public-header-nav min-[601px]:flex min-[851px]:gap-5.5 min-[851px]:text-[11px] min-[1101px]:gap-7.5 min-[1101px]:text-xs" aria-label="Website navigation">
        <a className="hover:text-text-public-header-nav-a-hover" href="#features">The toolkit</a>
        <a className="hover:text-text-public-header-nav-a-hover" href="#how-it-works">How it works</a>
        <a className="hidden hover:text-text-public-header-nav-a-hover min-[851px]:inline" href="#our-approach">Our approach</a>
      </nav>
      <div className="flex items-center gap-2.5 text-[10px] min-[366px]:gap-3.75 min-[601px]:gap-4.25 min-[601px]:text-[10px] min-[851px]:gap-5 min-[851px]:text-xs min-[1101px]:gap-7">
        <Link className="font-[550] hover:text-text-public-header-nav-a-hover" href="/login">
          Log in
        </Link>
        <Link className="inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-[5px] bg-action-primary px-2.5 py-2.5 text-[9px] font-semibold text-text-public-button hover:bg-action-public-hover min-[366px]:gap-2.75 min-[366px]:px-3 min-[366px]:text-[9px] min-[601px]:gap-4 min-[601px]:px-3.25 min-[601px]:py-2.75 min-[601px]:text-[10px] min-[851px]:gap-6.25 min-[851px]:px-4.5 min-[851px]:py-3.5 min-[851px]:text-[11px] min-[1101px]:gap-6.25 min-[1101px]:px-4.25 min-[1101px]:py-3 max-[600px]:[&_svg]:w-3.75" href="/signup">
          Get started <Icon name="arrow" size={19} strokeWidth={1.6} />
        </Link>
      </div>
    </header>
  )
}