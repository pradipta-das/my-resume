import { COST_GUIDES, getCostGuide } from "../../lib/cost-guides";
import { shareImage } from "../../lib/og";

export const alt = "A cost guide from Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return COST_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getCostGuide((await params).slug);
  return shareImage({ label: guide ? `Cost Guide · ${guide.type}` : "Cost guides", title: guide?.title ?? "Cost guides" });
}
