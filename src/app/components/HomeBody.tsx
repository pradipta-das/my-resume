"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { animateSections } from "../utils/animateSections";
import { magnetic } from "../utils/magnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

/*
 * GSAP hooks used in the markup below. Every animation is scoped to the
 * <main> element, so these selectors never leak outside this component.
 * The shared ones (data-reveal, data-split, data-count, data-divider, ...)
 * and the border drawing are documented in utils/animateSections.
 *
 *   data-section="<name>"     one per section, use as a ScrollTrigger trigger
 *   data-sequence             the "Ideas become BLUEPRINTS become Experiences"
 *                             statement, played as a scroll-tied sequence
 *                             through its data-seq parts
 *   data-hero-image           wrapper for the hero parallax
 *   data-hero-letter          the hero "Hi!" (inner span, so GSAP transforms
 *                             don't fight the Tailwind centering translate)
 *   data-iceberg              iceberg frame: the tip is uncovered first, then
 *                             what lies below the waterline (tied to scroll)
 *   data-marquee              strip that loops its [data-marquee-track] upwards
 *   data-magnetic             link that leans towards the pointer (mouse only)
 */

// Waterline of the iceberg drawing, as a fraction of the image height.
const ICEBERG_WATERLINE = 0.52;

const STATS = [
  { value: 100, label: "Projects" },
  { value: 60, label: "Brands" },
  { value: 50, label: "Partners" },
];

