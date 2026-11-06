export default function TeamCrest({ code }: { code: number; }) {
    return (
        <img
            src={`https://resources.premierleague.com/premierleague/badges/70/t${code}.png`}
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            className="size-7 shrink-0 object-contain"
            onError={(event) => {
                event.currentTarget.style.display = "none"
            }}
        />
    )
}