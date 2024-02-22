import { Icons } from "@/components/icons";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Section } from "@/components/section";
import { images } from "@/lib/image";
import Image from "next/image";
import Link from "next/link";
const sections = [
  { text: "Let's make our way to the page's end.", image: images.bear2 },
  { text: "Remember, we're starting from the very top.", image: images.bear },
  {
    text: 'Thus, a "back to top" feature isn\'t immediately necessary.',
    image: images.camera,
  },
  { text: "Heading deeper and deeper.", image: images.chick },
  {
    text: "Quite the journey with all this scrolling, isn't it?",
    image: images.down,
  },
  {
    text: "The payoff for this scroll had better be significant.",
    image: images.elevator,
  },
  {
    text: "Returning to the top seems like it'll be a lengthy endeavor.",
    image: images.hedhehog,
  },
  { text: "Wishing for a simpler method to ascend...", image: images.kitty },
  {
    text: "...one that's not only efficient but also entertaining.",
    image: images.rose,
  },
  {
    text: 'I prefer to think of "back to top" options as elevators...',
    image: images.sun,
  },
  {
    text: "...and they ought to mimic the real experience more closely.",
    image: images.down,
  },
  {
    text: "Finally, we've reached our destination... go ahead and activate that elevator!",
    image: images.elevator,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center">
      <div className="flex flex-col items-center gap-8 py-28">
        <h1 className="flex items-baseline gap-5 text-center text-7xl font-bold tracking-[1px]">
          <p className="relative">
            <Link
              href={"https://tholman.com/elevator.js/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.linkOpen className="text-primary absolute right-0 top-[-10px] scale-75 text-xs" />
            </Link>
            Elevator.js
          </p>
          <span className="text-sm">(as a react hook)</span>
        </h1>
        <p className="text-center text-xl font-medium leading-[1]">
          Elevator.js fixes those awkward &rdquo;scroll to top&rdquo; moments
          the old fashioned way.
        </p>
        <div className="flex justify-center">
          <p>By Bilal Mansuri</p>
        </div>
      </div>
      {sections.map((item, index) => {
        return (
          <Section key={index} id={index} text={item.text} image={item.image} />
        );
      })}
      <ScrollToTop />
    </main>
  );
}
