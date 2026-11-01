import Link from "next/link";

// Where to go from a missing or broken page: the places most visitors are
// looking for. Styled like the resource cards, so it needs no CSS of its own.
const DIRECTIONS = [
  { label: "Start here", title: "Homepage", href: "/", copy: "Who I am, what I build and how I work." },
  { label: "Work", title: "Case Studies", href: "/case-studies", copy: "Websites, stores and apps I've built for clients." },
  { label: "Reading", title: "The Journal", href: "/blog", copy: "Notes and lessons from 15+ years of web development." },
  { label: "Free", title: "Resources", href: "/resources", copy: "Plugins, starters and checklists from real projects." },
  { label: "Budget", title: "Cost Estimator", href: "/cost-estimator", copy: "A ballpark price for your website in a few minutes." },
  { label: "Talk", title: "Free Consultation", href: "/free-consultation", copy: "A free call to talk your project through." },
];

export default function PageDirections({ reveal = false }: { reveal?: boolean }) {
  return (
    <ul data-reveal={reveal ? "stagger" : undefined} className="resource-grid">
      {DIRECTIONS.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="resource-card">
            <span className="resource-card-type">{item.label}</span>
            <h2 className="resource-card-title">
              <span className="link-sweep">{item.title}</span>
            </h2>
            <p className="resource-card-copy">{item.copy}</p>
            <span className="resource-card-meta">
              <span className="resource-card-format">pradipta.online{item.href === "/" ? "" : item.href}</span>
              <span className="resource-card-status">
                Go
                <span aria-hidden="true" className="resource-card-arrow">
                  →
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
