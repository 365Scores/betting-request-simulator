import { structuredFields } from "../../constants/fields";
import ParamField from "./ParamField";

const groups = [
  { key: "game",   title: "Game" },
  { key: "client", title: "Client" },
  { key: "user",   title: "User" },
  { key: "odds",   title: "Odds" },
];

export default function BuilderPanel({
  baseUrl, onBaseUrlChange,
  structured, onParamChange,
  extras, onAddExtra, onRemoveExtra, onExtraChange,
  onBuild, onClear,
}) {
  return (
    <div className="card">
      <h2>Builder</h2>
      <label className="label">Base URL</label>
      <input type="url" spellCheck="false" value={baseUrl} onChange={(e) => onBaseUrlChange(e.target.value)} />

      {groups.map(({ key, title }) => {
        const fields = structuredFields.filter((f) => f.group === key);
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
        <button className="secondary" onClick={onBuild}>Build URL</button>
        <button className="ghost" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
