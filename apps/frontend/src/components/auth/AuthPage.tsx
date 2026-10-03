import Link from "next/link"
import Brand from "@/components/ui/Brand"
import AuthForm, { type AuthMode } from "./AuthForm"
import AuthVisual from "./AuthVisual"

export default function AuthPage({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-auth-page min-[601px]:grid min-[601px]:min-h-screen min-[601px]:grid-cols-2 max-[1100px]:min-[601px]:grid-cols-[1.1fr_1fr]">
      <section className="flex min-h-dvh min-w-0 flex-col min-[601px]:min-h-0">
        <header className="flex items-center justify-between gap-3.75 px-6 py-6.25 min-[601px]:gap-5 min-[601px]:px-5.5 min-[601px]:py-6.25 min-[851px]:px-5.5 min-[1101px]:px-10.75 min-[1101px]:py-8.5">
          <Brand />
          <div className="flex items-center gap-3 min-[601px]:gap-3.75">
            <Link className="whitespace-nowrap text-[8px] text-text-auth-header-a-last-child [&_span]:ml-2 min-[601px]:text-[7px] min-[851px]:text-[8px] min-[1101px]:text-[10px]" href="/">
              Back to home <span>↗</span>
            </Link>
          </div>
        </header>
        <AuthForm mode={mode} />
        <footer className="flex justify-between gap-3.75 border-t border-border-auth-footer px-6 py-5.5 text-[6px] text-text-auth-footer min-[601px]:border-0 min-[601px]:px-5.5 min-[601px]:py-5 min-[601px]:text-[6px] min-[1101px]:px-7.5 min-[1101px]:py-5.75 min-[1101px]:text-[7px] min-[1500px]:px-10.75">
          <span>Built for the love of the game.</span>
          <span>© {new Date().getFullYear()} FPL Suite</span>
        </footer>
      </section>
      <AuthVisual />
    </div>
  )
}
