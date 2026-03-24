// Mock bookmaker distribution — placeholder until real logic is wired in
const mockDistribution = [
  { id: 14,  name: "Bet365",       color: "#007B5B", pct: 42 },
  { id: 2,   name: "William Hill", color: "#4a90d9", pct: 21 },
  { id: 5,   name: "Ladbrokes",    color: "#e03232", pct: 16 },
  { id: 8,   name: "Betway",       color: "#00a651", pct: 12 },
  { id: 11,  name: "Coral",        color: "#0070b8", pct:  9 },
];

const exampleUrl =
  "https://mobileapi.365scores.com/Data/Games/GameCenter/?apptype=1&appversion=6.3.4&games=4467438&lang=10&oddsformat=1&shownaodds=true&storeversion=6.3.4&theme=light&tz=15&uc=13&usertestgroup=69&withexpanded=true&withexpandedstats=true&withnews=true&withstats=false&publisher=147";

const structuredFields = [
  { id: "p-games",            key: "games",            type: "text" },
  { id: "p-withexpanded",     key: "withexpanded",     type: "checkbox" },
  { id: "p-withexpandedstats",key: "withexpandedstats",type: "checkbox" },
  { id: "p-withnews",         key: "withnews",         type: "checkbox" },
  { id: "p-withstats",        key: "withstats",        type: "checkbox" },
  { id: "p-apptype",          key: "apptype",          type: "select" },
  { id: "p-appversion",       key: "appversion",       type: "text" },
  { id: "p-storeversion",     key: "storeversion",     type: "text" },
  { id: "p-publisher",        key: "publisher",        type: "text" },
  { id: "p-theme",            key: "theme",            type: "select" },
  { id: "p-lang",             key: "lang",             type: "text" },
  { id: "p-uc",               key: "uc",               type: "text" },
  { id: "p-tz",               key: "tz",               type: "text" },
  { id: "p-usertestgroup",    key: "usertestgroup",    type: "text" },
  { id: "p-oddsformat",       key: "oddsformat",       type: "select" },
  { id: "p-shownaodds",       key: "shownaodds",       type: "checkbox" },
];

const extraParamsContainer = document.getElementById("extraParams");
const addParamButton       = document.getElementById("addParam");

const requestUrlInput  = document.getElementById("requestUrl");
const parseButton      = document.getElementById("parseUrl");
const sendRequestButton= document.getElementById("sendRequest");
const loadExampleButton= document.getElementById("loadExample");
const urlStatus        = document.getElementById("urlStatus");
const baseUrlInput     = document.getElementById("baseUrl");
const buildUrlButton   = document.getElementById("buildUrl");
const clearParamsButton= document.getElementById("clearParams");
const responseStatus   = document.getElementById("responseStatus");
const responseBody     = document.getElementById("responseBody");
const summarySection   = document.getElementById("summarySection");
const summaryContent   = document.getElementById("summaryContent");
const historyList      = document.getElementById("history");

const historyEntries = [];

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "#ff7d7d" : "#9aa3b2";
}

function clearStatus(element) {
  element.textContent = "";
}

function parseUrl(urlString) {
  const url = new URL(urlString);
  const params = [];
  url.searchParams.forEach((value, key) => params.push({ key, value }));
  return { baseUrl: url.origin + url.pathname, params };
}

function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  params.forEach(({ key, value }) => {
    if (key) url.searchParams.set(key, value);
  });
  return url.toString();
}

function populateStructuredParams(params) {
  const knownKeys = new Set(structuredFields.map(({ key }) => key.toLowerCase()));
  const map = {};
  params.forEach(({ key, value }) => { map[key.toLowerCase()] = value; });

  structuredFields.forEach(({ id, key, type }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const value = map[key.toLowerCase()];
    if (value === undefined) return;
    if (type === "checkbox") {
      el.checked = value === "true";
    } else {
      el.value = value;
    }
  });

  extraParamsContainer.innerHTML = "";
  params
    .filter(({ key }) => !knownKeys.has(key.toLowerCase()))
    .forEach(({ key, value }) => {
      extraParamsContainer.append(createExtraParamRow(key, value));
    });
}

