import Brand from "../ui/Brand";
import SignOutButton from "./SignOutButton";

export default function Sidebar() {
    return (
        <aside className={`fixed inset-y-0 left-0 z-20 flex w-58 flex-col border-r border-border-default bg-surface-shell px-4.75 pt-8.75 transition-transform duration-200 max-[1200px]:w-51.75 max-[1200px]:px-3.5 max-[1000px]:w-46.25 max-[1000px]:px-2.5 max-[700px]:w-58 max-[700px]:-translate-x-full max-[700px]:shadow-[15px_0_40px_var(--color-shadow-sidebar)]`}>
            <Brand variant="workspace" href="/dashboard" />
            <div className="mb-11 ml-3.25 mt-3.5 text-[8px] font-[650] tracking-[1.5px] text-text-workspace-label max-[1000px]:text-[6px] max-[1000px]:tracking-[1.4px]">YOUR FPL, A LITTLE SMARTER.</div>

            <SignOutButton />
        </aside>
    )
}
