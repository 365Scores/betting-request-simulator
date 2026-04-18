import { useState, useEffect } from "react";

const API = "http://localhost:3001/api";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function useFetch(path) {
  const cacheKey = `dbcache:${path}`;
  const [data, setData] = useState(() => readCache(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => readCache(cacheKey) === null);

  useEffect(() => {
    if (readCache(cacheKey) !== null) return; // already warm
    fetch(`${API}${path}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { writeCache(cacheKey, d); setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [path, cacheKey]);

  return { data, loading };
}

export function useCountries() {
  return useFetch("/countries");
}

export function useLanguages() {
  return useFetch("/languages");
}

export function usePublishers() {
  return useFetch("/publishers");
}