export default function HomeBody() {
  const rootRef = useRef<HTMLElement | null>(null);

  // Section animations. Layout effect so the "from" states are applied before
  // the browser paints; mm.revert() undoes every tween and ScrollTrigger.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = rootRef.current!;

      // Shared reveals, headings, counters and border drawing.
      const undoSections = animateSections(root);

      // HERO
      gsap.from("[data-hero-letter]", {
        yPercent: 60,
        autoAlpha: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.to("[data-hero-image] img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // STATEMENT SEQUENCE, tied to scroll, in two steps:
      //   1. "Ideas become" slides in, then BLUEPRINTS scrambles into being.
      //   2. "Ideas become" slides out, BLUEPRINTS glides to the start of the
      //      second line and "become Experiences." slides in after it.
      // The two lines share one grid cell (.is-sequenced); without motion they
      // simply stack.
      const sequenced = gsap.utils.toArray<HTMLElement>("[data-sequence]");
      sequenced.forEach((el) => {
        const part = (name: string) => el.querySelector<HTMLElement>(`[data-seq='${name}']`)!;
        const [ideas, word, scramble, slot, experiences] = ["ideas", "blueprints", "scramble", "slot", "experiences"].map(part);

        el.classList.add("is-sequenced");
        gsap.set(scramble, { textContent: "" });

        // How far BLUEPRINTS travels to reach the slot, measured without any
        // transform it currently has (so it stays right after a resize).
        const offset = (axis: "x" | "y") => () => {
          const from = word.getBoundingClientRect();
          const to = slot.getBoundingClientRect();
          const current = Number(gsap.getProperty(word, axis));
          return axis === "x" ? to.left - (from.left - current) : to.top - (from.top - current);
        };

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          // Step 1
          .from(ideas, { x: -80, autoAlpha: 0, duration: 1 })
          .to(
            scramble,
            {
              duration: 1.6,
              ease: "none",
              scrambleText: { text: "BLUEPRINTS", chars: "upperCase", revealDelay: 0.5 },
            },
            "-=0.3",
          )
          .to({}, { duration: 0.8 }) // hold on "Ideas become BLUEPRINTS"
          // Step 2
          .to(ideas, { x: -80, autoAlpha: 0, duration: 0.8, ease: "power2.in" })
          .to(word, { x: offset("x"), y: offset("y"), duration: 1.2, ease: "power3.inOut" }, "-=0.4")
          .from(experiences, { x: 80, autoAlpha: 0, duration: 1 }, "-=0.6")
          .to({}, { duration: 0.6 }); // hold on "BLUEPRINTS become Experiences."
      });
      const undoSequence = () => sequenced.forEach((el) => el.classList.remove("is-sequenced"));

      // ICEBERG
      gsap.utils.toArray<HTMLElement>("[data-iceberg]").forEach((el) => {
        const img = el.querySelector("img")!;

        // Waterline as a percentage of the frame, allowing for the letterbox
        // that object-contain adds above and below the drawing.
        const waterline = () => {
          const ratio = (img.naturalHeight || 1049) / (img.naturalWidth || 1119);
          const height = Math.min(img.clientHeight, img.clientWidth * ratio);
          const top = (img.clientHeight - height) / 2;
          return ((top + height * ICEBERG_WATERLINE) / img.clientHeight) * 100;
        };

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            img,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: () => `inset(0% 0% ${100 - waterline()}% 0%)`,
              duration: 1,
              ease: "power2.out",
            },
          )
          .to(img, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" }, "+=0.4");
      });

      // PEOPLE STRIP
      // Two stacked copies scroll up by one copy's height and repeat, so the
      // loop is seamless. Paused while the strip is off screen.
      gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((el) => {
        const loop = gsap.to(el.querySelector("[data-marquee-track]"), {
          yPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      });

      return () => {
        undoSections();
        undoSequence();
      };
    });

    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () =>
      magnetic(rootRef.current!),
    );

    return () => mm.revert();
  }, []);

  return (
    <main ref={rootRef} className="page">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section data-section="hero" className="hero relative z-0 overflow-hidden">
        <div data-hero-image className="h-full w-full">
          <Image
            src="/hero-img.jpg"
            alt="Mountain landscape"
            width={1920}
            height={1000}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="image-cover"
          />
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-letter">
          <span data-hero-letter className="block">
            Hi!
          </span>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section data-section="intro" className="intro-grid">
        <div data-reveal="image" data-drift className="intro-image">
          <Image
            src="/img-1.png"
            alt="Coffee cup"
            width={1080}
            height={1349}
            sizes="(min-width: 640px) 40vw, 100vw"
            className="image-cover"
          />
        </div>

        <div className="intro-content">
          <div className="intro-title">
            {/* A tagline, not a heading: the page's h1 is the chapter heading below. */}
            <p data-split="words" className="display-title">
              Every remarkable website begins long before the first line of code.
            </p>
          </div>

          <div data-reveal="fade-up" className="content-block-large">
            <span className="eyebrow">Chapter I - The Seed</span>

            <h1 className="display-heading">
              What Fifteen Years as a Freelance Web Developer Taught Me About Ideas
            </h1>

            <p className="body-copy mt-4">
              Somewhere along the way, I noticed that the projects which went well rarely started
              with a design. They started with a conversation: someone explaining, a little unsure,
              what they wanted to change. The idea was small and unfinished, a seed rather than a
              plan, and that was exactly the right place to begin.
            </p>

            <p className="body-copy mt-3">
              Those conversations have taken me through most corners of the web: custom WordPress
              builds, Shopify stores, Next.js and React applications, Tailwind CSS interfaces, and
              the SQL and MySQL databases quietly holding it all together. The tools keep changing.
              The lesson hasn&apos;t: a good idea deserves patience before it gets pixels.
            </p>

            <Link href="/about" data-magnetic className="display-link link-redraw mt-4">
              The Longer Story
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          BLUEPRINT STATEMENT
      ====================================================== */}

      <section data-section="statement" className="statement">
        {/* Two lines sharing one spot (see the STATEMENT SEQUENCE effect):
            "Ideas become BLUEPRINTS", then "BLUEPRINTS become Experiences."
            The visible lines are decorative; the sr-only text reads once. */}
        <h2 data-sequence className="section-caption statement-sequence">
          <span className="sr-only">Ideas become blueprints. Blueprints become experiences.</span>

          <span aria-hidden="true" className="statement-line">
            <span data-seq="ideas" className="inline-block">
              Ideas become
            </span>{" "}
            {/* The invisible copy reserves the final width, so the centred line
                doesn't shift while the overlay scrambles through wider letters. */}
            <span data-seq="blueprints" className="text-brand relative inline-block">
              <span className="invisible">BLUEPRINTS</span>
              <span data-seq="scramble" className="absolute left-0 top-0 whitespace-nowrap">
                BLUEPRINTS
              </span>
            </span>
          </span>

          {/* The slot marks where BLUEPRINTS moves to for the second line. */}
          <span aria-hidden="true" className="statement-line">
            <span data-seq="slot" className="text-brand inline-block">
              BLUEPRINTS
            </span>{" "}
            <span data-seq="experiences" className="inline-block">
              become Experiences.
            </span>
          </span>
        </h2>
      </section>

      {/* =====================================================
          BLUEPRINT GRID
      ====================================================== */}

      <section data-section="blueprint" className="blueprint-grid">
        {/* LEFT COLUMN
            On mobile both columns flatten into one flow; the max-sm:order-*
            classes pair each image with the copy it illustrates. */}

        <div className="blueprint-left">
          <div data-reveal="fade-up" className="strategy-block max-sm:order-1">
            <span className="eyebrow">Chapter II - The Intent</span>

            <h2 className="display-heading">
              Why the Most Important Part of a Website Is the Part You Can&apos;t See
            </h2>

            <p className="body-copy mt-4">
              People often ask me for a new design. Usually what they are really after is a
              different outcome: more enquiries, a store that sells, a site their team isn&apos;t
              afraid to update. The design is the tip of the iceberg. The intent sits underneath it.
            </p>

            <p className="body-copy mt-3">
              So my first questions are rarely about colours. Who is this for? What should they feel,
              and what should they do next? The answers shape the information architecture, the
              user journeys, the content each page needs to be found in search, and the technical
              SEO that holds it all up. Get the intent right and the design almost suggests itself.
            </p>

            <Link href="/case-studies" data-magnetic className="display-link link-sweep mt-4">
              See It in Practice
            </Link>
          </div>

          <div className="purpose-row max-sm:order-3">
            <div className="purpose-block">
              <h3 data-split="words" className="purpose-title">
                Every movement <br />
                has a purpose.
              </h3>
            </div>

            <div data-reveal="image" data-drift className="image-block">
              <Image
                src="/img-2.png"
                alt="Creative structure"
                width={802}
                height={889}
                sizes="50vw"
                className="image-cover"
              />
            </div>
          </div>

          <div data-reveal="fade-up" className="content-block max-sm:order-6">
            <span className="eyebrow">Chapter IV - The Synapse</span>

            <h2 className="display-heading">
              Human Intelligence, Artificial Intelligence, and What Happens in Between
            </h2>

            <p className="body-copy mt-4">
              AI is remarkably good at the repetitive parts of web development: boilerplate, first
              drafts of tests, digging through documentation. What it can&apos;t do is sit with a
              client and hear what they didn&apos;t quite say. That part is still human, and I
              suspect it always will be.
            </p>

            <p className="body-copy mt-3">
              The interesting work happens where the two meet. I treat AI like a fast, eager junior
              colleague: helpful, occasionally wrong, always reviewed. The effect is less time
              typing and more time thinking about architecture, accessibility and the people who
              will use the site. Done this way, AI-assisted web development doesn&apos;t make a
              website feel less human. It leaves more room for the human parts.
            </p>

            <Link href="/cost-estimator" data-magnetic className="display-link link-sweep mt-4">
              Try the AI Estimator
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="blueprint-right">
          <div data-iceberg className="blueprint-image max-sm:order-2">
            <Image
              src="/iceberg-bg.jpg"
              alt="UX planning"
              width={1119}
              height={1049}
              // Contained in a 195px-tall box on phones, so it's drawn about 210px wide.
              sizes="(min-width: 640px) 50vw, 210px"
              className="image-contain"
            />
          </div>

          <div
            data-reveal="fade-up"
            className="content-block max-sm:order-4"
          >
            <span className="eyebrow">Chapter III - The Process</span>

            <h2 className="display-heading">
              From Discovery to Deployment, the Unglamorous Way
            </h2>

            <p className="body-copy mt-4">
              My process isn&apos;t a secret, and it isn&apos;t clever. Listen first. Sketch the
              structure before the screens. Choose the platform last, once the problem is clear:
              WordPress when content leads, Shopify when products do, Next.js and Tailwind CSS when
              the experience needs to be custom and fast.
            </p>

            <p className="body-copy mt-3">
              Then build in small, visible steps, test on real devices, measure page speed honestly,
              and launch only when it&apos;s ready. Most website problems I&apos;ve been asked to
              untangle trace back to a step someone skipped. Skipping them has never saved anyone
              time.
            </p>

            <Link href="/case-studies" data-magnetic className="display-link link-sweep mt-4">
              Explore Cases
            </Link>
          </div>

          {/* HUMAN + AI */}

          <div className="human-ai max-sm:order-5 max-sm:border-t max-sm:border-black">
            <div className="human-ai-title">
              <h3 data-split="scrub">
                Human creativity
                <br />
                +
                <br />
                Artificial intelligence
                <br />
                =
                <br />
                Better together.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      <section data-section="success" className="success-grid">
        <div className="success-people">
          <div data-reveal="image" data-marquee className="people-list">
            <div className="people-frame">
              {/* Invisible sizer keeps the strip's original footprint. */}
              <Image
                src="/img-4.png"
                alt=""
                aria-hidden="true"
                width={232}
                height={730}
                className="image-cover invisible"
              />

              {/* Each copy stops at the strip's last separator, cutting off the
                  partial face below it, so the loop's seam lands on a line
                  rather than between two half faces. */}
              <div data-marquee-track className="people-track">
                <div className="people-copy">
                  <Image
                    src="/img-4.png"
                    alt="Illustrated faces standing in for the clients I've worked with"
                    width={232}
                    height={730}
                  />
                </div>
                <div className="people-copy" aria-hidden="true">
                  <Image src="/img-4.png" alt="" width={232} height={730} />
                </div>
              </div>
            </div>
          </div>

          <div className="success-title">
            <h3 data-split="words">
              Success isn&apos;t <br />
              measured in <br />
              projects. <br />
              It&apos;s measured <br />
              in trust.
            </h3>
          </div>
        </div>

        <div data-reveal="fade-up" className="partnership">
          <span className="eyebrow">Chapter V - The X-Factor</span>

          <h2 className="display-heading">The Real X-Factor Has Always Been the People</h2>

          <p className="body-copy mt-4">
            You&apos;ll notice the faces here are drawn, not photographed. Many of the people I
            build for, founders, marketing teams and agencies who bring me in behind the scenes,
            would rather stay out of a stranger&apos;s portfolio. I respect that, so these sketches
            stand in for them. Discretion is part of the job.
          </p>

          <p className="body-copy mt-3">
            If fifteen years have taught me anything, it&apos;s that the code is rarely the hardest
            part of web development. Understanding the person on the other side of the call is.
            Many clients have stayed for years, through redesigns, platform migrations and new
            ideas. That&apos;s simply what happens when people feel heard, and when the advice is
            honest even if it&apos;s the simpler, cheaper option.
          </p>

          <Link href="/case-studies" data-magnetic className="display-link link-sweep mt-4">
            Read Their Stories
          </Link>
        </div>
      </section>

      {/* =====================================================
          CLOSING STATEMENT
      ====================================================== */}

      <section data-section="closing" className="statement">
        <h2 data-split="words" className="section-caption">
          Every story begins...with a blank page.
        </h2>
      </section>

      {/* =====================================================
          METRICS
      ====================================================== */}

      <section data-section="metrics" className="metrics-grid">
        <div className="metrics-content">
          <div data-reveal="fade-up" className="content-block">
            <span className="eyebrow">Chapter VI - The Chronicles</span>

            <h2 className="display-heading">Every Project Leaves a Story Behind</h2>

            <p className="body-copy mt-4">
              A hundred-odd projects, sixty brands and fifty partners later, the chronicles are
              mostly made of small moments: an online store that finally felt effortless, a
              WordPress site a team could update without calling anyone, a page that went from slow
              to instant.
            </p>

            <p className="body-copy mt-3">
              I write some of those lessons down in{" "}
              <Link href="/blog" className="underline underline-offset-2">
                The Journal
              </Link>
              . And if you&apos;re carrying a story of your own, half-formed or fully planned, I&apos;m
              always happy to listen. No pitch, just a conversation.
            </p>

            <Link href="/free-consultation" data-magnetic className="display-link link-sweep mt-4">
              Start a Conversation
            </Link>
          </div>

          <div className="stats">
            {STATS.map((stat) => (
              <div key={stat.label} data-divider className="stat last:before:hidden">
                <div className="stat-number">
                  <span data-count>{stat.value}</span>
                  <sup>+</sup>
                </div>

                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal="image" data-drift className="metrics-image">
          <Image
            src="/metrics-image.png"
            alt="Creative professional"
            width={811}
            height={666}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="image-cover"
          />
        </div>
      </section>
    </main>
  );
}
