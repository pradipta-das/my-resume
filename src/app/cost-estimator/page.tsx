import type { Metadata } from "next";
import CostEstimatorForm from "../components/CostEstimatorForm";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

export const metadata: Metadata = {
  title: "Website Cost Estimator",
  description:
    "Get a free, instant ballpark estimate for your website or web app: answer a few questions about your project and see a price range, timeline and what drives the cost.",
  alternates: { canonical: "/cost-estimator" },
};

export default function CostEstimatorPage() {
  return (
    <>
      <HomeHeader />
      <CostEstimatorForm />
      <HomeFooter />
    </>
  );
}
