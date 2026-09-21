import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OFFER = [
  {
    title: "Use it today",
    copy: "Students can open the public app for free, right now.",
  },
  {
    title: "Ask for a private version",
    copy: "We’ll set up a closed community for your campus if that’s what you need.",
  },
  {
    title: "Keep the same tools",
    copy: "Academic help, Rate Your Chance, wellness, and study rooms stay in one place.",
  },
] as const;

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="ruled mb-12">
          <div className="ruled-margin">for schools</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">Bring Sapex to campus</h1>
            <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
              The public app is free. A private school version exists if you
              want the community limited to your students.
            </p>
          </div>
        </header>

        <ul>
          {OFFER.map(({ title, copy }, i) => (
            <li
              key={title}
              className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8 ${
                i === 0 ? "border-t border-rule" : "border-t border-rule"
              }`}
            >
              <span className="font-display text-[17px] text-chalk sm:w-56 sm:shrink-0">
                {title}
              </span>
              <span className="measure text-sm leading-relaxed text-chalk-2">
                {copy}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-rule pt-10">
          <h2 className="display-3 text-chalk">Want a closed community?</h2>
          <p className="measure mt-3 text-sm text-chalk-2">
            Tell us the school, city, and who should run it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button asChild variant="brass">
              <a href="mailto:sapex@aisct.org?subject=Bring%20Sapex%20to%20our%20school">
                Email about a private version
              </a>
            </Button>
            <Button asChild variant="link" className="px-0">
              <Link to="/login">Open the public app</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
