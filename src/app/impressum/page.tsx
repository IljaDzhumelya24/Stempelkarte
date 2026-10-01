import type { Metadata } from "next";
import { connection } from "next/server";
import LegalLayout from "@/components/LegalLayout";
import CompanyAddress from "@/components/CompanyAddress";
import { getCompanyDetails } from "@/lib/company";

export const metadata: Metadata = {
  title: "Impressum | StampNow",
  description: "Anbieter- und Kontaktangaben von StampNow.",
};

export default async function ImpressumPage() {
  await connection();
  const company = getCompanyDetails();
  return (
    <LegalLayout title="Impressum." complete={company.complete}>
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <CompanyAddress />
      </section>
      <section>
        <h2>Kontakt</h2>
        {company.email && <p>E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a></p>}
        {company.phone && <p>Telefon: <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>{company.phone}</a></p>}
      </section>
      <section>
        <h2>Umsatzsteuer</h2>
        <p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</p>
      </section>
      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <CompanyAddress />
      </section>
      <section>
        <h2>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </section>
    </LegalLayout>
  );
}
