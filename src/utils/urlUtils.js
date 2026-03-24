export function parseUrl(urlString) {
  const url = new URL(urlString);
  const params = [];
  url.searchParams.forEach((value, key) => params.push({ key, value }));
  return { baseUrl: url.origin + url.pathname, params };
}

export function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  params.forEach(({ key, value }) => {
    if (key) url.searchParams.set(key, value);
  });
  return url.toString();
}
