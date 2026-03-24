import { useState } from "react";
import { structuredFields } from "../constants/fields";

const defaultStructured = Object.fromEntries(
  structuredFields.map(({ key, type }) => [key, type === "checkbox" ? false : ""])
);

export function useParams() {
  const [structured, setStructured] = useState(defaultStructured);
  const [extras, setExtras] = useState([]);

  function setParam(key, value) {
    setStructured((prev) => ({ ...prev, [key]: value }));
  }

  function populate(params) {
    const map = {};
    params.forEach(({ key, value }) => { map[key.toLowerCase()] = value; });

    const newStructured = { ...defaultStructured };
    const knownKeys = new Set(structuredFields.map((f) => f.key.toLowerCase()));
    const newExtras = [];

    structuredFields.forEach(({ key, type }) => {
      const val = map[key.toLowerCase()];
      if (val !== undefined) {
        newStructured[key] = type === "checkbox" ? val === "true" : val;
      }
    });

    params.forEach(({ key, value }) => {
      if (!knownKeys.has(key.toLowerCase())) {
        newExtras.push({ id: crypto.randomUUID(), key, value });
      }
    });

    setStructured(newStructured);
    setExtras(newExtras);
  }

  function clear() {
    setStructured(defaultStructured);
    setExtras([]);
  }

  function readAll() {
    const result = [];
    structuredFields.forEach(({ key, type }) => {
      const value = structured[key];
      if (type === "checkbox") {
        if (value) result.push({ key, value: "true" });
      } else {
        if (value !== "") result.push({ key, value });
      }
    });
    extras.forEach(({ key, value }) => {
      if (key) result.push({ key, value });
    });
    return result;
  }

  function addExtra() {
    setExtras((prev) => [...prev, { id: crypto.randomUUID(), key: "", value: "" }]);
  }

  function removeExtra(id) {
    setExtras((prev) => prev.filter((e) => e.id !== id));
  }

  function setExtraField(id, field, value) {
    setExtras((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }

  return { structured, setParam, extras, addExtra, removeExtra, setExtraField, populate, clear, readAll };
}
