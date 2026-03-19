const exampleUrl =
  "https://mobileapi.365scores.com/Data/Dashboard/Light/?NewsLang=9&Countries=&Competitions=352,17,7,103,42,572&Competitors=226,5034,559&Games=4593622,4656261,4653524,4615954,4654785,4615953,4655000&Athletes=48298,39820&UserCountry=21&OnlyInLang=true&OnlyInCountry=false&WithTransfers=true&newsSources=&FilterSourcesOut=true&IsTablet=false&OddsFormat=1&lang=9&AppType=2&AppVersion=1456&uc=21&tz=15&theme=dark&StoreVersion=1456&athletesSupported=true&UserTestGroup=29";

const defaultRules = {
  topBmOverrides: {
    "14": "Bet365",
    "1": "DraftKings",
    "2": "FanDuel",
  },
  countryMap: {
    "39": "Bet365",
    "31": "Caliente",
    "2": "Codere",
    "4": "Tipico",
  },
  langMap: {
    "1": "Bet365",
    "10": "SkyBet",
    "15": "ParionsSport",
  },
  tzMap: {
    "15": "Bet365",
    "0": "Betway",
  },
  fallback: "GenericBookmaker",
};

const paramDisplayNames = {
  NewsLang: "News language",
  Countries: "Countries filter",
  Competitions: "Competitions list",
  Competitors: "Competitors list",
  Games: "Games list",
  Athletes: "Athletes list",
  UserCountry: "User country",
  OnlyInLang: "Only in language",
  OnlyInCountry: "Only in country",
  WithTransfers: "Include transfers",
  newsSources: "News sources",
  FilterSourcesOut: "Filter sources out",
  IsTablet: "Is tablet",
  OddsFormat: "Odds format",
  lang: "Language",
  AppType: "App type",
  AppVersion: "App version",
  uc: "User country code",
  tz: "Timezone",
  theme: "Theme",
  StoreVersion: "Store version",
  athletesSupported: "Athletes supported",
  UserTestGroup: "User test group",
  TopBM: "Top bookmaker",
  withExpanded: "With expanded",
  games: "Game id",
  withstats: "With stats",
  withexpandedstats: "With expanded stats",
  ShowNAOdds: "Show N/A odds",
  WithNews: "Include news",
  attnw: "Attnw",
};

const requestUrlInput = document.getElementById("requestUrl");
const parseButton = document.getElementById("parseUrl");
const simulateButton = document.getElementById("simulate");
const sendRequestButton = document.getElementById("sendRequest");
const loadExampleButton = document.getElementById("loadExample");
const urlStatus = document.getElementById("urlStatus");
const baseUrlInput = document.getElementById("baseUrl");
const paramsContainer = document.getElementById("params");
const addParamButton = document.getElementById("addParam");
const buildUrlButton = document.getElementById("buildUrl");
const clearParamsButton = document.getElementById("clearParams");
const rulesTextarea = document.getElementById("rules");
const validateRulesButton = document.getElementById("validateRules");
const rulesStatus = document.getElementById("rulesStatus");
const resultContainer = document.getElementById("result");
const responseStatus = document.getElementById("responseStatus");
const responseBody = document.getElementById("responseBody");
const historyList = document.getElementById("history");

const historyEntries = [];

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "#ff7d7d" : "#9aa3b2";
}

function clearStatus(element) {
  element.textContent = "";
}

function getDisplayName(key) {
  return paramDisplayNames[key] || key || "Custom parameter";
}

function createParamRow(key = "", value = "") {
  const row = document.createElement("div");
  row.className = "param-row";

  const nameLabel = document.createElement("div");
  nameLabel.className = "param-label";
  nameLabel.textContent = getDisplayName(key);

  const keyInput = document.createElement("input");
  keyInput.placeholder = "key";
  keyInput.value = key;
  keyInput.className = "param-key";
  keyInput.addEventListener("input", () => {
    nameLabel.textContent = getDisplayName(keyInput.value.trim());
  });

  const valueInput = document.createElement("input");
  valueInput.placeholder = "value";
  valueInput.value = value;

  const removeButton = document.createElement("button");
  removeButton.className = "ghost";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => row.remove());

  row.append(nameLabel, keyInput, valueInput, removeButton);
  return row;
}

function populateParams(params) {
  paramsContainer.innerHTML = "";
  if (params.length === 0) {
    paramsContainer.append(createParamRow());
    return;
  }
  params.forEach(({ key, value }) => {
    paramsContainer.append(createParamRow(key, value));
  });
}

function readParamsFromUI() {
  const rows = Array.from(paramsContainer.querySelectorAll(".param-row"));
  return rows
    .map((row) => {
      const inputs = row.querySelectorAll("input");
      return {
        key: inputs[0].value.trim(),
        value: inputs[1].value.trim(),
      };
    })
    .filter((item) => item.key.length > 0);
}

function parseUrl(urlString) {
  const url = new URL(urlString);
  const params = [];
  url.searchParams.forEach((value, key) => {
    params.push({ key, value });
  });
  return { baseUrl: url.origin + url.pathname, params };
}

