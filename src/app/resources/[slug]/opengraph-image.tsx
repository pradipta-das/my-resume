import { RESOURCES, getResource } from "../../lib/resources";
import { shareImage } from "../../lib/og";

export const alt = "A free resource from Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({ slug: resource.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resource = getResource((await params).slug);
  return shareImage({ label: resource?.type ?? "Free resources", title: resource?.title ?? "Free resources" });
}
