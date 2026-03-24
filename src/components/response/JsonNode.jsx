import { useState } from "react";

function Primitive({ value }) {
  if (value === null) return <span className="json-null">null</span>;
  if (typeof value === "boolean") return <span className="json-boolean">{String(value)}</span>;
  if (typeof value === "number") return <span className="json-number">{value}</span>;
  if (typeof value === "string") return <span className="json-string">"{value}"</span>;
  return null;
}

export default function JsonNode({ value, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth >= 1);

  if (value === null || typeof value !== "object") {
    return <Primitive value={value} />;
  }

  const isArray = Array.isArray(value);
  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value);
  const openBracket  = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  if (entries.length === 0) {
    return <span className="json-bracket">{openBracket}{closeBracket}</span>;
  }

  const summary = isArray ? ` ${entries.length} items` : ` ${entries.length} keys`;

  return (
    <div className="json-node">
      <div className="json-header">
        <button className="json-toggle-btn" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="json-bracket">{openBracket}</span>
        {collapsed ? (
          <span className="json-collapsed-inline"> {isArray ? "[…]" : "{…}"}</span>
        ) : (
          <span className="json-summary">{summary}</span>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="json-children">
            {entries.map(([key, val], idx) => (
              <div className="json-row" key={key}>
                {!isArray && <span className="json-key">"{key}": </span>}
                <JsonNode value={val} depth={depth + 1} />
                {idx < entries.length - 1 && <span className="json-comma">,</span>}
              </div>
            ))}
          </div>
          <div className="json-bracket">{closeBracket}</div>
        </>
      )}
    </div>
  );
}
