export default function DashboardFooter() {
    return (
        <footer className="mt-7.25 flex justify-between gap-3.75 border-t border-border-default pb-6 pt-5 text-[7px] text-text-page-footer max-[1000px]:[&>span:last-child]:max-w-57.5 max-[1000px]:[&>span:last-child]:text-right max-[1000px]:[&>span:last-child]:leading-[1.7] max-[700px]:mt-5.75 max-[700px]:gap-2 max-[700px]:text-[6px] max-[700px]:[&>span:last-child]:max-w-47.5 [&>span:last-child>span]:mx-1.5">
            <span>Built for the love of the game.</span>
            <span>
                FPL Suite <span>·</span> An independent FPL companion{" "}
            </span>
        </footer>
    )
}