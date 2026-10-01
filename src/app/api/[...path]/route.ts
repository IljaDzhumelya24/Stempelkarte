// Used only until STAMPNOW_BACKEND_URL is configured. Configured requests are
// forwarded by next.config.ts to the original application's API instead.
function unavailable() {
  return Response.json(
    { error: "Die Anmeldung ist momentan nicht erreichbar. Bitte versuche es später erneut.", code: "app_unavailable" },
    { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } },
  );
}

export const GET = unavailable;
export const POST = unavailable;
export const PUT = unavailable;
export const PATCH = unavailable;
export const DELETE = unavailable;
