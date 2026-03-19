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

  responseBody.textContent = bodyJson
    ? JSON.stringify(bodyJson, null, 2)
    : bodyText || "(No response body)";

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
