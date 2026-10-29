import Link from "next/link";
import type { Resource } from "../lib/resources";

// One free resource, linking to its page. Takes its colours from the text
// colour around it, so it works on the white pages and in the black footer.
export default function ResourceCard({ resource, as: Heading = "h3" }: { resource: Resource; as?: "h2" | "h3" }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="resource-card">
      <span className="resource-card-type">{resource.type}</span>
      <Heading className="resource-card-title">
        <span className="link-sweep">{resource.title}</span>
      </Heading>
      <p className="resource-card-copy">{resource.description}</p>
      <span className="resource-card-meta">
        <span className="resource-card-format">{resource.format}</span>
        <span className={resource.href ? "resource-card-status" : "resource-card-status is-soon"}>
          {resource.href ? "Free download" : "Coming soon"}
          <span aria-hidden="true" className="resource-card-arrow">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
