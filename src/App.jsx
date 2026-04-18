import { useState } from "react";
import { exampleUrl } from "./constants/fields";
import { parseUrl, buildUrl } from "./utils/urlUtils";
import { useParams } from "./hooks/useParams";
import { useRequest } from "./hooks/useRequest";
import { useHistory } from "./hooks/useHistory";
import BuilderPanel from "./components/builder/BuilderPanel";
import ResponseSummary from "./components/response/ResponseSummary";
import ResponseViewer from "./components/response/ResponseViewer";
import History from "./components/History";

function loadExample() {
  return parseUrl(exampleUrl);
}

export default function App() {
  const [requestUrl, setRequestUrl] = useState(exampleUrl);
  const [baseUrl, setBaseUrl] = useState(() => loadExample().baseUrl);
  const [urlStatus, setUrlStatus] = useState({ message: "", isError: false });

  const params = useParams();
  const request = useRequest();
  const history = useHistory();
  const [distribution, setDistribution] = useState(null);

  // Initialise with example params on mount
  useState(() => { params.populate(loadExample().params); });

  function handleLoadExample() {
    const parsed = parseUrl(exampleUrl);
    setRequestUrl(exampleUrl);
    setBaseUrl(parsed.baseUrl);
    params.populate(parsed.params);
    setUrlStatus({ message: "Example URL loaded.", isError: false });
  }


  function handleBuild() {
    if (!baseUrl.trim()) {
      setUrlStatus({ message: "Provide a base URL.", isError: true });
      return;
    }
    try {
      const built = buildUrl(baseUrl.trim(), params.readAll());
      setRequestUrl(built);
      setUrlStatus({ message: "URL built from builder.", isError: false });
    } catch {
      setUrlStatus({ message: "Base URL is invalid.", isError: true });
    }
  }

  async function handleSend() {
    if (!requestUrl.trim()) {
      setUrlStatus({ message: "Paste or build a URL first.", isError: true });
      return;
    }
    const result = await request.sendRequest(requestUrl.trim());
    if (result) {
      history.addEntry(result.url, result.statusLabel);
      const { uc, publisher, apptype } = params.structured;
      const qp = new URLSearchParams();
      if (uc)        qp.set("countryId",   uc);
      if (publisher) qp.set("publisherId", publisher);
      if (apptype)   qp.set("appType",     apptype);
      fetch(`http://localhost:3001/api/distribution?${qp}`)
        .then((r) => r.json())
        .then(setDistribution)
        .catch(() => setDistribution([]));
    }
  }

  function handleClear() {
    params.clear();
    setBaseUrl("");
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>Betting Request Simulator</h1>
          <p>Build and send requests to the betting rules backend service.</p>
        </div>
        <button className="secondary" onClick={handleLoadExample}>Load example</button>
      </header>

      <section className="card">
        <h2>Request URL</h2>
        <div className="row">
          <input
            type="url"
            spellCheck="false"
            placeholder="https://mobileapi.365scores.com/Data/Games/GameCenter/?games=4467438&lang=10&uc=13"
            value={requestUrl}
            onChange={(e) => setRequestUrl(e.target.value)}
          />
          <button onClick={handleBuild}>Build URL</button>
          <button className="secondary" onClick={handleSend}>Send request</button>
        </div>
        {urlStatus.message && (
          <div className="status" style={{ color: urlStatus.isError ? "#ff7d7d" : "#9aa3b2" }}>
            {urlStatus.message}
          </div>
        )}
      </section>

      <section className="grid">
        <BuilderPanel
          baseUrl={baseUrl}
          onBaseUrlChange={setBaseUrl}
          structured={params.structured}
          onParamChange={params.setParam}
          extras={params.extras}
          onAddExtra={params.addExtra}
          onRemoveExtra={params.removeExtra}
          onExtraChange={params.setExtraField}
          onClear={handleClear}
        />

        <div className="right-column">
          <ResponseSummary responseJson={request.responseJson} distribution={distribution} />
          <ResponseViewer
            responseJson={request.responseJson}
            rawText={request.rawText}
            responseStatus={request.responseStatus}
          />
        </div>
      </section>

      <History entries={history.entries} />
    </main>
  );
}
