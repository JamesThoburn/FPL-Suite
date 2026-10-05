import PublicFooter from "@/components/layout/PublicFooter";
import NotFoundHeader from "@/components/not-found/NotFoundHeader";
import NotFoundMessage from "@/components/not-found/NotFoundMessage";
import NotFoundPitchVisual from "@/components/not-found/NotFoundPitchVisual";

export default function NotFound() {
  return (
    <div>
        <NotFoundHeader />

        <main className="mx-auto grid min-h-[calc(100vh-178px)] max-w-360 items-center gap-12 px-6 py-12 sm:px-9 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-16 lg:py-16">
            <div className="flex justify-center lg:justify-normal">
                <NotFoundMessage />
            </div>
            <NotFoundPitchVisual />
        </main>

        <PublicFooter />
    </div>
  );
};
