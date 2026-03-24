export const exampleUrl =
  "https://mobileapi.365scores.com/Data/Games/GameCenter/?apptype=1&appversion=6.3.4&games=4467438&lang=10&oddsformat=1&shownaodds=true&storeversion=6.3.4&theme=light&tz=15&uc=13&usertestgroup=69&withexpanded=true&withexpandedstats=true&withnews=true&withstats=false&publisher=147";

export const structuredFields = [
  { id: "p-games",             key: "games",             type: "text",     group: "game",   label: "Game ID" },
  { id: "p-withexpanded",      key: "withexpanded",      type: "checkbox", group: "game",   label: "With expanded" },
  { id: "p-withexpandedstats", key: "withexpandedstats", type: "checkbox", group: "game",   label: "With expanded stats" },
  { id: "p-withnews",          key: "withnews",          type: "checkbox", group: "game",   label: "With news" },
  { id: "p-withstats",         key: "withstats",         type: "checkbox", group: "game",   label: "With stats" },
  { id: "p-apptype",           key: "apptype",           type: "select",   group: "client", label: "App type",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — iOS" }, { value: "2", label: "2 — Android" }] },
  { id: "p-appversion",        key: "appversion",        type: "text",     group: "client", label: "App version",    placeholder: "6.3.4" },
  { id: "p-storeversion",      key: "storeversion",      type: "text",     group: "client", label: "Store version",  placeholder: "6.3.4" },
  { id: "p-publisher",         key: "publisher",         type: "db-select", group: "client", label: "Publisher",      dbKey: "publishers" },
  { id: "p-theme",             key: "theme",             type: "select",   group: "client", label: "Theme",
    options: [{ value: "", label: "—" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  { id: "p-lang",              key: "lang",              type: "db-select", group: "user",  label: "Language",       dbKey: "languages" },
  { id: "p-uc",                key: "uc",                type: "db-select", group: "user",  label: "User country",   dbKey: "countries" },
  { id: "p-tz",                key: "tz",                type: "text",     group: "user",   label: "Timezone",       placeholder: "15" },
  { id: "p-usertestgroup",     key: "usertestgroup",     type: "text",     group: "user",   label: "User test group", placeholder: "69" },
  { id: "p-oddsformat",        key: "oddsformat",        type: "select",   group: "odds",   label: "Odds format",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — Decimal" }, { value: "2", label: "2 — American" }, { value: "3", label: "3 — Fractional" }] },
  { id: "p-shownaodds",        key: "shownaodds",        type: "checkbox", group: "odds",   label: "Show N/A odds" },
];

export const mockDistribution = [
  { id: 14,  name: "Bet365",       color: "#007B5B", pct: 42 },
  { id: 2,   name: "William Hill", color: "#4a90d9", pct: 21 },
  { id: 5,   name: "Ladbrokes",    color: "#e03232", pct: 16 },
  { id: 8,   name: "Betway",       color: "#00a651", pct: 12 },
  { id: 11,  name: "Coral",        color: "#0070b8", pct:  9 },
];
