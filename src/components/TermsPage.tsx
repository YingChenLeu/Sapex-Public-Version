const TERMS = [
  {
    title: "Public and free",
    text: "Sapex is offered as a public app and is free to use.",
  },
  {
    title: "Private school version",
    text: "If you want a closed community for your campus, write to sapex@aisct.org.",
  },
  {
    title: "Privacy",
    text: "Privacy is not guaranteed. We attempt to keep information protected with reasonable safeguards.",
  },
  {
    title: "Data storage",
    text: "Information is stored on Google infrastructure. No system can be guaranteed risk-free.",
  },
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="ruled mb-12">
          <div className="ruled-margin">terms</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">Sapex terms</h1>
            <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
              Read these before using the app.
            </p>
          </div>
        </header>

        <ul>
          {TERMS.map(({ title, text }, i) => (
            <li
              key={title}
              className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8 ${
                i === 0 ? "border-t border-rule" : "border-t border-rule"
              } ${i === TERMS.length - 1 ? "border-b border-rule" : ""}`}
            >
              <span className="font-display text-[17px] text-chalk sm:w-48 sm:shrink-0">
                {title}
              </span>
              <span className="measure text-sm leading-relaxed text-chalk-2">
                {text}
              </span>
            </li>
          ))}
        </ul>

        <p className="measure mt-10 text-sm text-chalk-3">
          By continuing to use Sapex, you acknowledge these terms, including
          that privacy cannot be absolutely guaranteed. Questions:{" "}
          <a
            href="mailto:sapex@aisct.org?subject=Sapex%20terms%20question"
            className="text-sage underline decoration-sage/35 underline-offset-4 hover:decoration-sage"
          >
            sapex@aisct.org
          </a>
          .
        </p>
      </div>
    </div>
  );
}