function readParamsFromUI() {
  const structured = structuredFields.flatMap(({ id, key, type }) => {
    const el = document.getElementById(id);
    if (!el) return [];
    const value = type === "checkbox" ? String(el.checked) : el.value.trim();
    if (value === "" || value === "false") return [];
    return [{ key, value }];
  });
  return [...structured, ...readExtraParams()];
}

function clearStructuredParams() {
  structuredFields.forEach(({ id, type }) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (type === "checkbox") el.checked = false;
    else el.value = "";
  });
  extraParamsContainer.innerHTML = "";
}

function createExtraParamRow(key = "", value = "") {
  const row = document.createElement("div");
  row.className = "extra-param-row";

  const keyInput = document.createElement("input");
  keyInput.placeholder = "key";
  keyInput.value = key;
  keyInput.className = "extra-param-key";

  const valueInput = document.createElement("input");
  valueInput.placeholder = "value";
  valueInput.value = value;

  const removeBtn = document.createElement("button");
  removeBtn.className = "ghost";
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => row.remove());

  row.append(keyInput, valueInput, removeBtn);
  return row;
}

function readExtraParams() {
  return Array.from(extraParamsContainer.querySelectorAll(".extra-param-row"))
    .map((row) => {
      const [keyEl, valueEl] = row.querySelectorAll("input");
      return { key: keyEl.value.trim(), value: valueEl.value.trim() };
    })
    .filter(({ key }) => key.length > 0);
}

function collectBMIDs(obj, counts = {}) {
  if (!obj || typeof obj !== "object") return counts;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectBMIDs(item, counts));
  } else {
    if (obj.BMID !== undefined) {
      counts[obj.BMID] = (counts[obj.BMID] || 0) + 1;
    }
    Object.values(obj).forEach((val) => collectBMIDs(val, counts));
  }
  return counts;
}

function buildSummary(json) {
  summarySection.classList.remove("summary-hidden");
  summaryContent.innerHTML = "";

  // Resolve actual returned bookmaker from response
  const bmMeta = {};
  function collectBmMeta(obj) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) { obj.forEach(collectBmMeta); return; }
    if (Array.isArray(obj.Bookmakers)) {
      obj.Bookmakers.forEach((bm) => {
        if (bm.ID && !bmMeta[bm.ID]) {
          bmMeta[bm.ID] = { name: bm.Name, color: bm.Color || "#4f77ff" };
        }
      });
    }
    Object.values(obj).forEach(collectBmMeta);
  }
  collectBmMeta(json);

  const topBmId = json.Games?.[0]?.TopBookmaker ?? null;
  const returnedBm = topBmId !== null
    ? (bmMeta[topBmId] || { name: `BM #${topBmId}`, color: "#4f77ff" })
    : null;

  // ── Returned bookmaker ──────────────────────────────────────
  if (returnedBm) {
    const topEl = document.createElement("div");
    topEl.className = "summary-top";
    topEl.innerHTML = `
      <div class="summary-section-label">Returned bookmaker</div>
      <div class="summary-returned">
        <div class="summary-returned-dot" style="background:${returnedBm.color}"></div>
        <div class="summary-returned-name" style="color:${returnedBm.color}">${returnedBm.name}</div>
      </div>
    `;
    summaryContent.append(topEl);
  }

  // ── Potential distribution (mock) ───────────────────────────
  const distEl = document.createElement("div");
  distEl.className = "summary-dist";

  const distLabel = document.createElement("div");
  distLabel.className = "summary-section-label";
  distLabel.innerHTML = 'Potential distribution <span class="summary-mock-badge">mock</span>';
  distEl.append(distLabel);

  mockDistribution.forEach(({ id, name, color, pct }) => {
    const isReturned = id === topBmId;
    const row = document.createElement("div");
    row.className = "summary-row" + (isReturned ? " summary-row-returned" : "");
    row.innerHTML = `
      <div class="summary-row-info">
        <div class="summary-row-left">
          <div class="summary-row-dot" style="background:${color}"></div>
          <span class="summary-row-name">${name}</span>
          ${isReturned ? '<span class="summary-returned-badge">returned</span>' : ""}
        </div>
        <span class="summary-row-pct">${pct}%</span>
      </div>
      <div class="summary-bar-track">
        <div class="summary-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>
    `;
    distEl.append(row);
  });

  summaryContent.append(distEl);
}

