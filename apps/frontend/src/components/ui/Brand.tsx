import Link from "next/link"

type BrandProps = {
  href?: string
  variant?: "workspace" | "public"
  onDark?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export default function Brand({
  href = "/",
  variant = "public",
  onDark = false,
  onClick,
}: BrandProps) {
  const className = [
    "brand inline-flex items-center gap-[3px] font-[family-name:var(--font-manrope)] font-extrabold tracking-[-1.3px]",
    variant === "workspace" ? "pl-3 text-[25px]" : "public-brand whitespace-nowrap text-[22px]",
    onDark ? "text-white" : "",
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <Link className={className} href={href} onClick={onClick} aria-label="FPL Suite home">
      <span className="brand-mark mr-2 inline-flex h-6.25 skew-[-10deg] items-end gap-0.75">
        <span className="h-3.25 w-1.25 rounded-[1px] bg-brand" />
        <span className="h-5 w-1.25 rounded-[1px] bg-brand" />
        <span className="h-6.75 w-1.25 rounded-[1px] bg-brand" />
      </span>
      FPL<span className="font-medium">Suite</span>
      <span className="brand-dot mb-1.75 ml-px h-1.25 w-1.25 self-end rounded-full bg-brand" />
    </Link>
  )
}
