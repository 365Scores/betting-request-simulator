import { useState, useRef } from "react";
import { structuredFields, mobileApiEndpoints } from "../../constants/fields";
import { useCountries, useLanguages, usePublishers, useLineTypes, useBookmakers, useSports, useCurrencies, useCompetitions, useSeasons } from "../../hooks/useDbData";
import ParamField from "./ParamField";

function BaseUrlSelect({ value, onChange }) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLabel = mobileApiEndpoints.find((o) => o.url === value)?.label ?? "";

  const filtered = text
    ? mobileApiEndpoints.filter((o) =>
        o.label.toLowerCase().includes(text.toLowerCase()) ||
        o.url.toLowerCase().includes(text.toLowerCase())
      )
    : mobileApiEndpoints;

  function handleFocus() { setText(""); setIsOpen(true); }

  function handleChange(e) { setText(e.target.value); setIsOpen(true); }

  function handleSelect(opt) { onChange(opt.url); setText(""); setIsOpen(false); }

  function handleBlur(e) {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      if (text.startsWith("http")) onChange(text);
      setText("");
      setIsOpen(false);
    }
  }

  return (
    <div className="db-select" ref={containerRef} onBlur={handleBlur}>
      <input
        type="text"
        spellCheck="false"
        value={isOpen ? text : selectedLabel}
        placeholder="Search endpoints or paste a URL…"
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {isOpen && (
        <div className="db-select-dropdown">
          {filtered.map((opt) => (
            <div
              key={opt.label}
              className={"db-select-option" + (opt.url === value ? " db-select-option--selected" : "")}
              onMouseDown={() => handleSelect(opt)}
            >
              <div>{opt.label}</div>
              <div style={{ fontSize: "0.75em", color: "#6b7585", marginTop: 2 }}>{opt.url}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="db-select-option" style={{ color: "#6b7585" }}>No results — blur to use typed URL</div>
          )}
        </div>
      )}
    </div>
  );
}

const groups = [
  { key: "query",  title: "Query params" },
  { key: "game",   title: "Game" },
  { key: "client", title: "Client" },
  { key: "user",   title: "User" },
  { key: "odds",   title: "Odds" },
];

export default function BuilderPanel({
  baseUrl, onBaseUrlChange,
  structured, onParamChange,
  extras, onAddExtra, onRemoveExtra, onExtraChange,
  onClear,
}) {
  const { data: countries }    = useCountries();
  const { data: languages }    = useLanguages();
  const { data: publishers }   = usePublishers();
  const { data: lineTypes }    = useLineTypes();
  const { data: bookmakers }   = useBookmakers();
  const { data: sports }       = useSports();
  const { data: currencies }   = useCurrencies();
  const { data: competitions } = useCompetitions();

  const activeCompetitionId =
    structured.competition || structured.Competitions || structured.competitionId || "";
  const { data: seasons } = useSeasons(activeCompetitionId);

  const seenCountryIds = new Set();
  const seenLangIds = new Set();
  const seenPublisherIds = new Set();
  const dbOptions = {
    countries: countries
      .filter((c) => { if (seenCountryIds.has(c.id)) return false; seenCountryIds.add(c.id); return true; })
      .map((c) => ({ value: String(c.id), label: c.name || c.code }))
      .filter((o) => o.label),
    languages: languages
      .filter((l) => { if (seenLangIds.has(l.id)) return false; seenLangIds.add(l.id); return true; })
      .map((l) => ({ value: String(l.id), label: l.name || l.cultureName || l.iso2 }))
      .filter((o) => o.label),
    publishers: [
      { value: "-1", label: "Organic - -1" },
      ...publishers
        .filter((p) => { if (seenPublisherIds.has(p.id)) return false; seenPublisherIds.add(p.id); return true; })
        .map((p) => ({ value: String(p.id), label: p.name ? `${p.name} - ${p.id}` : String(p.id) }))
        .filter((o) => o.label),
    ],
    lineTypes: lineTypes
      .map((t) => {
        const cleaned = t.name
          .replace(/bet/gi, "")
          .replace(/([A-Z])/g, " $1")
          .replace(/(\d)\s+X(?=\d)/g, "$1X")
          .replace(/(\d+X\d+)/g, " $1")
          .replace(/\s+/g, " ")
          .trim();
        return { value: String(t.id), label: `${cleaned} - ${t.id}` };
      }),
    bookmakers: bookmakers
      .map((b) => ({ value: String(b.id), label: `${b.name} - ${b.id}` })),
    sports: sports
      .map((s) => ({ value: String(s.id), label: `${s.name} - ${s.id}` })),
    currencies: currencies
      .map((c) => ({ value: String(c.id), label: `${c.name} - ${c.id}` })),
    competitions: competitions
      .map((c) => ({ value: String(c.id), label: `${c.name} - ${c.id}` })),
    seasons: seasons
      .map((s) => ({ value: String(s.id), label: String(s.id) })),
  };

  const activeEndpoint = mobileApiEndpoints.find((e) => e.url === baseUrl);
  const visibleKeys = activeEndpoint ? new Set(activeEndpoint.params) : null;

  return (
    <div className="card">
      <h2>Builder</h2>
      <label className="label">Base URL</label>
      <BaseUrlSelect value={baseUrl} onChange={onBaseUrlChange} />

      {groups.map(({ key, title }) => {
        const fields = structuredFields.filter((f) => {
          if (f.group !== key) return false;
          if (f.group === "query") return visibleKeys?.has(f.key) ?? false;
          return !visibleKeys || visibleKeys.has(f.key);
        });
        if (fields.length === 0) return null;
        const textAndSelect = fields.filter((f) => f.type !== "checkbox");
        const checkboxes    = fields.filter((f) => f.type === "checkbox");

        return (
          <div className="param-group" key={key}>
            <div className="param-group-title">{title}</div>
            {textAndSelect.length > 0 && (
              <div className="param-grid">
                {textAndSelect.map((field) => (
                  <ParamField
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    value={structured[field.key]}
                    onChange={(val) => onParamChange(field.key, val)}
                    placeholder={field.placeholder}
                    options={field.options}
                    dbOptions={field.dbKey ? dbOptions[field.dbKey] : undefined}
                    searchUrl={field.searchUrl}
                  />
                ))}
              </div>
            )}
            {checkboxes.length > 0 && (
              <div className="param-toggles">
                {checkboxes.map((field) => (
                  <ParamField
                    key={field.key}
                    label={field.label}
                    type="checkbox"
                    value={structured[field.key]}
                    onChange={(val) => onParamChange(field.key, val)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="param-group">
        <div className="extra-params-header">
          <div className="param-group-title">Extra parameters</div>
          <button className="ghost" onClick={onAddExtra}>+ Add</button>
        </div>
        {extras.map(({ id, key, value }) => (
          <div className="extra-param-row" key={id}>
            <input placeholder="key" value={key} onChange={(e) => onExtraChange(id, "key", e.target.value)} />
            <input placeholder="value" value={value} onChange={(e) => onExtraChange(id, "value", e.target.value)} />
            <button className="ghost" onClick={() => onRemoveExtra(id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="row">
        <button className="ghost" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
