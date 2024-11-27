import { SectionTeaser } from "../_components/SectionTeaser.tsx";
import { EmbedVideo } from "../_components/EmbedVideo.tsx";
import { SubNavigation } from "../_components/SubNavigation.tsx";

export default function LandingPage() {
  return (
        <>
        <SubNavigation active="learn" />
    <main
      id="content"
      className="w-full flex flex-col px-8 pt-6 mt-16 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-20"
    >
      <div className="pb-16 align-middle md:pb-0 w-full">
        <div className="mt-8 mb-16 md:mb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">
            Learn Deno
          </h1>
          <p className="max-w-prose mx-auto">
            Tutorials, videos and example code to help you go from Deno beginner
            to Deno expert.
          </p>
        </div>
        <div className="align-middle flex items-center gap-8 mb-20">
          <div className="flex-1">
            <EmbedVideo id="H8VLifMOBHU" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-semibold ">What is Deno?</h2>
            <p className="my-4">
              Deno, is an open-source runtime for TypeScript and JavaScript.
              Features built-in dev tools, powerful platform APIs, and native
              support for TypeScript and JSX. In this video we'll introduce Deno
              and its core concepts.
            </p>
            <p>
              <a className="homepage-link runtime-link" href="/learn/videos/">
                Watch the getting started video series
              </a>
            </p>
          </div>
          <div className="align-middle flex items-center gap-8 mb-20">
            <div className="flex-1">
              <EmbedVideo id="H8VLifMOBHU" />
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold ">What is Deno?</h2>
              <p className="my-4">
                Deno, is an open-source runtime for TypeScript and JavaScript.
                Features built-in dev tools, powerful platform APIs, and native
                support for TypeScript and JSX. In this video we'll introduce
                Deno and its core concepts
              </p>
              <p>
                <a className="homepage-link runtime-link" href="/learn/video/">
                  Watch the getting started video series
                </a>
              </p>
            </div>
          </div>
          <h2 className="text-3xl mt-20 mb-8 font-semibold text-center">
            How do you like to learn?
          </h2>
          <div className="align-middle flex flex-row gap-8 mb-20">
            <div className="flex-1">
              <SectionTeaser
                title="By example"
                text="Our examples section holds a collection of annotated Deno examples, to be used as a reference for how to build with Deno, or as a guide to learn about many of Deno's features."
                link="/learn/examples/"
                cta="Explore the examples"
              />
            </div>
            <div className="flex-1">
              <SectionTeaser
                title="With video"
                text="Explore our playlists of videos curated to guide you through getting the best out of using Deno for your development projects."
                link="/learn/videos/"
                cta="Explore the videos"
              />
            </div>
            <div className="flex-1">
              <SectionTeaser
                title="Through tutorials"
                text="Explore our playlists of videos curated to guide you through getting the best out of using Deno for your development projects."
                link="/learn/tutorials/"
                cta="Explore the tutorials"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
