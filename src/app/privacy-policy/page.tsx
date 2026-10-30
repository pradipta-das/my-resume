import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph } from "../lib/seo";
import Link from "next/link";
import LegalPage, { type LegalSection } from "../components/LegalPage";
import { LEGAL } from "../lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${LEGAL.owner} collects, uses and protects personal information on ${LEGAL.site}, including the cost estimator and consultation forms.`,
  alternates: pageAlternates("/privacy-policy"),
  openGraph: pageOpenGraph("/privacy-policy"),
};

const Email = () => <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

/*
 * Written to match what the site actually does, including the consent-gated
 * Google Analytics and Meta Pixel in lib/analytics. If you add a service (Google
 * Ads, a newsletter tool, a chat widget...) or change what's collected, update
 * the relevant sections and LEGAL.updated, and bump CONSENT_VERSION in
 * lib/analytics so visitors are asked again.
 */
const sections: LegalSection[] = [
  {
    id: "who-i-am",
    title: "Who I am",
    body: (
      <>
        <p>
          This website, {LEGAL.site}, is run by {LEGAL.owner}, a freelance web developer and digital consultant based in{" "}
          {LEGAL.country}. When this policy says &ldquo;I&rdquo;, &ldquo;me&rdquo; or &ldquo;my&rdquo;, it means me.
        </p>
        <p>
          I decide how the personal information collected through this website is used, which makes me responsible for
          it. For anything to do with your information, email me at <Email />.
        </p>
      </>
    ),
  },
  {
    id: "what-i-collect",
    title: "What I collect",
    body: (
      <>
        <p>I only collect what you choose to give me, plus a few technical details every website receives.</p>
        <h3>When you use the cost estimator</h3>
        <ul>
          <li>Your email address.</li>
          <li>
            Your answers about the project: the type of website, features, design, technology, timeline, budget, and
            the country and city or region of your business.
          </li>
          <li>Whether you ticked the box to hear from me, and when.</li>
          <li>The estimate produced from your answers.</li>
        </ul>
        <h3>When you book a free consultation</h3>
        <ul>
          <li>Your name and email address, and your phone number if you give it.</li>
          <li>
            Whether you&apos;re asking for yourself or for an agency, and if for an agency, its name, website and size.
          </li>
          <li>Anything you tell me about your project, your message, and when and how you&apos;d like to talk.</li>
          <li>Your time zone, which the form suggests from your browser and you can change.</li>
          <li>Whether you ticked the box to hear from me, and when.</li>
        </ul>
        <h3>Technical information</h3>
        <p>
          Like any website, the server that hosts this one receives your IP address and basic details about your
          browser when you visit. The forms also hold your IP address in memory for up to an hour to stop the same
          address sending large numbers of requests. It isn&apos;t stored with your answers.
        </p>
        <h3>With your consent: analytics and advertising</h3>
        <p>
          If you allow it, Google Analytics and the Meta Pixel collect information about your visit: the pages you
          view, how you arrived, your approximate location, your device and browser, and an identifier stored in a
          cookie. They also record when someone completes the cost estimator or books a consultation, without any of
          the details entered in the form. See <a href="#cookies">cookies and tracking</a> below.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <>
        <p>
          When you first visit, a banner asks whether you&apos;re happy for me to use analytics and marketing cookies.
          Nothing from Google or Meta loads until you choose, and if you say no, it never does. You can change your
          choice at any time with <strong>Cookie settings</strong> at the bottom of every page. Withdrawing consent
          removes their cookies from this website.
        </p>
        <h3>What&apos;s used, and why</h3>
        <ul>
          <li>
            <strong>Your cookie choice</strong> (strictly necessary, always on). Stored in your browser so the banner
            doesn&apos;t ask again on every page. Kept for 12 months.
          </li>
          <li>
            <strong>Google Analytics</strong> (analytics, only with consent). Cookies <code>_ga</code> and{" "}
            <code>_ga_F31R4Y9H1X</code>, kept for up to two years. They tell me which pages are useful and how people
            find the site.
          </li>
          <li>
            <strong>Meta Pixel</strong> (marketing, only with consent). Cookies <code>_fbp</code> and, if you arrive
            from a Facebook or Instagram ad, <code>_fbc</code>, kept for 90 days. They let me measure whether my ads
            on Facebook and Instagram lead to enquiries and show them to people likely to be interested.
          </li>
        </ul>
        <p>
          Fonts are served from this website itself, so your visit isn&apos;t shared with a font provider. I don&apos;t
          send names, email addresses or anything you type into the forms to Google or Meta.
        </p>
      </>
    ),
  },
  {
    id: "how-i-use-it",
    title: "How I use your information",
    body: (
      <>
        <ul>
          <li>
            <strong>To give you your estimate</strong>, email you a copy, and keep one so we can talk it through if you get in touch.
          </li>
          <li>
            <strong>To reply to your consultation request</strong>: confirm by email that it arrived, arrange a time and prepare for our call.
          </li>
          <li>
            <strong>To send you occasional insights, project tips and offers</strong>, only if you ticked the box to say
            yes. You can unsubscribe at any time.
          </li>
          <li>
            <strong>To keep the website working and secure</strong>, for example by stopping spam and abuse of the
            forms.
          </li>
          <li>
            <strong>To understand how the website is used</strong> (Google Analytics), only if you allow analytics
            cookies.
          </li>
          <li>
            <strong>To measure and improve my advertising</strong> (Meta Pixel), only if you allow marketing cookies.
          </li>
        </ul>
        <p>
          I rely on your consent for the estimate, the consultation request, marketing emails, analytics and
          advertising cookies, and on my legitimate interest in running a secure website for the technical
          information. I never sell your information.
        </p>
      </>
    ),
  },
  {
    id: "who-i-share-it-with",
    title: "Who I share it with",
    body: (
      <>
        <p>I use a small number of trusted services to run this website. They handle your information only on my behalf:</p>
        <ul>
          <li>
            <strong>Anthropic</strong>, whose Claude AI turns your cost estimator answers into an estimate. Your answers
            are sent to Anthropic without your email address. Under its commercial terms, Anthropic doesn&apos;t use this
            data to train its models. See{" "}
            <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener">
              Anthropic&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>My website and content management hosting</strong>, where the website runs and where estimates and
            consultation requests are stored.
          </li>
          <li>
            <strong>Titan</strong>, the email service for pradipta.online, used to send you your estimate or a confirmation of your consultation request, to notify me of new requests, and to reply to you. See{" "}
            <a href="https://titan.email/privacy-policy/" target="_blank" rel="noopener">
              Titan&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Google</strong>, for Google Analytics, if you allow analytics cookies. See{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">
              how Google uses information from sites that use its services
            </a>
            .
          </li>
          <li>
            <strong>Meta</strong>, for the Meta Pixel, if you allow marketing cookies. Meta also uses this information
            under its own terms, for example to improve its advertising. See{" "}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener">
              Meta&apos;s privacy policy
            </a>
            .
          </li>
        </ul>
        <p>
          If I start using an email service for the newsletter, I&apos;ll share the addresses of people who said yes
          with that service, only so it can send the emails. I may also disclose information if the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "Where your information goes",
    body: (
      <p>
        I&apos;m based in {LEGAL.country}, and some of the services above, including Anthropic, Google and Meta, are
        in the United States. That means your information may be processed outside the country you live in. Where the law requires
        it, I rely on appropriate safeguards for these transfers, such as the providers&apos; standard contractual
        commitments.
      </p>
    ),
  },
  {
    id: "how-long",
    title: "How long I keep it",
    body: (
      <ul>
        <li>
          Estimates and consultation requests: for as long as we&apos;re in touch, then for up to two years after our
          last contact, unless we end up working together and I need to keep records for longer.
        </li>
        <li>Your marketing consent: until you unsubscribe or ask me to delete it.</li>
        <li>IP addresses held to stop abuse of the forms: up to an hour, in memory only.</li>
        <li>Your cookie choice: 12 months, after which the banner asks again.</li>
        <li>Google Analytics data: 14 months, then Google deletes it.</li>
        <li>Meta Pixel data: as set out in Meta&apos;s privacy policy.</li>
      </ul>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You can ask me to:</p>
        <ul>
          <li>tell you what information I hold about you and how I use it;</li>
          <li>correct anything that&apos;s wrong or incomplete;</li>
          <li>delete your information;</li>
          <li>stop sending you marketing emails, or withdraw any consent you&apos;ve given, at any time.</li>
        </ul>
        <p>
          You can withdraw consent to analytics and marketing cookies yourself, any time, with{" "}
          <strong>Cookie settings</strong> at the bottom of every page.
        </p>
        <p>
          Under India&apos;s Digital Personal Data Protection Act, 2023, you can also nominate someone to exercise these
          rights for you, and raise a complaint with me first. If you&apos;re not happy with my response, you can
          complain to the Data Protection Board of India.
        </p>
        <p>
          If you&apos;re in the UK or the European Union, you also have the right to object to or restrict how I use
          your information, to receive a copy in a portable format, and to complain to your local data protection
          authority.
        </p>
        <p>
          To use any of these rights, email <Email />. I&apos;ll reply within 30 days, and usually much sooner.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: (
      <p>
        Information sent through the forms travels over an encrypted (HTTPS) connection. It&apos;s stored in a private
        part of my content management system that needs an administrator login, and it isn&apos;t publicly visible on
        any website.
        No system is perfectly secure, but I take reasonable steps to protect what you share with me.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is meant for businesses and adults. I don&apos;t knowingly collect information from anyone under 18.
        If you think a child has sent me their details, email me and I&apos;ll delete them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If I change how I handle your information, I&apos;ll update this page and the date at the top. For significant
        changes affecting people who&apos;ve given me their details, I&apos;ll let them know by email.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or your information? Email <Email />. For anything else, the{" "}
        <Link href="/terms-and-conditions">terms and conditions</Link> explain how this website may be used.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What I collect when you use this website, why, and the choices you have. Written in plain English: analytics and advertising only with your consent, and nothing sold."
      sections={sections}
      related={{ href: "/terms-and-conditions", label: "Terms & Conditions" }}
    />
  );
}
