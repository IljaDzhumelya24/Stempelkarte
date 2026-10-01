// Uses the same environment variable names as services/stampnow/src/site.js.
export function getCompanyDetails() {
  const name = process.env.PROCESSOR_NAME?.trim() || "";
  const address = (process.env.PROCESSOR_ADDRESS || "").replace(/\\n/g, "\n").trim();
  const email = process.env.CONTACT_EMAIL?.trim() || "";
  const phone = process.env.CONTACT_PHONE?.trim() || "";
  return {
    name,
    addressLines: address.split(/\n|,\s*/).filter(Boolean),
    email,
    phone,
    complete: Boolean(name && address && email),
    appHosting: process.env.HOSTING_INFO?.trim() || "",
  };
}
