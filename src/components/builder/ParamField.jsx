export default function ParamField({ label, type, value, onChange, placeholder, options }) {
  if (type === "checkbox") {
    return (
      <label className="toggle-label">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
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
