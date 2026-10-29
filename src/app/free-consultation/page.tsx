import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ConsultationForm from "../components/ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Free Consultation Call",
  description:
    "Book a free, no-pressure call with Pradipta Das to talk through your website, web app or agency project. Honest advice and clear next steps.",
  alternates: { canonical: "/free-consultation" },
};

export default function FreeConsultationPage() {
  return (
    <>
      <HomeHeader />
      <ConsultationForm />
      <HomeFooter />
    </>
  );
}
