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

export function useLineTypes() {
  return useFetch("/line-types");
}

export function useBookmakers() {
  return useFetch("/bookmakers/names");
}

export function useSports() {
  return useFetch("/sports");
}

export function useCurrencies() {
  return useFetch("/currencies");
}

export function useCompetitions() {
  return useFetch("/competitions");
}

export function useSeasons(competitionId) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!competitionId) { setData([]); return; }
    fetch(`${API}/competitions/${competitionId}/seasons`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(setData)
      .catch(() => setData([]));
  }, [competitionId]);
  return { data };
}
