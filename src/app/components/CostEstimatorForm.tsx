"use client";

import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { animateSections } from "../utils/animateSections";
import { magnetic } from "../utils/magnetic";
import { ESTIMATE_PDF_FILENAME, type Estimate } from "../lib/estimate/schema";
import { BUDGET_OPTIONS, currencyFor } from "../lib/estimate/pricing";
import { formatMoney } from "../lib/estimate/format";
import { trackLead } from "../lib/analytics";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Saves the estimate PDF (base64, from /api/estimate) to the visitor's device.
function downloadPdf(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = ESTIMATE_PDF_FILENAME;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/* =========================================================
   FIELD HELPERS
========================================================= */

type OptionItem = [title: string, description: string];

function OptionCards({ name, items, className }: { name: string; items: OptionItem[]; className: string }) {
  return (
    <div className={className}>
      {items.map(([title, description]) => (
        <label key={title} className="estimate-option">
          <input className="sr-only" type="radio" name={name} value={title} />
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

function FeatureGroup({ label, question, name, items }: { label: string; question: string; name: string; items: string[] }) {
  return (
    <div className="mb-5">
      <p className="estimate-question mb-1">{label}</p>
      <p className="body-copy mb-3">{question}</p>
      <PillOptions type="checkbox" name={`${name}[]`} items={items} className="grid grid-cols-2 gap-3 sm:grid-cols-3" />
    </div>
  );
}

// The business country chosen in "Your Market", for questions on later steps.
const CountryContext = createContext("");

// Budget brackets in the currency the estimate will be in. Keyed by currency,
// so changing the country clears a bracket picked in the old currency.
function BudgetQuestion() {
  const currency = currencyFor(useContext(CountryContext));

  return (
    <PillOptions
      key={currency}
      name="budget"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      items={[...BUDGET_OPTIONS[currency], "Not sure yet"]}
    />
  );
}

/* =========================================================
   STEPS
========================================================= */

function TechnologyStep() {
  const [hasWebsite, setHasWebsite] = useState<boolean>(false);

  return (
    <>
      <p className="estimate-question">Technology</p>
      <OptionCards
        name="technology"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        items={[
          ["WordPress", "Flexible content management."],
          ["Shopify", "E-commerce focused."],
          ["Webflow", "Visual website development."],
          ["Next.js / React", "Modern custom web applications."],
          ["Custom Development", "Built specifically around the business."],
          ["Not Sure", "You tell us what's best."],
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
      <div
        className="mt-5"
        onChange={(e) => {
          const input = e.target as HTMLInputElement;
          if (input.name === "has_website") setHasWebsite(input.value === "Yes");
        }}
      >
        <p className="estimate-question">Do you already have a website?</p>
        <PillOptions name="has_website" items={["Yes", "No", "I'm still planning it"]} className="grid grid-cols-3 gap-3" />

        {hasWebsite && (
          <div className="mt-4">
            <label className="estimate-label" htmlFor="websiteUrl">
              Current website URL
            </label>
            <input id="websiteUrl" name="website_url" className="estimate-input" type="url" placeholder="https://example.com" />
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="estimate-question">Do you already have hosting?</p>
        <PillOptions name="hosting" items={["Yes", "No", "Not sure"]} className="grid grid-cols-3 gap-3" />
      </div>
      </div>
    </>
  );
}

const STEPS: { sideLabel: string; title: string; helper: string; content: React.ReactNode }[] = [
  {
    sideLabel: "The Project",
    title: "What are you building?",
    helper: "Choose the option that best describes your project.",
    content: (
      <>
        <p className="estimate-question">Project Type</p>
        <OptionCards
          name="project_type"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          items={[
            ["Business Website", "Showcase your business, services and brand."],
            ["E-commerce", "Sell products or services online."],
            ["SaaS / Web Application", "A web-based product, platform or application."],
            ["Portfolio / Personal Website", "Your personal brand, work or professional portfolio."],
            ["Content / Blog", "Articles, news, resources or publishing."],
            ["Membership / Community", "Accounts, subscriptions or members-only content."],
            ["Marketplace", "Multiple sellers, providers or users."],
            ["Something Else", "I have something different in mind."],
          ]}
        />
        <div className="mt-5">
          <p className="estimate-question">What are you doing with the website?</p>
          <PillOptions
            name="project_action"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
            items={[
              "Starting from scratch",
              "Redesigning an existing website",
              "Moving from another platform",
              "Adding new functionality",
              "Improving an existing website",
            ]}
          />
        </div>
      </>
    ),
  },
  {
    sideLabel: "The Scope",
    title: "How big is this thing?",
    helper: "Don't worry about getting the numbers perfect. An estimate is all we need.",
    content: (
      <>
        <p className="estimate-question">Approximately how many pages will you need?</p>
        <OptionCards
          name="pages"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          items={[
            ["1–5 pages", "Small and focused"],
            ["6–15 pages", "Typical business website"],
            ["16–30 pages", "Large website"],
            ["30+ pages", "We're going big"],
            ["Not sure", "Help me figure this out"],
          ]}
        />
        <div className="mt-5">
          <p className="estimate-question">How many different page layouts do you expect?</p>
          <p className="body-copy mb-3">
            For example, your About, Services and Contact pages might use different content but share the same layout.
          </p>
          <PillOptions
            name="layouts"
            className="grid grid-cols-2 gap-3 sm:grid-cols-5"
            items={["1–3 layouts", "4–6 layouts", "7–10 layouts", "10+ layouts", "Not sure"]}
          />
          <p className="estimate-microcopy">We&apos;re measuring complexity, not counting every URL.</p>
        </div>
      </>
    ),
  },
  {
    sideLabel: "What It Does",
    title: "What should your website actually do?",
    helper: "Pick everything you think you’ll need. You can always change your mind.",
    content: (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
        <FeatureGroup
          label="Basic Features"
          question="Core functionality"
          name="features"
          items={["Contact forms", "Blog / Articles", "Search", "Newsletter signup", "User accounts", "Admin dashboard", "File uploads", "Multi-language support"]}
        />
        <FeatureGroup
          label="E-commerce"
          question="Selling something?"
          name="ecommerce"
          items={["Product catalogue", "Shopping cart", "Online payments", "Subscriptions", "Coupons / Discounts", "Inventory management", "Shipping integration", "Tax calculation"]}
        />
        <FeatureGroup
          label="Integrations"
          question="Does it need to talk to other systems?"
          name="integrations"
          items={["CRM", "Email marketing", "Payment gateway", "Booking system", "Analytics", "Social media", "ERP / Business software", "Third-party APIs", "Other"]}
        />
        <FeatureGroup
          label="Advanced"
          question="Anything more ambitious?"
          name="advanced"
          items={["AI features", "Real-time data", "Custom dashboards", "User-generated content", "Personalization", "Automation", "Geolocation", "Multi-vendor functionality", "Custom business logic"]}
        />
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 border border-dashed border-black/30 p-4 hover:border-black">
          <input type="checkbox" name="not_sure_features" value="Not sure yet" className="h-4 w-4 accent-black" />
          <span>
            <strong className="estimate-option-title">I&apos;m not sure yet</strong>
            <small className="estimate-option-description">I know what I want, but not how to describe it.</small>
          </span>
        </label>
      </>
    ),
  },
  {
    sideLabel: "The Experience",
    title: "How do you want it to look and feel?",
    helper: "Design can be anything from a simple template to a completely custom digital experience.",
    content: (
      <>
        <p className="estimate-question">How custom should the design be?</p>
        <OptionCards
          name="design_level"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          items={[
            ["Template / Starter", "Start with an existing design and customize it."],
            ["Custom Design", "A unique interface designed around my brand."],
            ["Premium Experience", "Highly polished design with custom interactions."],
            ["Something Extraordinary", "Experimental, immersive or highly interactive."],
          ]}
        />
        <div className="mt-5">
          <p className="estimate-question">How much motion do you want?</p>
          <OptionCards
            name="motion"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            items={[
              ["Keep it simple", "Minimal animation."],
              ["A little movement", "Smooth transitions and subtle interactions."],
              ["Make it feel alive", "Interactive animations and scroll effects."],
              ["Go all in", "Advanced motion, WebGL or 3D experiences."],
            ]}
          />
          <p className="estimate-microcopy">Yes, making things move costs more. Gravity remains free.</p>
        </div>
      </>
    ),
  },
  {
    sideLabel: "The Engine",
    title: "Do you have a preferred technology?",
    helper: "If you don't know—or don't care—we'll recommend an appropriate approach.",
    content: <TechnologyStep />,
  },
  {
    sideLabel: "Your Market",
    title: "Where is the business based?",
    helper: "Your estimate comes in your local currency, compared with what agencies near you typically charge.",
    content: (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="estimate-label" htmlFor="country">
              Country
            </label>
            <select id="country" name="country" className="estimate-input" defaultValue="">
              <option value="">Select your country</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="estimate-label" htmlFor="region">
              City / Region
            </label>
            <input id="region" name="region" className="estimate-input" type="text" placeholder="Select your city or region" />
          </div>
        </div>
        <div className="mt-5">
          <p className="estimate-question">Who will primarily use the website?</p>
          <PillOptions
            name="audience"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            items={["Local customers", "National customers", "International customers", "B2B customers", "Global audience", "Internal users"]}
          />
        </div>
      </>
    ),
  },
  {
    sideLabel: "The Clock",
    title: "When do you want to launch?",
    helper: "Choose the timeline that best matches your project.",
    content: (
      <>
        <p className="estimate-question">Launch timeline</p>
        <OptionCards
          name="timeline"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          items={[
            ["Yesterday 😅", "I need it ASAP"],
            ["Within 1 month", "Fast-moving project"],
            ["1–2 months", "Aggressive but realistic"],
            ["2–3 months", "Comfortable timeline"],
            ["3–6 months", "Plenty of breathing room"],
            ["No fixed deadline", "Quality first"],
          ]}
        />
        <div className="mt-5">
          <p className="estimate-question">How important is speed?</p>
          <PillOptions
            name="speed"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            items={["I'm flexible", "I'd like to move quickly", "The deadline is important", "The deadline is critical"]}
          />
        </div>
        <div className="mt-5">
          <p className="estimate-question">Do you already have a budget in mind?</p>
          <BudgetQuestion />
          <p className="body-copy mt-3">This is optional. We won&apos;t reject your project based on your answer.</p>
        </div>
      </>
    ),
  },
  {
    sideLabel: "Your Details",
    title: "Where should we send your estimate?",
    helper: "Your estimate appears on the next screen, and we keep a copy for when we talk.",
    content: (
      <div className="max-w-[640px]">
        <label className="estimate-label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="estimate-input"
        />

        {/* Opt-in only: unticked by default and separate from the estimate. */}
        <label className="estimate-consent">
          <input type="checkbox" name="marketing_consent" value="yes" className="mt-0.5 h-4 w-4 shrink-0 accent-black" />
          <span>Send me occasional insights, project tips and offers. I can unsubscribe at any time.</span>
        </label>

        <p className="estimate-microcopy">
          Without the tick, we only use your email to follow up on this estimate. See the{" "}
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
      </div>
    ),
  },
];

const LAST_STEP = STEPS.length - 1;

/* =========================================================
   PAGE
========================================================= */

export default function CostEstimatorForm() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stepperRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const thanksRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  // The same estimate as a PDF, when the server could make one.
  const [pdf, setPdf] = useState<string | null>(null);
  // Bumping the key remounts the form, clearing every input and step state.
  const [formKey, setFormKey] = useState<number>(0);
  // The chosen business country; later questions use it (see CountryContext).
  const [country, setCountry] = useState<string>("");

  // Steps differ in height, so when the visitor has scrolled down a long step,
  // bring the step indicator back into view for the next one.
  const goToStep = (index: number) => {
    setCurrentStep(Math.max(0, Math.min(LAST_STEP, index)));

    const stepper = stepperRef.current;
    if (stepper && stepper.getBoundingClientRect().top < 0) {
      stepper.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Enter in a text field submits implicitly — treat it as "Next" until the last step.
    if (currentStep < LAST_STEP) {
      goToStep(currentStep + 1);
      return;
    }
    if (isSubmitting) return;

    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    if (!emailInput.value.trim() || !emailInput.validity.valid) {
      setSubmitError("Please enter a valid email address so we can send your estimate.");
      emailInput.focus();
      return;
    }

    const data: Record<string, string | string[]> = {};
    new FormData(form).forEach((value, key) => {
      if (key.endsWith("[]")) {
        const name = key.slice(0, -2);
        data[name] = [...((data[name] as string[] | undefined) ?? []), String(value)];
      } else {
        data[key] = String(value);
      }
    });
    const { email, marketing_consent, hp_field, ...answers } = data;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(email).trim(),
          marketingConsent: marketing_consent === "yes",
          answers,
          honeypot: hp_field,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { estimate?: Estimate; pdf?: string; error?: string };

      if (!response.ok || !result.estimate) {
        setSubmitError(result.error ?? "We couldn't calculate an estimate this time. Please try again.");
        return;
      }

      setEstimate(result.estimate);
      setPdf(result.pdf ?? null);
      setIsSubmitted(true);
      trackLead("cost_estimator");
      stepperRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    } catch {
      setSubmitError("We couldn't reach the estimator. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAgain = () => {
    setFormKey((key) => key + 1);
    setCountry("");
    setCurrentStep(0);
    setIsSubmitted(false);
    setEstimate(null);
    setPdf(null);
    setSubmitError(null);
  };

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

    const section = formRef.current?.querySelectorAll(":scope > section")[currentStep];
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
  useEffect(() => {
    const thanks = thanksRef.current;
    if (!isSubmitted || !thanks || prefersReducedMotion()) return;

    const [tick, ...rest] = Array.from(thanks.children);
    const tl = gsap
      .timeline()
      .from(tick, { scale: 0, duration: 0.6, ease: "back.out(2)" })
      .from(rest, { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.3");
    return () => {
      tl.revert();
    };
  }, [isSubmitted]);

  return (
    <main ref={rootRef} className="page">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="estimator-hero">
        {/* The h1 names the tool, for search; the line under it is display copy. */}
        <h1 data-reveal="fade-up" className="eyebrow normal-case">
          Website Cost Calculator: Estimate Your Website or App Budget
        </h1>

        <p data-split="words" className="estimator-hero-title">
          Don&apos;t let a bad estimate kill a good idea.
        </p>

        <div data-reveal="fade-up">
          <a href="#estimateForm" data-magnetic className="display-link link-redraw mt-6">
            Estimate My Project
          </a>
        </div>
      </section>

      {/* =====================================================
          THE PROBLEM
      ====================================================== */}

      <section className="estimator-grid">
        <div className="estimator-cell content-block-large">
          <span data-reveal="fade-up" className="eyebrow">
            The Problem
          </span>

          <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
            The problem isn&apos;t always the price.
          </h2>

          <h3 data-reveal="fade-up" className="display-heading mt-6">
            It&apos;s the uncertainty.
          </h3>
        </div>

        <div className="content-block-large flex flex-col justify-between">
          <blockquote data-split="words" className="estimator-quote">
            &ldquo;A good estimate won&apos;t predict the future. But it can help you understand what you&apos;re
            getting into.&rdquo;
          </blockquote>

          <div>
            <ul data-reveal="stagger" className="estimator-risks">
              <li data-divider>Scope creep</li>
              <li data-divider>Cost creep</li>
              <li data-divider>Momentum lost</li>
            </ul>

            <Link href="/case-studies" data-magnetic className="display-link link-sweep mt-6">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          THE SOLUTION
      ====================================================== */}

      <section className="estimator-grid">
        <div className="estimator-cell content-block-large">
          <span data-reveal="fade-up" className="eyebrow">
            The Solution
          </span>

          <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
            So we built this.
          </h2>
        </div>

        <div className="content-block-large">
          <h3 data-reveal="fade-up" className="display-heading">
            Let&apos;s put some numbers around your idea.
          </h3>

          <p data-reveal="fade-up" className="body-copy">
            Tell us about your project.
          </p>

          <ul data-reveal="stagger" className="estimator-checklist">
            <li>No signup to calculate</li>
            <li>Approximate market range</li>
            <li>Understand cost drivers</li>
          </ul>
        </div>
      </section>

      {/* =====================================================
          ESTIMATE FORM
      ====================================================== */}

      <section id="estimateForm" className="estimate-layout">
        {/* Intro */}

        <header className="estimate-intro">
          <div>
            <span data-reveal="fade-up" className="eyebrow">
              Website Project Estimator
            </span>

            <h2 data-split="words" className="estimate-aside-title">
              The future of your website
            </h2>

            <p data-reveal="fade-up" className="body-copy mt-5 max-w-[520px]">
              We know you&apos;ll love the speed of our cutting-edge process and the experience of building your
              website with us.
            </p>
          </div>

          <div data-reveal="image" className="pointer-events-none hidden md:block">
            <Image
              src="/winter-sports.png"
              alt=""
              width={1098}
              height={969}
              sizes="220px"
              className="h-[220px] w-[220px] object-contain opacity-90 mix-blend-multiply"
            />
          </div>
        </header>

        {/* Step indicator: any step can be opened, since none are required
            until the last. --progress fills the line up to the current step. */}

        <nav
          ref={stepperRef}
          className="estimate-stepper"
          aria-label="Estimate steps"
          style={{ "--steps": STEPS.length, "--progress": currentStep / LAST_STEP } as React.CSSProperties}
        >
          <ol data-reveal="stagger">
            {STEPS.map((step, index) => {
              const isReached = index <= currentStep;
              const isDone = index < currentStep || isSubmitted;

              return (
                <li key={step.sideLabel} className="estimate-stepper-item">
                  <button
                    type="button"
                    className="estimate-stepper-btn"
                    aria-current={index === currentStep ? "step" : undefined}
                    disabled={isSubmitted}
                    onClick={() => goToStep(index)}
                  >
                    <span className={`estimate-side-icon${isReached ? " is-reached" : ""}`}>
                      {isDone ? (
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
                    <span className="estimate-stepper-label">{step.sideLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Questionnaire */}

        <div data-static-borders className="estimate-panel">
          <div data-reveal="fade-up" hidden={isSubmitted}>
            <CountryContext.Provider value={country}>
              <form
                key={formKey}
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                onChange={(e) => {
                  const field = e.target as HTMLSelectElement;
                  if (field.name === "country") setCountry(field.value);
                }}
              >
                {STEPS.map((step, index) => (
                  <section key={step.sideLabel} hidden={index !== currentStep}>
                    <p className="estimate-step-count">
                      Step {index + 1} of {STEPS.length} · {step.sideLabel}
                    </p>
                    <h2 className="estimate-section-title">{step.title}</h2>
                    <p className="estimate-helper">{step.helper}</p>

                    <div className="mt-6">{step.content}</div>

                    <footer className="estimate-step-footer">
                      {index === LAST_STEP && (submitError || isSubmitting) && (
                        <p
                          role={submitError ? "alert" : "status"}
                          className={submitError ? "estimate-status is-error" : "estimate-status"}
                        >
                          {submitError ?? "Working out your estimate. This usually takes under a minute."}
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
                        <button
                          type="button"
                          data-magnetic
                          className="estimate-primary-btn"
                          onClick={() => goToStep(index + 1)}
                        >
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
                          {isSubmitting ? "Calculating…" : "Calculate My Estimate →"}
                        </button>
                      )}
                    </footer>
                  </section>
                ))}
              </form>
            </CountryContext.Provider>
          </div>

          {/* THANK YOU */}

          <div ref={thanksRef} className="estimate-thanks" hidden={!isSubmitted}>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-black text-3xl font-light text-white">✓</div>

            <span className="eyebrow mt-8 mb-2">Your Estimate</span>

            {estimate && (
              <>
                <h2 className="estimate-result-range">
                  {formatMoney(estimate.low, estimate.currency)} – {formatMoney(estimate.high, estimate.currency)}
                </h2>

                <p className="estimate-result-meta">
                  Estimated build time: {estimate.timeline.minWeeks}–{estimate.timeline.maxWeeks} weeks
                </p>

                <p className="body-copy mt-5 max-w-[520px]">{estimate.summary}</p>

                {(estimate.phaseOne || estimate.freelance) && (
                  <div className="estimate-compare">
                    {estimate.phaseOne && (
                      <div>
                        <p className="estimate-question">Start smaller</p>
                        <p className="estimate-compare-range">
                          {formatMoney(estimate.phaseOne.low, estimate.currency)} –{" "}
                          {formatMoney(estimate.phaseOne.high, estimate.currency)}
                        </p>
                        <p className="estimate-compare-copy">{estimate.phaseOne.scope}</p>
                      </div>
                    )}
                    {estimate.freelance && (
                      <div>
                        <p className="estimate-question">Typical freelance price</p>
                        <p className="estimate-compare-range is-muted">
                          {formatMoney(estimate.freelance.low, estimate.currency)} –{" "}
                          {formatMoney(estimate.freelance.high, estimate.currency)}
                        </p>
                        <p className="estimate-compare-copy">
                          The same hours at typical rates for experienced freelancers in your market.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <table className="estimate-breakdown">
                  <caption className="sr-only">Cost breakdown</caption>
                  <tbody>
                    {estimate.breakdown.map((row) => (
                      <tr key={row.item}>
                        <th scope="row">{row.item}</th>
                        <td>
                          {formatMoney(row.low, estimate.currency)} – {formatMoney(row.high, estimate.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="estimate-notes">
                  <div>
                    <p className="estimate-question">What drives the cost</p>
                    <ul>
                      {estimate.costDrivers.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="estimate-question">Assumptions</p>
                    <ul>
                      {estimate.assumptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="estimate-microcopy max-w-[520px]">
                  A ballpark for planning, not a quote. A {pdf ? "PDF " : ""}copy is on its way to your inbox, and
                  I&apos;m happy to talk it through.
                </p>
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              {pdf && (
                <button
                  type="button"
                  data-magnetic
                  className="estimate-primary-btn min-w-[145px]"
                  onClick={() => downloadPdf(pdf)}
                >
                  Download PDF
                </button>
              )}
              <button
                type="button"
                data-magnetic={pdf ? undefined : true}
                className={pdf ? "estimate-back-btn" : "estimate-primary-btn min-w-[145px]"}
                onClick={startAgain}
              >
                Start Again
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
