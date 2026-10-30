import Hero from "@/components/dashboard/Hero";
import ToolsSection from "@/components/dashboard/ToolsSection";
import { getNextGameweek } from "@/lib/gameweek";

export default async function DashboardPage() {
  const nextGameweek = await getNextGameweek();

  return (
    <>
      <Hero nextGameweek={nextGameweek} />
      <ToolsSection />
    </>
  )
}
