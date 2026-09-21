import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "Who can join?",
    a: "Sapex is a public app and free to use.",
  },
  {
    q: "Can my school get a private version?",
    a: "Yes. Email us if you want a closed community for your campus.",
  },
  {
    q: "What does the app include?",
    a: "Academic Center, Rate Your Chance, Wellness Support, Study Rooms, and Origins Lab.",
  },
  {
    q: "Is privacy guaranteed?",
    a: "No. We try to keep accounts and chats protected, but no system is risk-free.",
  },
  {
    q: "Where is data stored?",
    a: "On Google infrastructure. Breaches are unlikely; they are not impossible.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="ruled mb-12">
          <div className="ruled-margin">faq</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">Common questions</h1>
          </div>
        </header>

        <div>
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className={`group border-t border-rule py-4 ${
                i === FAQS.length - 1 ? "border-b" : ""
              }`}
            >
              <summary className="cursor-pointer list-none font-display text-[17px] text-chalk">
                {item.q}
              </summary>
              <p className="measure mt-2 text-sm leading-relaxed text-chalk-2">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-5">
          <Button asChild variant="outline">
            <Link to="/terms">Terms</Link>
          </Button>
          <Button asChild variant="link" className="px-0">
            <a href="mailto:sapex@aisct.org?subject=Sapex%20FAQ%20question">
              Email us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