function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  params.forEach(({ key, value }) => {
    if (key.length === 0) {
      return;
    }
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function parseRules() {
  try {
    const rules = JSON.parse(rulesTextarea.value);
    rulesStatus.textContent = "Rules valid.";
    rulesStatus.style.color = "#7ee787";
    return { rules, error: null };
  } catch (error) {
    rulesStatus.textContent = "Rules invalid JSON.";
    rulesStatus.style.color = "#ff7d7d";
    return { rules: null, error };
  }
}

function determineBookmaker(params, rules) {
  if (!rules) {
    return { bookmaker: "Unknown", reason: "Rules are invalid JSON." };
  }

  const steps = [];
  const topBm = params.TopBM;
  if (topBm && rules.topBmOverrides && rules.topBmOverrides[topBm]) {
    steps.push(`TopBM=${topBm} matched override.`);
    return { bookmaker: rules.topBmOverrides[topBm], reason: steps.join(" ") };
  }

  const country = params.uc;
  if (country && rules.countryMap && rules.countryMap[country]) {
    steps.push(`uc=${country} matched country map.`);
    return { bookmaker: rules.countryMap[country], reason: steps.join(" ") };
  }

  const lang = params.lang;
  if (lang && rules.langMap && rules.langMap[lang]) {
    steps.push(`lang=${lang} matched language map.`);
    return { bookmaker: rules.langMap[lang], reason: steps.join(" ") };
  }

  const tz = params.tz;
  if (tz && rules.tzMap && rules.tzMap[tz]) {
    steps.push(`tz=${tz} matched timezone map.`);
    return { bookmaker: rules.tzMap[tz], reason: steps.join(" ") };
  }

  steps.push("No rule matched; using fallback.");
  return {
    bookmaker: rules.fallback || "Unknown",
    reason: steps.join(" "),
  };
}

function updateHistory(entry) {
  historyEntries.unshift(entry);
  historyList.innerHTML = "";
  historyEntries.slice(0, 8).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.bookmaker}</strong> — ${item.reason}<br /><span class="muted">${item.url}</span>`;
    historyList.append(li);
  });
}

function simulate() {
  clearStatus(urlStatus);
  const urlValue = requestUrlInput.value.trim();
  if (!urlValue) {
    setStatus(urlStatus, "Paste or build a URL first.", true);
    return;
  }

  let parsed;
  try {
    parsed = parseUrl(urlValue);
  } catch (error) {
    setStatus(urlStatus, "Invalid URL.", true);
    return;
  }

  const paramsObject = {};
  parsed.params.forEach(({ key, value }) => {
    paramsObject[key] = value;
  });

  const { rules } = parseRules();
  const selection = determineBookmaker(paramsObject, rules);

  resultContainer.classList.remove("muted");
  const parsedPayload = JSON.stringify(
    { baseUrl: parsed.baseUrl, params: parsed.params },
    null,
    2
  );
  resultContainer.innerHTML = `
    <strong>${selection.bookmaker}</strong>
    <div class="muted">${selection.reason}</div>
    <div class="muted">Parameters: ${parsed.params
      .map((item) => `${item.key}=${item.value}`)
      .join(", ")}</div>
    <pre class="parsed">${parsedPayload}</pre>
  `;

  updateHistory({
    bookmaker: selection.bookmaker,
    reason: selection.reason,
    url: urlValue,
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
    setStatus(
      responseStatus,
      "Request failed. This is often a CORS restriction in the browser.",
      true
    );
    return;
  }

  let bodyText = "";
  let bodyJson = null;
  try {
    bodyText = await response.text();
    bodyJson = JSON.parse(bodyText);
  } catch (error) {
    bodyJson = null;
  }

  if (!response.ok) {
    setStatus(
      responseStatus,
      `Request returned ${response.status} ${response.statusText}.`,
      true
    );
  } else {
    setStatus(
      responseStatus,
      `Response received (${response.status} ${response.statusText}).`
    );
  }

  if (bodyJson) {
    responseBody.textContent = JSON.stringify(bodyJson, null, 2);
  } else if (bodyText) {
    responseBody.textContent = bodyText;
  } else {
    responseBody.textContent = "(No response body)";
  }
}

function initialize() {
  requestUrlInput.value = exampleUrl;
  rulesTextarea.value = JSON.stringify(defaultRules, null, 2);
  parseRules();
  populateParams(parseUrl(exampleUrl).params);
  baseUrlInput.value = parseUrl(exampleUrl).baseUrl;
}

loadExampleButton.addEventListener("click", () => {
  requestUrlInput.value = exampleUrl;
  const parsed = parseUrl(exampleUrl);
  baseUrlInput.value = parsed.baseUrl;
  populateParams(parsed.params);
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
    populateParams(parsed.params);
    setStatus(urlStatus, "Parsed into builder.");
  } catch (error) {
    setStatus(urlStatus, "Invalid URL.", true);
  }
});

simulateButton.addEventListener("click", simulate);
sendRequestButton.addEventListener("click", sendRequest);

addParamButton.addEventListener("click", () => {
  paramsContainer.append(createParamRow());
});

buildUrlButton.addEventListener("click", () => {
  clearStatus(urlStatus);
  const baseUrl = baseUrlInput.value.trim();
  if (!baseUrl) {
    setStatus(urlStatus, "Provide a base URL.", true);
    return;
  }
  const params = readParamsFromUI();
  try {
    const builtUrl = buildUrl(baseUrl, params);
    requestUrlInput.value = builtUrl;
    setStatus(urlStatus, "URL built from builder.");
  } catch (error) {
    setStatus(urlStatus, "Base URL is invalid.", true);
  }
});

clearParamsButton.addEventListener("click", () => {
  paramsContainer.innerHTML = "";
  paramsContainer.append(createParamRow());
});

validateRulesButton.addEventListener("click", () => {
  parseRules();
});

initialize();
