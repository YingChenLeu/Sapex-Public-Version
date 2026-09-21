import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AcademicHubDemo,
  RateYourChanceDemo,
  StudyRoomsDemo,
  WellnessDemo,
} from "./ui/FeatureShowcase";

const FEATURES = [
  {
    margin: "academic center",
    title: "Ask a question. Get an answer tonight.",
    copy: "Peers in your year pick up the problem — math notation, files, and a live thread.",
    Demo: AcademicHubDemo,
  },
  {
    margin: "rate your chance",
    title: "An anonymous reading room.",
    copy: "Post a college snapshot. Readers stamp Reach, Target, Likely, or Safety and leave a note.",
    Demo: RateYourChanceDemo,
  },
  {
    margin: "wellness",
    title: "A matched peer when it gets heavy.",
    copy: "Private chats with a student helper whose temperament fits what you’re going through.",
    Demo: WellnessDemo,
  },
  {
    margin: "study rooms",
    title: "Work alongside people.",
    copy: "Open a room around a subject or project and stay accountable.",
    Demo: StudyRoomsDemo,
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-board pt-28 pb-20 text-chalk">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="ruled mb-16">
          <div className="ruled-margin">features</div>
          <div className="ruled-body">
            <h1 className="display-2 text-chalk">What’s inside the app</h1>
            <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
              Free public access. A private school community is available if
              you ask.
            </p>
          </div>
        </header>

        <div className="space-y-16">
          {FEATURES.map(({ margin, title, copy, Demo }) => (
            <section key={margin} className="ruled border-t border-rule pt-10">
              <div className="ruled-margin">{margin}</div>
              <div className="ruled-body">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
                  <div>
                    <h2 className="display-3 text-chalk">{title}</h2>
                    <p className="measure mt-4 text-sm leading-relaxed text-chalk-2">
                      {copy}
                    </p>
                  </div>
                  <div className="flex justify-center lg:justify-end">
                    <Demo />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-rule pt-10">
          <h2 className="display-3 text-chalk">Ready to open it?</h2>
          <p className="measure mt-3 text-sm text-chalk-2">
            Sign in and pick a space. Schools that want a closed campus can
            email us.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button asChild>
              <Link to="/login">Open Sapex</Link>
            </Button>
            <Button asChild variant="link" className="px-0">
              <a href="mailto:sapex@aisct.org?subject=Sapex%20features%20question">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
