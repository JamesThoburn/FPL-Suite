import { IconName } from "@/components/ui/Icon"

export type NavItem = {
    label: string
    href: string
    icon: IconName
    isNew?: boolean
}

export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "grid", isNew: true },
  { label: "My team", href: "/dashboard/team", icon: "team", isNew: true },
  { label: "Transfer planner", href: "/dashboard/transfers", icon: "transfer", isNew: true },
  { label: "Fixtures", href: "/dashboard/fixtures", icon: "calendar", isNew: true },
  { label: "Player explorer", href: "/dashboard/players", icon: "chart", isNew: true },
  { label: "Mini leagues", href: "/dashboard/leagues", icon: "trophy", isNew: true},
]

export const pageHeadings: Record<string, string> = {
  "/dashboard": "Your game. Your edge.",
  "/dashboard/team": "Your starting eleven.",
  "/dashboard/transfers": "Make your next move.",
  "/dashboard/fixtures": "Look ahead. Plan smarter.",
  "/dashboard/players": "Find your next difference-maker.",
  "/dashboard/leagues": "A little healthy competition.",
}

/** Finds the nav item for a pathname, falling back to Overview. */
export function getActiveNav(pathname: string): NavItem {
  return (
    dashboardNav.find((item) => item.href === pathname) ?? dashboardNav[0]
  )
}
