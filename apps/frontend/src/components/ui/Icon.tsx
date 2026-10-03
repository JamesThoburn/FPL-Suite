import type { ReactNode } from "react"

export type IconName =
    | "grid"
    | "team"
    | "transfer"
    | "calendar"
    | "chart"
    | "trophy"
    | "arrow"
    | "chevron"
    | "bell"
    | "search"
    | "close"
    | "check"
    | "settings"
    | "help"
    | "spark"
    | "menu"

const paths: Record<IconName, ReactNode> = {
    grid: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
    ),
    team: (
        <>
            <circle cx="9" cy="7" r="3" />
            <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2" />
        </>
    ),
    transfer: <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />,
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2" />
        </>
    ),
    chart: <path d="M4 3v18h17M8 15l4-5 4 2 5-8" />,
    trophy: (
        <path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8" />
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 21h6" />,
    search: (
        <>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
        </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    settings: (
        <>
            <path d="m10 3-1 3-3 1-3 3 2 3-1 3 3 2 3-1 3 2 3-2 3-1v-4l2-3-2-3-3-1-1-3Z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    help: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01" />
        </>
    ),
    spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
}

type IconProps = {
    name: IconName
    size?: number
    strokeWidth?: number
}

export default function Icon({ name, size = 20, strokeWidth = 1.65 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    )
}
