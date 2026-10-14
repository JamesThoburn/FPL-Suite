"use client"

import { Fragment, useEffect, useState } from "react"

type Props = { deadlineTime: string }

const pad = (n: number) => String(n).padStart(2, "0")

const LABELS = ["DAYS", "HRS", "MINS", "SECS"] as const

export default function DeadlineCountdown({ deadlineTime }: Props) {
    // null until mounted, so server and client render identical markup (no hydration mismatch)
    const [now, setNow] = useState<number | null>(null)

    useEffect(() => {
        setNow(Date.now())
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id)
    }, [])

    const deadline = Date.parse(deadlineTime)

    if (now !== null && now >= deadline) {
        return <span className="text-[10px] max-[700px]:text-[9px]">Deadline passed</span>
    }

    let units: { label: (typeof LABELS)[number]; value: string }[]

    if (now === null) {
        // Pre-mount placeholder
        units = LABELS.map((label) => ({ label, value: "--" }))
    } else {
        const total = Math.floor((deadline - now) / 1000)
        const numbers = [
            Math.floor(total / 86_400),
            Math.floor((total % 86_400) / 3_600),
            Math.floor((total % 3_600) / 60),
            total % 60,
        ]

        // Drop leading zero units only; always keep seconds
        const firstNonZero = numbers.findIndex((n) => n > 0)
        const start = firstNonZero === -1 ? numbers.length - 1 : firstNonZero

        units = numbers
            .map((n, i) => ({ label: LABELS[i], value: pad(n) }))
            .slice(start)
    }

    return (
        <div className="flex items-start gap-2 max-[1000px]:gap-1.5 max-[700px]:gap-1">
            {units.map((unit, i) => (
                <Fragment key={unit.label}>
                    {i > 0 && (
                        <i className="text-[17px] text-text-deadline-i not-italic max-[1000px]:text-[15px] max-[700px]:text-[12px]">:</i>
                    )}
                    <b className="text-[20px] leading-[1.1] font-medium max-[1000px]:text-[18px] max-[700px]:text-[14px]">
                        {unit.value}{" "}
                        <small className="mt-1.5 block text-[6px] font-normal tracking-[1.4px] text-text-deadline-small max-[700px]:text-[5px] max-[700px]:tracking-[1px]">
                            {unit.label}
                        </small>
                    </b>
                </Fragment>
            ))}
        </div>
    )
}