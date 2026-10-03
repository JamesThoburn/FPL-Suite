import CallToAction from "@/components/landing/CallToAction";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import LandingHeader from "@/components/landing/LandingHeader";
import Manifesto from "@/components/landing/Manifesto";
import Steps from "@/components/landing/Steps";
import PublicFooter from "@/components/layout/PublicFooter";

export default function LandingPage() {
  return (
    <div className="bg-surface-public-page text-text-public-primary">
      <LandingHeader />
      <main className="mx-auto max-w-360 px-4.25 min-[366px]:px-5.5 min-[601px]:px-8.75 min-[1101px]:px-16">
        <Hero />
        <Manifesto />
        <Features />
        <Steps />
        <CallToAction />
      </main>
      <PublicFooter />
    </div>
  )
}
