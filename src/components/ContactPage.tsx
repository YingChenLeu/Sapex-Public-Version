const CONTACT_OPTIONS = [
  {
    title: "General",
    description: "Questions about the public app.",
    subject: "Sapex%20general%20inquiry",
  },
  {
    title: "Private school version",
    description: "Ask for a closed campus community.",
    subject: "Bring%20Sapex%20to%20our%20school",
  },
  {
    title: "Support",
    description: "Help with sign-in or using a space.",
    subject: "Sapex%20support",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="ruled mb-12">
          <div className="ruled-margin">contact</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">Talk to the team</h1>
            <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
              The public app is free. Write if you want a private school
              version, or if something’s broken.
            </p>
          </div>
        </header>

        <ul>
          {CONTACT_OPTIONS.map(({ title, description, subject }, i) => (
            <li key={title} className="border-t border-rule">
              <a
                href={`mailto:sapex@aisct.org?subject=${subject}`}
                className={`flex flex-col gap-1 py-4 transition-colors hover:text-sage sm:flex-row sm:items-baseline sm:gap-8 ${
                  i === CONTACT_OPTIONS.length - 1 ? "border-b border-rule" : ""
                }`}
              >
                <span className="font-display text-[17px] text-chalk sm:w-52 sm:shrink-0">
                  {title}
                </span>
                <span className="text-sm leading-relaxed text-chalk-2">
                  {description}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-display text-[17px] text-chalk">
          sapex@aisct.org
        </p>
      </div>
    </div>
  );
}
