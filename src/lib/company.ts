// Uses the same environment variable names as services/stampnow/src/site.js.
export function getCompanyDetails() {
  const name = process.env.PROCESSOR_NAME?.trim() || "StampNow – Inh. Joel Noah Janik";
  const address = (process.env.PROCESSOR_ADDRESS?.trim() || "Dwoberger Dorfschaftsweg 6\n27753 Delmenhorst").replace(/\\n/g, "\n");
  const email = process.env.CONTACT_EMAIL?.trim() || "joel@janik-invest.de";
  const phone = process.env.CONTACT_PHONE?.trim() || "";
  return {
    name,
    addressLines: address.split(/\n|,\s*/).filter(Boolean),
    email,
    phone,
    complete: Boolean(name && address && email),
    appHosting: process.env.HOSTING_INFO?.trim() || "Railway Corporation, Serverstandort EU (Amsterdam). Railway ist ein US-Unternehmen; die Übermittlung ist über Standardvertragsklauseln abgesichert.",
  };
}
