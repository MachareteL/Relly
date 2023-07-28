import type { NextPage } from "next";
import {
  ComputerDesktopIcon,
  PaintBrushIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";


const features = [
  {
    name: "Styling",
    description:
      "It's made using TailwindCSS and all components from its website. most part of it I've myself but some components or pages I took from tailwindUI",
    icon: PaintBrushIcon,
  },
  {
    name: "The Coding",
    description:
      "Motivated by T3Stack docs I took some time searching on youtube T3Stack tutorials and I found 'Web Dev Simplified' Youtube channel who made a twitter clone tutorial which was my core learning source",
    icon: ComputerDesktopIcon,
  },
  {
    name: "Learning Path",
    description:
      "I advise to everyone who wants to become a programmer to keep on track, studying as much as possible the achieve your goals, we're the only responsible the turn ours dreams real",
    icon: PlusIcon,
  },
  {
    name: "My goal",
    description:
      "Right now I want to publish my own projects like this one whenever its possible. I love to learn new high tech stuff and to meet people as passionate as me about technology. And why not sell it to people who actually could take benefit of it",
    icon: StarIcon,
  },
];

const About: NextPage = ({}) => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            What is Relly?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
            A Side-Project targeting{" "}
            <Link
              className="italic text-indigo-600"
              href={"https://github.com/MachareteL"}
            >
              help me
            </Link>{" "}
            develop typescript and TRPc habilites
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            I&apos;m Lucas, 20yo, and I study development. Relly is a social media
            where you spend or earn <i className="text-gray-400">Rellys</i> w/
            the interaction of other people&apos;s posts.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-indigo-500">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default About;
