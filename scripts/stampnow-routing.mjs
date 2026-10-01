// The imported application's URLs stay on this origin, including cookies and CSRF headers.
export const appPages = [
  ["/anmelden", "login"],
  ["/login", "login"],
  ["/dashboard", "dashboard"],
  ["/scan", "scan"],
  ["/k/:slug", "join"],
  ["/meine-karte/:publicId", "card"],
];

export function backendUrl(raw = process.env.STAMPNOW_BACKEND_URL) {
  if (!raw?.trim()) return null;
  const url = new URL(raw.trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('STAMPNOW_BACKEND_URL must be an HTTP(S) server origin without credentials or a path.');
  }
  return url.origin;
}

export function appRewrites(raw = process.env.STAMPNOW_BACKEND_URL) {
  const backend = backendUrl(raw);
  const pages = appPages.map(([source, page]) => ({ source, destination: `/stampnow-app/${page}.html` }));
  const assets = ['css', 'js', 'fonts', 'assets'].map((folder) => ({
    source: `/${folder}/:path*`, destination: `/stampnow-app/${folder}/:path*`,
  }));
  const proxyPaths = ['/api/:path*', '/wallet/v1/:path*', '/media/logo/:path*', '/datenschutz/:slug', '/health'];
  return [
    ...pages,
    ...assets,
    ...(backend ? proxyPaths.map((source) => ({ source, destination: `${backend}${source}` })) : []),
  ];
}

export function appHeaders() {
  // Mirror the original Express security policy for the unchanged standalone HTML pages.
  const csp = "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self'; font-src 'self'; media-src 'self' blob:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
  const headers = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
    { key: 'Referrer-Policy', value: 'no-referrer' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Cache-Control', value: 'no-store' },
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  ];
  return [...appPages.map(([source]) => ({ source, headers })), { source: '/stampnow-app/:path*', headers }];
}
