"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { animateSections } from "../utils/animateSections";
import { magnetic } from "../utils/magnetic";
import type { Audience } from "../lib/consultation/schema";
import { trackLead } from "../lib/analytics";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   FIELD HELPERS
========================================================= */

type OptionItem = [value: string, title: string, description: string];

function OptionCards({ name, items, className }: { name: string; items: OptionItem[]; className: string }) {
  return (
    <div className={className}>
      {items.map(([value, title, description]) => (
        <label key={value} className="estimate-option">
          <input className="sr-only" type="radio" name={name} value={value} />
          <span className="estimate-option-content">
            <strong className="estimate-option-title">{title}</strong>
            <small className="estimate-option-description">{description}</small>
          </span>
        </label>
      ))}
    </div>
  );
}

function PillOptions({
  name,
  items,
  className,
  type = "radio",
}: {
  name: string;
  items: string[];
  className: string;
  type?: "radio" | "checkbox";
}) {
  return (
    <div className={className}>
      {items.map((item) => (
        <label key={item} className="estimate-pill">
          <input className="sr-only" type={type} name={name} value={item} />
          <span className="estimate-pill-content">{item}</span>
        </label>
      ))}
    </div>
  );
}

/* =========================================================
   STEPS
   The second step depends on who's asking: people get
   questions about their project, agencies about their studio.
========================================================= */

function IndividualStep() {
  return (
    <>
      <p className="estimate-question">What would you like to talk about?</p>
      <PillOptions
        type="checkbox"
        name="topics[]"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        items={[
          "A brand new website",
          "Redesigning my current site",
          "An online shop",
          "A web app or product idea",
          "Speed, SEO or fixing what's broken",
          "Honestly, I'm just exploring",
        ]}
      />

      <div className="mt-5">
        <p className="estimate-question">Where are you with it?</p>
        <PillOptions
          name="stage"
          className="grid grid-cols-2 gap-3"
          items={["Just an idea for now", "Planning it out", "Ready to get started", "Already underway"]}
        />
      </div>

      <div className="mt-5">
        <label className="estimate-label" htmlFor="websiteUrl">
          Got a website already? (optional)
        </label>
        <input id="websiteUrl" name="website_url" type="url" placeholder="https://example.com" className="estimate-input" />
      </div>
    </>
  );
}

function AgencyStep() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="estimate-label" htmlFor="agencyName">
            Agency name
          </label>
          <input id="agencyName" name="agency_name" type="text" autoComplete="organization" className="estimate-input" />
        </div>
        <div>
          <label className="estimate-label" htmlFor="agencyWebsite">
            Agency website
          </label>
          <input id="agencyWebsite" name="agency_website" type="url" placeholder="https://" className="estimate-input" />
        </div>
      </div>

      <div className="mt-5">
        <p className="estimate-question">How big is the team?</p>
        <PillOptions
          name="agency_size"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          items={["Just a few of us", "5–15 people", "16–50 people", "50+ people"]}
        />
      </div>

      <div className="mt-5">
        <p className="estimate-question">How could I help?</p>
        <PillOptions
          type="checkbox"
          name="agency_help[]"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          items={[
            "White-label development",
            "Extra hands on busy weeks",
            "Next.js / React builds",
            "WordPress builds",
            "Animation & interaction",
            "Technical advice for a pitch",
          ]}
        />
      </div>

      <div className="mt-5">
        <p className="estimate-question">How often might you need me?</p>
        <PillOptions
          name="agency_frequency"
          className="grid grid-cols-2 gap-3"
          items={["One project in mind", "A few projects a year", "Something ongoing", "Not sure yet"]}
        />
      </div>
    </>
  );
}

type Step = { sideLabel: string; cardTitle: string; title: string; helper: string; content: React.ReactNode };

