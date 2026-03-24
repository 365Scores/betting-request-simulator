import JsonNode from "./JsonNode";

export default function ResponseViewer({ responseJson, rawText, responseStatus }) {
  return (
    <div className="card">
      <h2>Response</h2>
      {responseStatus.message && (
        <div className="status" style={{ color: responseStatus.isError ? "#ff7d7d" : "#9aa3b2" }}>
          {responseStatus.message}
        </div>
      )}
      <div className="response">
        {responseJson !== null ? (
          <JsonNode value={responseJson} depth={0} />
        ) : rawText ? (
          <span className="muted">{rawText}</span>
        ) : (
          <span className="muted">No response yet. Send a request to see the parsed response.</span>
        )}
      </div>
    </div>
  );
}
