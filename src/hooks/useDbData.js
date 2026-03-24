import { useState, useEffect } from "react";

const API = "http://localhost:3001/api";

function useFetch(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}${path}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [path]);

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
