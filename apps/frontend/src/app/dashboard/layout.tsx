import DashboardShell from "@/components/dashboard/DashboardShell";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard | FPL Suite"
}

type CurrentSeason = {
  startYear: number;
  endYear: number;
  label: string;
}

function isCurrentSeason(value: unknown): value is CurrentSeason {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const season = value as Record<string, unknown>;

  if (
    typeof season.startYear !== "number" ||
    !Number.isInteger(season.startYear) ||
    typeof season.endYear !== "number" ||
    !Number.isInteger(season.endYear) ||
    typeof season.label !== "string"
  ) {
    return false;
  }

  return (
    season.endYear === season.startYear + 1 && season.label ===
    `${season.startYear}/${String(season.endYear % 100).padStart(2, "0")}`
  );
}

async function getCurrentSeason(): Promise<CurrentSeason | null> {
  const apiBaseUrl = process.env.JAVA_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing JAVA_API_BASE_URL");
  }

  const url = new URL("/api/v1/season/current", apiBaseUrl);

  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Could not reach the Java API for the current season", error);
    return null;
  }

  if (!response.ok) {
    console.error(
      `Java API returned ${response.status} while fetching the current season`,
    );
    return null;
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    console.error("Java API returned invalid JSON for the current season", error);
    return null;
  }

  if (!isCurrentSeason(data)) {
    console.error("Java API returned an invalid current-season response");
    return null;
  }

  return data;
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const season = await getCurrentSeason();

  return (
    <DashboardShell seasonLabel={season?.label ?? null}>
      {children}
    </DashboardShell>
  )
}
