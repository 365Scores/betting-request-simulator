export const exampleUrl =
  "https://mobileapi.365scores.com/Data/Games/GameCenter/?AppType=1&AppVersion=14.0.0&StoreVersion=14.0.0&games=4467438&lang=10&oddsformat=1&shownaodds=true&theme=light&tz=15&uc=13&UserTestGroup=69&withexpanded=true&withexpandedstats=true&withnews=true&withstats=false&publisher=147&athletesSupported=true";

export const structuredFields = [
  // ── Endpoint-specific query params (shown per endpoint) ──────────────────
  { id: "p-games",               key: "games",               type: "text",      group: "query",  label: "Game ID" },
  { id: "p-gameId",              key: "gameId",              type: "text",      group: "query",  label: "Game ID" },
  { id: "p-gameid",              key: "gameid",              type: "text",      group: "query",  label: "Game ID" },
  { id: "p-topBM",               key: "topBM",               type: "db-select", group: "query",  label: "Bookmaker",    dbKey: "bookmakers" },
  { id: "p-lineid",              key: "lineid",              type: "db-select", group: "query",  label: "Line Type",            dbKey: "lineTypes" },
  { id: "p-pid",                 key: "pid",                 type: "text",      group: "query",  label: "Player ID",            placeholder: "-1" },
  { id: "p-uid",                 key: "uid",                 type: "text",      group: "query",  label: "Update ID",            placeholder: "0" },
  { id: "p-id",                  key: "id",                  type: "server-search", group: "query", label: "Competitor",   searchUrl: "/competitors" },
  { id: "p-Sections",            key: "Sections",            type: "text",      group: "query",  label: "Sections" },
  { id: "p-CompetitionID",       key: "CompetitionID",       type: "db-select", group: "query",  label: "Competition",  dbKey: "competitions" },
  { id: "p-NewsLang",            key: "NewsLang",            type: "db-select", group: "query",  label: "News Language", dbKey: "languages" },
  { id: "p-newsSources",         key: "newsSources",         type: "text",      group: "query",  label: "News Sources" },
  { id: "p-startdate",           key: "startdate",           type: "text",      group: "query",  label: "Start Date",           placeholder: "dd/MM/yyyy" },
  { id: "p-enddate",             key: "enddate",             type: "text",      group: "query",  label: "End Date",             placeholder: "dd/MM/yyyy" },
  { id: "p-competitors",         key: "competitors",         type: "server-search", group: "query", label: "Competitor", searchUrl: "/competitors" },
  { id: "p-FullCurrTime",        key: "FullCurrTime",        type: "checkbox",  group: "query",  label: "Full Curr Time" },
  { id: "p-light",               key: "light",               type: "checkbox",  group: "query",  label: "Light Response" },
  { id: "p-WithMainOdds",        key: "WithMainOdds",        type: "checkbox",  group: "query",  label: "With Main Odds" },
  { id: "p-WithOddsPreviews",    key: "WithOddsPreviews",    type: "checkbox",  group: "query",  label: "With Odds Previews" },
  { id: "p-WithTrendOutcomes",   key: "WithTrendOutcomes",   type: "checkbox",  group: "query",  label: "With Trend Outcomes" },
  { id: "p-month",               key: "month",               type: "text",      group: "query",  label: "Month",                placeholder: "MM/yyyy" },
  { id: "p-competitions",        key: "competitions",        type: "db-select",     group: "query", label: "Competition",        dbKey: "competitions" },
  { id: "p-favoriteCompetitors", key: "favoriteCompetitors", type: "server-search", group: "query", label: "Favorite Competitor", searchUrl: "/competitors" },
  { id: "p-sid",                 key: "sid",                 type: "db-select",     group: "query", label: "Sport",              dbKey: "sports" },
  { id: "p-competition",         key: "competition",         type: "db-select", group: "query",  label: "Competition",  dbKey: "competitions" },
  { id: "p-athlete",             key: "athlete",             type: "server-search", group: "query", label: "Athlete",      searchUrl: "/competitors" },
  { id: "p-countryId",           key: "countryId",           type: "db-select", group: "query",  label: "Country",      dbKey: "countries" },
  { id: "p-sportTypeId",         key: "sportTypeId",         type: "text",      group: "query",  label: "Sport Type ID" },
  { id: "p-limit",               key: "limit",               type: "text",      group: "query",  label: "Limit",                placeholder: "100" },
  { id: "p-count",               key: "count",               type: "text",      group: "query",  label: "Count",                placeholder: "3" },
  { id: "p-season",              key: "season",              type: "db-select", group: "query",  label: "Season",       dbKey: "seasons" },
  { id: "p-showBettingAddon",    key: "showBettingAddon",    type: "checkbox",  group: "query",  label: "Show Betting Addon" },
  { id: "p-Competitions",        key: "Competitions",        type: "db-select", group: "query",  label: "Competition",  dbKey: "competitions" },
  { id: "p-Season",              key: "Season",              type: "db-select", group: "query",  label: "Season",       dbKey: "seasons" },
  { id: "p-competitionId",       key: "competitionId",       type: "db-select", group: "query",  label: "Competition",  dbKey: "competitions" },
  { id: "p-weekKey",             key: "weekKey",             type: "text",      group: "query",  label: "Week Key" },
  { id: "p-langid",              key: "langid",              type: "db-select", group: "query",  label: "Language",     dbKey: "languages" },
  { id: "p-appendChildCountries",key: "appendChildCountries",type: "checkbox",  group: "query",  label: "Append Child Countries" },
  { id: "p-langId",              key: "langId",              type: "db-select", group: "query",  label: "Language",     dbKey: "languages" },
  { id: "p-version",             key: "version",             type: "text",      group: "query",  label: "Version" },

  // ── Legacy Game Center params (shown for unrecognised / old URLs) ─────────
  { id: "p-withexpanded",        key: "withexpanded",        type: "checkbox",  group: "game",   label: "With expanded" },
  { id: "p-withexpandedstats",   key: "withexpandedstats",   type: "checkbox",  group: "game",   label: "With expanded stats" },
  { id: "p-withnews",            key: "withnews",            type: "checkbox",  group: "game",   label: "With news" },
  { id: "p-withstats",           key: "withstats",           type: "checkbox",  group: "game",   label: "With stats" },

  // ── Client ────────────────────────────────────────────────────────────────
  { id: "p-AppType",             key: "AppType",             type: "select",    group: "client", label: "App type",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — iOS" }, { value: "2", label: "2 — Android" }] },
  { id: "p-AppVersion",          key: "AppVersion",          type: "text",      group: "client", label: "App version",    placeholder: "14.0.0" },
  { id: "p-StoreVersion",        key: "StoreVersion",        type: "text",      group: "client", label: "Store version",  placeholder: "14.0.0" },
  { id: "p-publisher",           key: "publisher",           type: "db-select", group: "client", label: "Publisher",      dbKey: "publishers" },
  { id: "p-theme",               key: "theme",               type: "select",    group: "client", label: "Theme",
    options: [{ value: "", label: "—" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  { id: "p-athletesSupported",   key: "athletesSupported",   type: "checkbox",  group: "client", label: "Athletes Supported", default: true },
  { id: "p-campaign",            key: "campaign",            type: "text",      group: "client", label: "Campaign" },
  { id: "p-adgroup",             key: "adgroup",             type: "text",      group: "client", label: "Ad Group" },

  // ── User ──────────────────────────────────────────────────────────────────
  { id: "p-lang",                key: "lang",                type: "db-select", group: "user",   label: "Language",       dbKey: "languages" },
  { id: "p-uc",                  key: "uc",                  type: "db-select", group: "user",   label: "User country",   dbKey: "countries" },
  { id: "p-tz",                  key: "tz",                  type: "text",      group: "user",   label: "Timezone",       placeholder: "15" },
  { id: "p-UserTestGroup",       key: "UserTestGroup",       type: "text",      group: "user",   label: "User test group", placeholder: "69" },
  { id: "p-UserCurrency",        key: "UserCurrency",        type: "db-select", group: "user",   label: "User currency",  dbKey: "currencies", default: "1" },

  // ── Odds ──────────────────────────────────────────────────────────────────
  { id: "p-oddsformat",          key: "oddsformat",          type: "select",    group: "odds",   label: "Odds format",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — Decimal" }, { value: "2", label: "2 — American" }, { value: "3", label: "3 — Fractional" }] },
  { id: "p-shownaodds",          key: "shownaodds",          type: "checkbox",  group: "odds",   label: "Show N/A odds" },
];

// Standard params sent on every known mobileapi request
const STD  = ["lang", "AppType", "AppVersion", "StoreVersion", "uc", "tz", "theme", "athletesSupported", "UserCurrency", "UserTestGroup", "publisher", "campaign", "adgroup"];
const ODDS = ["oddsformat", "shownaodds"];

export const mobileApiEndpoints = [
  { label: "Game Center Details",            url: "https://mobileapi.365scores.com/Data/Games/GameCenter/",                              params: [...STD, "games", ...ODDS, "withexpanded", "withexpandedstats", "withnews", "withstats"] },
  { label: "Game Center – Statistics",       url: "https://mobileapinew.365scores.com/Data/Games/GameCenter/Statistics/PreGame",          params: [...STD, "gameId", "topBM"] },
  { label: "Game Center – Odds Movements",   url: "https://mobileapinew.365scores.com/Data/Bets/Lines/Graphs/",                           params: [...STD, "lineid", "topBM"] },
  { label: "Game Center – Shot Chart",       url: "https://mobileapinew.365scores.com/Data/Games/GameCenter/EventsChart/",                 params: [...STD, "gameid", "pid", "uid"] },
  { label: "Competitor Dashboard",           url: "https://mobileapinew.365scores.com/Data/Entities/Competitors/Dashboard",               params: [...STD, "id", "topBM", "Sections", "CompetitionID", "NewsLang", "newsSources"] },
  { label: "Competitor Matches Calendar",    url: "https://mobileapinew.365scores.com/Data/Games/Dashboard",                              params: [...STD, "competitors", "startdate", "enddate", "FullCurrTime", "light", "shownaodds", "WithMainOdds", "WithOddsPreviews", "oddsformat", "topBM", "WithTrendOutcomes"] },
  { label: "Calendar / Events",              url: "https://mobileapinew.365scores.com/data/games/calendar",                               params: [...STD, "month", "competitors", "competitions", "favoriteCompetitors", "sid"] },
  { label: "Player Card – Season Stats",     url: "https://mobileapinew.365scores.com/Data/Entities/Athletes/SeasonStatistics",           params: [...STD, "competition", "athlete"] },
  { label: "Search",                         url: "https://mobileapinew.365scores.com/Data/Favorites/BySport",                            params: [...STD, "countryId", "sportTypeId", "limit"] },
  { label: "Bet of the Day",                 url: "https://mobileapinew.365scores.com/data/bets/BetsOfTheDay",                            params: [...STD, "count", "topBM"] },
  { label: "Outrights – Competition",        url: "https://mobileapinew.365scores.com/data/outrightsPromotions/competition",              params: [...STD, "competition", "season", "showBettingAddon"] },
  { label: "Outrights – All Competitions",   url: "https://mobileapinew.365scores.com/data/outrightsPromotions/allCompetitions",          params: STD },
  { label: "Standings – Past Tables",        url: "https://mobileapinew.365scores.com/Data/competitionSeasons",                           params: [...STD, "Competitions", "Season"] },
  { label: "Standings – Past Season",        url: "https://mobileapinew.365scores.com/Data/competitionSeasons/season",                    params: [...STD, "Competitions", "Season"] },
  { label: "Standings – Most Titles",        url: "https://mobileapinew.365scores.com/Data/Entities/Competitions/MostTitles",             params: [...STD, "competitionId"] },
  { label: "Standings – Team of the Week",   url: "https://mobileapinew.365scores.com/Data/Entities/Competitions/TeamOfTheWeek",          params: [...STD, "weekKey", "langid"] },
  { label: "App Init – Countries",           url: "https://mobileapinew.365scores.com/Data/Entities/Countries",                           params: [...STD, "appendChildCountries"] },
  { label: "App Init – Currencies",          url: "https://mobileapinew.365scores.com/data/init/currencies",                              params: STD },
  { label: "Bolao (Game Pools)",             url: "https://mobileapinew.365scores.com/bolao/settings",                                    params: [...STD, "countryId", "langId", "version"] },
];

export const mockDistribution = [
  { id: 14,  name: "Bet365",       color: "#007B5B", pct: 42 },
  { id: 2,   name: "William Hill", color: "#4a90d9", pct: 21 },
  { id: 5,   name: "Ladbrokes",    color: "#e03232", pct: 16 },
  { id: 8,   name: "Betway",       color: "#00a651", pct: 12 },
  { id: 11,  name: "Coral",        color: "#0070b8", pct:  9 },
];
