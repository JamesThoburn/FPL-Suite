import Brand from "@/components/ui/Brand";

export default function PublicFooter() {
  return (
    <footer className="mx-auto flex max-w-360 flex-wrap items-center gap-3 border-t border-border-public-footer px-5.5 py-5.5 min-[601px]:gap-3.75 min-[601px]:px-8.75 min-[851px]:gap-7.5 min-[1101px]:px-16 min-[1101px]:pt-6.25 min-[1101px]:pb-7.5 [&_.brand]:text-[20px] [&_.brand-mark]:mr-0.75 [&_.brand-mark]:transform-[scale(.75)_skew(-10deg)] [&_.brand-dot]:h-1 [&_.brand-dot]:w-1 min-[601px]:[&_.brand]:text-[19px]">
      <Brand />
      <p className="order-3 mt-0 w-full text-[8px] text-text-public-footer-p min-[601px]:order-0 min-[601px]:w-auto min-[601px]:text-[7px] min-[851px]:text-[9px]">An independent companion. A shared love of the game.</p>
      <span className="ml-auto text-[7px] text-text-public-footer-p min-[601px]:text-[6px] min-[851px]:text-[8px]">© {new Date().getFullYear()} FPL Suite</span>
    </footer>
  )
}