function buildSteps(audience: Audience | null): Step[] {
  const isAgency = audience === "Agency";

  return [
    {
      sideLabel: "Hello",
      cardTitle: "First, a quick hello",
      title: "Who am I talking to?",
      helper: "I work with people building something of their own and with agencies who need a hand. Both are very welcome.",
      content: (
        <OptionCards
          name="audience"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          items={[
            ["Individual", "I have a project", "A founder, business owner, or someone with an idea worth building."],
            ["Agency", "I'm with an agency", "A studio or agency looking for a reliable development partner."],
          ]}
        />
      ),
    },
    isAgency
      ? {
          sideLabel: "Your Agency",
          cardTitle: "Tell me about your studio",
          title: "Tell me about your agency.",
          helper: "Just enough for me to understand how you work and where I might fit in.",
          content: <AgencyStep />,
        }
      : {
          sideLabel: "Your Project",
          cardTitle: "What's on your mind?",
          title: "What's on your mind?",
          helper: "Pick whatever feels close. Rough ideas are completely fine. That's what the call is for.",
          content: <IndividualStep />,
        },
    {
      sideLabel: "Your Story",
      cardTitle: "In your own words",
      title: "Tell me a little more.",
      helper: isAgency
        ? "A client brief, a deadline that's keeping you up at night, a stack you're weighing up. Whatever's useful for me to know before we talk."
        : "What you're hoping for, what's been frustrating, what success would look like. A few sentences is plenty.",
      content: (
        <>
          <label className="estimate-label" htmlFor="message">
            Your message (optional, but it helps me come prepared)
          </label>
          <textarea
            id="message"
            name="message"
            rows={7}
            maxLength={2000}
            placeholder={
              isAgency
                ? "We've got a client launching in March and need…"
                : "I've been thinking about…"
            }
            className="estimate-input consult-textarea"
          />
          <p className="estimate-microcopy">Don&apos;t worry about getting it perfect. I&apos;ll ask the right questions.</p>
        </>
      ),
    },
    {
      sideLabel: "The Time",
      cardTitle: "When suits you?",
      title: "When suits you best?",
      helper: "Give me a rough idea and I'll suggest a few times that work for you.",
      content: (
        <>
          <p className="estimate-question">How would you like to talk?</p>
          <OptionCards
            name="call_format"
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            items={[
              ["Video call", "Video call", "Google Meet or Zoom. Cameras optional."],
              ["Phone call", "Phone call", "Old-fashioned, and perfectly good."],
              ["Either", "Either is fine", "Whatever's easiest on the day."],
            ]}
          />

          <div className="mt-5">
            <p className="estimate-question">Which days work?</p>
            <PillOptions
              type="checkbox"
              name="days[]"
              className="grid grid-cols-3 gap-3 sm:grid-cols-6"
              items={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            />
          </div>

          <div className="mt-5">
            <p className="estimate-question">What time of day?</p>
            <PillOptions
              type="checkbox"
              name="times[]"
              className="grid grid-cols-3 gap-3"
              items={["Morning", "Afternoon", "Evening"]}
            />
          </div>

          <div className="mt-5">
            <label className="estimate-label" htmlFor="timezone">
              Your time zone
            </label>
            <input id="timezone" name="timezone" type="text" className="estimate-input" placeholder="e.g. Europe/London" />
            <p className="estimate-microcopy">I&apos;ve guessed this from your browser. Change it if I&apos;m wrong.</p>
          </div>
        </>
      ),
    },
    {
      sideLabel: "Your Details",
      cardTitle: "Where can I reach you?",
      title: "Lovely. Where can I reach you?",
      helper: "I'll email you personally to confirm a time. No automated sequences, no sales team.",
      content: (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="estimate-label" htmlFor="name">
                Your name
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" className="estimate-input" />
            </div>
            <div>
              <label className="estimate-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={isAgency ? "you@agency.com" : "you@example.com"}
                className="estimate-input"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="estimate-label" htmlFor="phone">
              Phone number (optional, handy if you&apos;d prefer a call)
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="estimate-input" />
          </div>

          {/* Opt-in only: unticked by default and separate from the call. */}
          <label className="estimate-consent">
            <input type="checkbox" name="marketing_consent" value="yes" className="mt-0.5 h-4 w-4 shrink-0 accent-black" />
            <span>Send me the occasional note with insights, project tips and offers. I can unsubscribe at any time.</span>
          </label>

          <p className="estimate-microcopy">
            Without the tick, I&apos;ll only use your details to arrange our call. See the{" "}
            <Link href="/privacy-policy" target="_blank" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>

          {/* Honeypot: off screen and skipped by keyboard and autofill; bots fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Leave this empty
              <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </>
      ),
    },
  ];
}

const STEP_COUNT = buildSteps(null).length;
const LAST_STEP = STEP_COUNT - 1;

// Collects the form into plain values; "name[]" checkboxes become arrays.
function readForm(form: HTMLFormElement): Record<string, string | string[]> {
  const data: Record<string, string | string[]> = {};
  new FormData(form).forEach((value, key) => {
    if (key.endsWith("[]")) {
      const name = key.slice(0, -2);
      data[name] = [...((data[name] as string[] | undefined) ?? []), String(value)];
    } else {
      data[key] = String(value).trim();
    }
  });
  return data;
}

// What the thank-you screen repeats back.
type Booked = { firstName: string; email: string; format: string; when: string };

/* =========================================================
   PAGE
========================================================= */

export default function ConsultationForm() {
  const rootRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardBodyRef = useRef<HTMLDivElement | null>(null);
  const thanksRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [booked, setBooked] = useState<Booked | null>(null);
  // Bumping the key remounts the form, clearing every input and step state.
  const [formKey, setFormKey] = useState<number>(0);

  const steps = buildSteps(audience);

  const goToStep = (index: number) => {
    setStepError(null);
    setCurrentStep(Math.max(0, Math.min(LAST_STEP, index)));
    cardBodyRef.current?.scrollTo({ top: 0 });
  };

  // The few answers a step can't do without; returns what to tell the visitor.
  const checkStep = (index: number): string | null => {
    const form = formRef.current;
    if (!form) return null;

    if (index === 0 && !audience) return "Pick one of the two so I know who I'm talking to.";

    if (index === LAST_STEP) {
      const name = form.elements.namedItem("name") as HTMLInputElement;
      const email = form.elements.namedItem("email") as HTMLInputElement;
      if (!name.value.trim()) {
        name.focus();
        return "Please tell me your name.";
      }
      if (!email.value.trim() || !email.validity.valid) {
        email.focus();
        return "Please enter a valid email address so I can reply.";
      }
    }
    return null;
  };

  const next = () => {
    const problem = checkStep(currentStep);
    if (problem) setStepError(problem);
    else goToStep(currentStep + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Enter in a text field submits implicitly — treat it as "Next" until the last step.
    if (currentStep < LAST_STEP) {
      next();
      return;
    }
    if (isSubmitting) return;

    const problem = checkStep(LAST_STEP);
    if (problem) {
      setStepError(problem);
      return;
    }

    const { audience: who, name, email, phone, marketing_consent, hp_field, ...answers } = readForm(event.currentTarget);

    setStepError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: who,
          name,
          email,
          phone,
          marketingConsent: marketing_consent === "yes",
          answers,
          honeypot: hp_field,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStepError(result.error ?? "Your request didn't go through this time. Please try again.");
        return;
      }

      // "Tue or Thu", "Mon, Wed or Fri"
      const either = (value: string | string[] | undefined) =>
        Array.isArray(value) && value.length > 0
          ? value.length === 1 ? value[0] : `${value.slice(0, -1).join(", ")} or ${value.at(-1)}`
          : "";
      const days = either(answers.days);
      const times = either(answers.times).toLowerCase();
      const when = [days && `on ${days}`, times && `in the ${times}`].filter(Boolean).join(" ");

      trackLead("free_consultation");
      setBooked({
        firstName: String(name).split(/\s+/)[0],
        email: String(email),
        format: typeof answers.call_format === "string" && answers.call_format !== "Either" ? answers.call_format.toLowerCase() : "call",
        when,
      });
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      setStepError("I couldn't send that. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAgain = () => {
    setFormKey((key) => key + 1);
    setAudience(null);
    setCurrentStep(0);
    setBooked(null);
    setStepError(null);
  };

  // Suggest the visitor's time zone from their browser, on every fresh form.
  useEffect(() => {
    const input = formRef.current?.elements.namedItem("timezone") as HTMLInputElement | null;
    if (input && !input.value) input.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  }, [formKey]);

  // Page animations (see utils/animateSections for the data attributes).
  // The form panel is marked data-static-borders: its borders react to hover
  // and selection, so they aren't drawn in.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add("(prefers-reduced-motion: no-preference)", () => animateSections(rootRef.current!));
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () =>
      magnetic(rootRef.current!),
    );
    return () => mm.revert();
  }, []);

  // The step that just became active eases in. Comparing with the previous
  // step skips the first render (and React's dev double-run of effects).
  const shownStep = useRef(currentStep);
  useEffect(() => {
    if (shownStep.current === currentStep) return;
    shownStep.current = currentStep;
    if (prefersReducedMotion()) return;

    const section = cardBodyRef.current?.querySelectorAll("form > section")[currentStep];
    if (!section) return;

    const tween = gsap.from(section.children, {
      y: 16,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
    });
    return () => {
      tween.revert();
    };
  }, [currentStep]);

  // Thank-you screen: the tick pops in, then the text follows.
  const isBooked = booked !== null;
  useEffect(() => {
    const thanks = thanksRef.current;
    if (!isBooked || !thanks || prefersReducedMotion()) return;

    const [tick, ...rest] = Array.from(thanks.children);
    const tl = gsap
      .timeline()
      .from(tick, { scale: 0, duration: 0.6, ease: "back.out(2)" })
      .from(rest, { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.3");
    return () => {
      tl.revert();
    };
  }, [isBooked]);

  return (
    <main ref={rootRef} className="page">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="estimator-hero">
        <span data-reveal="fade-up" className="eyebrow">
          Free consultation call
        </span>

        <h1 data-split="words" className="estimator-hero-title">
          Let&apos;s talk about what you&apos;re building.
        </h1>

        <div data-reveal="fade-up" className="consult-hero-body">
          <p className="body-copy max-w-[520px]">
            Pour yourself a coffee and tell me about your idea. No sales pitch, no jargon. Just an honest
            conversation about where you are and what might help.
          </p>
          <a href="#consultationForm" data-magnetic className="display-link link-redraw">
            Book My Free Call
          </a>
        </div>
      </section>

      {/* =====================================================
          THE CALL
      ====================================================== */}

      <section className="estimator-grid">
        <div data-reveal="image" data-drift className="estimator-cell consult-photo">
          <Image
            src="/img-1.png"
            alt="A cup of coffee on a wooden table"
            width={1080}
            height={1349}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="eager"
            className="image-cover"
          />
        </div>

        <div className="content-block-large flex flex-col justify-between gap-10">
          <div>
            <span data-reveal="fade-up" className="eyebrow">
              The Call
            </span>

            <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
              Thirty minutes. Just the two of us.
            </h2>

            <h3 data-reveal="fade-up" className="display-heading mt-6">
              No pitch. No pressure.
            </h3>
          </div>

          <blockquote data-split="words" className="estimator-quote">
            &ldquo;I&apos;d rather tell you what you actually need than sell you something you don&apos;t.&rdquo;
          </blockquote>

          <div>
            <ul data-reveal="stagger" className="estimator-risks">
              <li data-divider>Listen</li>
              <li data-divider>Untangle</li>
              <li data-divider>Plan</li>
            </ul>

            <p data-reveal="fade-up" className="body-copy mt-6 max-w-[520px]">
              I&apos;ll listen to where you are, help untangle what&apos;s been getting in the way, and leave you with
              clear next steps, whether or not we end up working together.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO IT'S FOR
      ====================================================== */}

      <section className="estimator-grid">
        <div className="estimator-cell content-block-large">
          <span data-reveal="fade-up" className="eyebrow">
            For People With An Idea
          </span>

          <h3 data-split="words" className="display-heading">
            Founders, business owners and the quietly ambitious.
          </h3>

          <p data-reveal="fade-up" className="body-copy mt-4 max-w-[520px]">
            Maybe you&apos;re starting from scratch, or your current site just isn&apos;t pulling its weight. Bring the
            idea, however rough. We&apos;ll shape it together.
          </p>

          <ul data-reveal="stagger" className="estimator-checklist">
            <li>Talk through your idea and goals</li>
            <li>Find the right platform for you</li>
            <li>A realistic sense of time and budget</li>
          </ul>
        </div>

        <div className="content-block-large">
          <span data-reveal="fade-up" className="eyebrow">
            For Agencies
          </span>

          <h3 data-split="words" className="display-heading">
            Studios that could use an extra pair of hands.
          </h3>

          <p data-reveal="fade-up" className="body-copy mt-4 max-w-[520px]">
            When the pipeline is full or a project needs deeper technical muscle, I can step in as your development
            partner, quietly under your brand and on your terms.
          </p>

          <ul data-reveal="stagger" className="estimator-checklist">
            <li>White-label Next.js &amp; WordPress builds</li>
            <li>Extra capacity when deadlines bunch up</li>
            <li>A dependable, long-term partner</li>
          </ul>
        </div>
      </section>

      {/* =====================================================
          BOOKING FORM
      ====================================================== */}

      <section ref={sectionRef} id="consultationForm" className="estimate-section">
        {/* LEFT: intro + step list */}

        <aside className="estimate-aside">
          <div>
            <span data-reveal="fade-up" className="eyebrow">
              Book A Free Call
            </span>

            <h2 data-split="words" className="estimate-aside-title">
              Pull up
              <br />a chair
            </h2>

            <p data-reveal="fade-up" className="body-copy mt-5 max-w-[390px]">
              A few quick questions so I can come prepared. It takes about two minutes, and nothing here is set in
              stone.
            </p>

            <nav className="mt-8" aria-label="Booking steps">
              <ol data-reveal="stagger" className="space-y-2.5">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isReached = index <= currentStep;

                  return (
                    <li key={index} className="estimate-side-step" aria-current={isActive ? "step" : undefined}>
                      <span className={`estimate-side-icon${isReached ? " is-reached" : ""}`}>
                        {isReached ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M5 12.5l4.2 4.2L19 7"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="text-[13px]">{step.sideLabel}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          <div data-reveal="fade-up" className="consult-next">
            <p className="estimate-question">What happens next</p>
            <ol>
              <li>I read your note myself.</li>
              <li>I email you within one working day with a few times.</li>
              <li>We talk, and you leave with a clear next step.</li>
            </ol>
          </div>
        </aside>

        {/* RIGHT: questionnaire */}

        <div data-static-borders className="estimate-panel">
          <div data-reveal="fade-up" className="estimate-card" hidden={isBooked}>
            <header className="shrink-0">
              <div className="flex items-center gap-3">
                <span className="estimate-step-number">{currentStep + 1}</span>
                <span className="font-secondary text-[12px] font-bold">{steps[currentStep].cardTitle}</span>
              </div>

              <div
                className="mt-3 h-[3px] w-full bg-black/10"
                role="progressbar"
                aria-label="Booking progress"
                aria-valuemin={1}
                aria-valuemax={STEP_COUNT}
                aria-valuenow={currentStep + 1}
              >
                <div
                  className="h-full bg-blue transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEP_COUNT) * 100}%` }}
                ></div>
              </div>

              <p className="mt-2 font-secondary text-[11px] text-black/50">
                Step {currentStep + 1} of {STEP_COUNT}
              </p>
            </header>

            <div ref={cardBodyRef} className="estimate-card-body">
              <form
                key={formKey}
                ref={formRef}
                className="pt-4"
                noValidate
                onSubmit={handleSubmit}
                onChange={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.name === "audience") {
                    setAudience(input.value as Audience);
                    setStepError(null);
                  }
                }}
              >
                {steps.map((step, index) => (
                  <section key={index} hidden={index !== currentStep}>
                    <h2 className="estimate-section-title">{step.title}</h2>
                    <p className="estimate-helper">{step.helper}</p>

                    <div className="mt-6">{step.content}</div>

                    <footer className="estimate-step-footer">
                      {index === currentStep && (stepError || (index === LAST_STEP && isSubmitting)) && (
                        <p
                          role={stepError ? "alert" : "status"}
                          className={stepError ? "estimate-status is-error" : "estimate-status"}
                        >
                          {stepError ?? "Sending your note…"}
                        </p>
                      )}

                      {index > 0 ? (
                        <button type="button" className="estimate-back-btn" onClick={() => goToStep(index - 1)}>
                          <span className="link-redraw">← Back</span>
                        </button>
                      ) : (
                        <span></span>
                      )}

                      {index < LAST_STEP ? (
                        <button type="button" data-magnetic className="estimate-primary-btn" onClick={next}>
                          Next →
                        </button>
                      ) : (
                        <button
                          type="submit"
                          data-magnetic
                          className="estimate-primary-btn"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                        >
                          {isSubmitting ? "Sending…" : "Book My Free Call →"}
                        </button>
                      )}
                    </footer>
                  </section>
                ))}
              </form>
            </div>
          </div>

          {/* THANK YOU */}

          <div ref={thanksRef} className="estimate-thanks consult-thanks" hidden={!isBooked}>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-black text-3xl font-light text-white">✓</div>

            <span className="eyebrow mt-8 mb-2">It&apos;s in my inbox</span>

            {booked && (
              <>
                <h2 className="estimate-result-range">Thank you, {booked.firstName}.</h2>

                <p className="body-copy mt-5 max-w-[460px]">
                  I&apos;ll read your note properly and email you at <strong>{booked.email}</strong> within one working
                  day with a few times for our {booked.format}
                  {booked.when && ` ${booked.when}`}.
                </p>

                <p className="estimate-microcopy max-w-[460px]">
                  Can&apos;t find it? Have a peek in your spam folder, just in case.
                </p>

                <div className="consult-thanks-links">
                  <p className="estimate-question">While you wait</p>
                  <Link href="/cost-estimator" data-magnetic className="display-link link-redraw">
                    Estimate your project
                  </Link>
                  <Link href="/blog" data-magnetic className="display-link link-sweep">
                    Read the journal
                  </Link>
                </div>
              </>
            )}

            <button type="button" className="estimate-back-btn mt-6" onClick={startAgain}>
              <span className="link-redraw">Send another request</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
