const STEPS = [
    {
        number: "01",
        title: "Make yourself at home.",
        text: "Create your free FPL Suite account."
    },
    {
        number: "02",
        title: "Bring your team along.",
        text: "Connect with your team ID. Your FPL password stays yours."
    },
    {
        number: "03",
        title: "Find your next green arrow.",
        text: "Explore your insights. Plan your moves. Enjoy the game."
    }
]

export default function Steps() {
  return (
    <section className="mb-7.5 grid scroll-mt-7.5 grid-cols-1 gap-6.5 rounded-lg border border-border-landing-steps bg-surface-landing-steps px-6 py-7.5 min-[601px]:grid-cols-2 min-[601px]:gap-8.75 min-[601px]:px-7.5 min-[601px]:py-8.75 min-[851px]:gap-17.5 min-[851px]:px-11.25 min-[851px]:pt-11 min-[851px]:pb-12.5 min-[1500px]:mb-13" id="how-it-works">
      <div>
        <div className="flex items-center gap-2 text-[6px] font-semibold tracking-[1.4px] text-text-public-eyebrow min-[1101px]:text-[6px] min-[1500px]:text-[8px]">LESS SETUP. MORE KICK-OFF.</div>
        <h2 className="mt-3 font-(family-name:--font-manrope) text-[28px] leading-[1.3] font-semibold tracking-[-.9px] text-text-landing-steps-h2 min-[601px]:text-[26px] min-[1101px]:text-[26px] min-[1500px]:text-[30px]">
          In your corner.
          <br />
          In three simple steps.
        </h2>
        <p className="mt-4 text-[11px] leading-[1.9] text-text-landing-steps-div-p min-[601px]:text-[10px] min-[1101px]:text-[10px] min-[1500px]:text-[11px]">
          No complicated setup. No spreadsheets.
          <br />
          Just you, your team, and a clearer picture.
        </p>
      </div>
      <ol className="mt-1.25 flex list-none flex-col gap-5.75 p-0 min-[601px]:gap-6.5">
        {STEPS.map((step) => (
          <li className="flex items-start gap-3.75 min-[601px]:gap-3 min-[1101px]:gap-3 min-[1500px]:gap-4.5" key={step.number}>
            <span className="flex size-7.25 shrink-0 items-center justify-center rounded-full border border-border-landing-steps-li-span text-[9px] text-text-form-tag">{step.number}</span>
            <div>
              <h3 className="mb-1.5 text-xs font-semibold text-text-landing-steps-h3 min-[601px]:text-[11px] min-[1101px]:text-[11px] min-[1500px]:text-[13px]">{step.title}</h3>
              <p className="text-[10px] leading-[1.7] text-text-landing-steps-li-p min-[601px]:text-[9px] min-[1101px]:text-[9px] min-[1500px]:text-[10px]">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}