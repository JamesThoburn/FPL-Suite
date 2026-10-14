import Hero from "@/components/dashboard/Hero";
import { getNextGameweek } from "@/lib/gameweek";

export default async function DashboardPage() {
  const nextGameweek = await getNextGameweek();

  return (
    <>
      <Hero nextGameweek={nextGameweek} />
    </>
  )
}
