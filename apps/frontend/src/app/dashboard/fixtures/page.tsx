import FixturesBrowser from "@/components/dashboard/fixtures/FixturesBrowser";
import { getFixtures } from "@/lib/fixtures";

export default async function FixturesPage() {
  const result = await getFixtures();

  return <FixturesBrowser result={result} />
    
}
