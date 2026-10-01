import { getCompanyDetails } from "@/lib/company";

export default function CompanyAddress({ showContact = false }: { showContact?: boolean }) {
  const company = getCompanyDetails();
  return (
    <address className="not-italic">
      {company.name && <div>{company.name}</div>}
      {company.addressLines.map((line, index) => <div key={index}>{line}</div>)}
      {showContact && company.email && <div>E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a></div>}
    </address>
  );
}
