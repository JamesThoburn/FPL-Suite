export default function Manifesto() {
  return (
    <section className="flex flex-col items-center gap-3 border-y border-border-landing-manifesto px-2.5 py-7.25 text-center min-[601px]:gap-3.25 min-[601px]:px-5 min-[601px]:py-9 min-[1500px]:py-9.5" id="our-approach">
      <span className="flex max-w-none items-center gap-2 text-[5px] leading-[1.8] font-semibold tracking-[1px] text-text-public-eyebrow max-[600px]:max-w-72.5 min-[601px]:text-[5px] min-[851px]:text-[7px] min-[851px]:tracking-[1.5px]">
        FOR THE THINKERS. THE TINKERERS. THE LAST-MINUTE CAPTAIN SWITCHERS.
      </span>
      <p className="font-(family-name:--font-manrope) text-[22px] leading-normal font-medium tracking-[-.5px] text-text-landing-manifesto-p min-[601px]:text-[21px] min-[851px]:text-2xl">
        You love the game.
        <br className="block min-[601px]:hidden" /> We make the numbers easier.
      </p>
      <span className="text-[9px] leading-[1.8] text-text-landing-manifesto-span-last-child min-[601px]:text-[10px] min-[851px]:text-[11px]">Less time in spreadsheets. More time enjoying the football.</span>
    </section>
  )
}
