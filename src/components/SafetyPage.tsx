import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SAFETY_ITEMS = [
  {
    title: "Public access",
    copy: "Anyone can join with supported sign-in.",
  },
  {
    title: "Reporting",
    copy: "Flag a concern and it goes to people who can review it.",
  },
  {
    title: "What we can promise",
    copy: "We protect chats and accounts with the safeguards we have. Absolute privacy cannot be guaranteed.",
  },
] as const;

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="ruled mb-12">
          <div className="ruled-margin">safety</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">A public app, with controls</h1>
            <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
              Open and free, with reporting, moderation, and an honest note
              about what no product can guarantee.
            </p>
          </div>
        </header>

        <ul>
          {SAFETY_ITEMS.map(({ title, copy }, i) => (
            <li
              key={title}
              className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8 ${
                i === 0 ? "border-t border-rule" : "border-t border-rule"
              }`}
            >
              <span className="font-display text-[17px] text-chalk sm:w-44 sm:shrink-0">
                {title}
              </span>
              <span className="measure text-sm leading-relaxed text-chalk-2">
                {copy}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-rule pt-10">
          <h2 className="display-3 text-chalk">Need a private campus?</h2>
          <p className="measure mt-3 text-sm text-chalk-2">
            We can set up a closed version for your school community.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button asChild>
              <Link to="/login">Open Sapex</Link>
            </Button>
            <Button asChild variant="link" className="px-0">
              <a href="mailto:sapex@aisct.org?subject=Sapex%20safety%20question">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
