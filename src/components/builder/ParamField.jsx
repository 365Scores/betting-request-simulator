import { useState, useRef } from "react";

function DbSelect({ label, value, onChange, dbOptions = [] }) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLabel = dbOptions.find((o) => o.value === value)?.label ?? "";

  const filtered = text
    ? dbOptions.filter((o) => o.label.toLowerCase().includes(text.toLowerCase()))
    : dbOptions;

  function handleFocus() {
    setText("");
    setIsOpen(true);
  }

  function handleChange(e) {
    setText(e.target.value);
    setIsOpen(true);
    if (!e.target.value) onChange("");
  }

  function handleSelect(opt) {
    onChange(opt.value);
    setText(opt.label);
    setIsOpen(false);
  }

  function handleBlur(e) {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
      setText("");
    }
  }

  return (
    <div className="param-field">
      <label className="label">{label}</label>
      <div className="db-select" ref={containerRef} onBlur={handleBlur}>
        <input
          type="text"
          value={isOpen ? text : selectedLabel}
          placeholder="Search…"
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {isOpen && (
          <div className="db-select-dropdown">
            {filtered.slice(0, 100).map((opt) => (
              <div
                key={opt.value}
                className={"db-select-option" + (opt.value === value ? " db-select-option--selected" : "")}
                onMouseDown={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="db-select-option" style={{ color: "#6b7585" }}>No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParamField({ label, type, value, onChange, placeholder, options, dbOptions }) {
  if (type === "checkbox") {
    return (
      <label className="toggle-label">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }

  if (type === "db-select") {
    return <DbSelect label={label} value={value} onChange={onChange} dbOptions={dbOptions} />;
  }

  if (type === "select") {
    return (
      <div className="param-field">
        <label className="label">{label}</label>
        <div className="select-wrapper">
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="param-field">
      <label className="label">{label}</label>
      <input type="text" value={value} placeholder={placeholder || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