function createJsonNode(value, depth = 0) {
  if (value === null) {
    const s = document.createElement("span");
    s.className = "json-null";
    s.textContent = "null";
    return s;
  }
  if (typeof value === "boolean") {
    const s = document.createElement("span");
    s.className = "json-boolean";
    s.textContent = String(value);
    return s;
  }
  if (typeof value === "number") {
    const s = document.createElement("span");
    s.className = "json-number";
    s.textContent = String(value);
    return s;
  }
  if (typeof value === "string") {
    const s = document.createElement("span");
    s.className = "json-string";
    s.textContent = `"${value}"`;
    return s;
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? value.map((v, i) => [i, v])
    : Object.entries(value);
  const openBracket  = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  const wrapper = document.createElement("div");
  wrapper.className = "json-node";

  if (entries.length === 0) {
    const empty = document.createElement("span");
    empty.className = "json-bracket";
    empty.textContent = openBracket + closeBracket;
    wrapper.append(empty);
    return wrapper;
  }

  // Header row: toggle ▼ { (N keys)
  const headerRow = document.createElement("div");
  headerRow.className = "json-header";

  const toggle = document.createElement("button");
  toggle.className = "json-toggle-btn";
  toggle.textContent = "▼";

  const bracketOpen = document.createElement("span");
  bracketOpen.className = "json-bracket";
  bracketOpen.textContent = openBracket;

  const summary = document.createElement("span");
  summary.className = "json-summary";
  summary.textContent = isArray
    ? ` ${entries.length} items`
    : ` ${entries.length} keys`;

  const collapsedInline = document.createElement("span");
  collapsedInline.className = "json-collapsed-inline";
  collapsedInline.textContent = isArray ? " […]" : " {…}";
  collapsedInline.style.display = "none";

  headerRow.append(toggle, bracketOpen, summary, collapsedInline);

  // Children
  const children = document.createElement("div");
  children.className = "json-children";

  entries.forEach(([key, val], idx) => {
    const row = document.createElement("div");
    row.className = "json-row";

    if (!isArray) {
      const keySpan = document.createElement("span");
      keySpan.className = "json-key";
      keySpan.textContent = `"${key}": `;
      row.append(keySpan);
    }

    row.append(createJsonNode(val, depth + 1));

    if (idx < entries.length - 1) {
      const comma = document.createElement("span");
      comma.className = "json-comma";
      comma.textContent = ",";
      row.append(comma);
    }

    children.append(row);
  });

  const bracketClose = document.createElement("div");
  bracketClose.className = "json-bracket";
  bracketClose.textContent = closeBracket;

  const startCollapsed = depth >= 1;

  if (startCollapsed) {
    children.style.display        = "none";
    bracketClose.style.display    = "none";
    summary.style.display         = "none";
    collapsedInline.style.display = "inline";
    toggle.textContent            = "▶";
  }

  toggle.addEventListener("click", () => {
    const isCollapsed = children.style.display === "none";
    children.style.display        = isCollapsed ? "" : "none";
    bracketClose.style.display    = isCollapsed ? "" : "none";
    summary.style.display         = isCollapsed ? "" : "none";
    collapsedInline.style.display = isCollapsed ? "none" : "inline";
    toggle.textContent            = isCollapsed ? "▼" : "▶";
  });

  wrapper.append(headerRow, children, bracketClose);
  return wrapper;
}

function updateHistory(url, status) {
  historyEntries.unshift({ url, status, time: new Date().toLocaleTimeString() });
  historyList.innerHTML = "";
  historyEntries.slice(0, 8).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.status}</strong> — <span class="muted">${item.time}</span><br /><span class="muted">${item.url}</span>`;
    historyList.append(li);
  });
}

async function sendRequest() {
  clearStatus(urlStatus);
  clearStatus(responseStatus);
  const urlValue = requestUrlInput.value.trim();
  if (!urlValue) {
    setStatus(urlStatus, "Paste or build a URL first.", true);
    return;
  }

  responseBody.classList.remove("muted");
  responseBody.textContent = "Sending request...";

  let response;
  try {
    response = await fetch(urlValue, { method: "GET" });
  } catch (error) {
    responseBody.textContent = "";
    setStatus(responseStatus, "Request failed. This is often a CORS restriction in the browser.", true);
    return;
  }

  let bodyText = "";
  let bodyJson = null;
  try {
    bodyText = await response.text();
    bodyJson = JSON.parse(bodyText);
  } catch (_) {}

  const statusLabel = `${response.status} ${response.statusText}`;
  if (!response.ok) {
    setStatus(responseStatus, `Request returned ${statusLabel}.`, true);
  } else {
    setStatus(responseStatus, `Response received (${statusLabel}).`);
  }

  responseBody.innerHTML = "";
  responseBody.classList.remove("muted");
  if (bodyJson !== null) {
    responseBody.append(createJsonNode(bodyJson));
    buildSummary(bodyJson);
  } else {
    responseBody.textContent = bodyText || "(No response body)";
  }

  updateHistory(urlValue, statusLabel);
}

function initialize() {
  const parsed = parseUrl(exampleUrl);
  requestUrlInput.value = exampleUrl;
  baseUrlInput.value = parsed.baseUrl;
  populateStructuredParams(parsed.params);
}

loadExampleButton.addEventListener("click", () => {
  const parsed = parseUrl(exampleUrl);
  requestUrlInput.value = exampleUrl;
  baseUrlInput.value = parsed.baseUrl;
  populateStructuredParams(parsed.params);
  setStatus(urlStatus, "Example URL loaded.");
});

parseButton.addEventListener("click", () => {
  clearStatus(urlStatus);
  const urlValue = requestUrlInput.value.trim();
  if (!urlValue) {
    setStatus(urlStatus, "Paste a URL to parse.", true);
    return;
  }
  try {
    const parsed = parseUrl(urlValue);
    baseUrlInput.value = parsed.baseUrl;
    populateStructuredParams(parsed.params);
    setStatus(urlStatus, "Parsed into builder.");
  } catch (_) {
    setStatus(urlStatus, "Invalid URL.", true);
  }
});

sendRequestButton.addEventListener("click", sendRequest);

buildUrlButton.addEventListener("click", () => {
  clearStatus(urlStatus);
  const baseUrl = baseUrlInput.value.trim();
  if (!baseUrl) {
    setStatus(urlStatus, "Provide a base URL.", true);
    return;
  }
  try {
    const builtUrl = buildUrl(baseUrl, readParamsFromUI());
    requestUrlInput.value = builtUrl;
    setStatus(urlStatus, "URL built from builder.");
  } catch (_) {
    setStatus(urlStatus, "Base URL is invalid.", true);
  }
});

addParamButton.addEventListener("click", () => {
  extraParamsContainer.append(createExtraParamRow());
});

clearParamsButton.addEventListener("click", () => {
  clearStructuredParams();
  baseUrlInput.value = "";
});

initialize();
