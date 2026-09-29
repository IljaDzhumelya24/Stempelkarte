import type { Metadata } from "next";
import DemoPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Deine persönliche Demo | StampNow",
  description:
    "Erlebe StampNow für dein Geschäft: Entdecke deine digitale Kundenkarte, probiere das Stempeln aus und frage deine persönliche Demo an.",
};

export default function Page() {
  return <DemoPage />;
}
