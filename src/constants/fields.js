export const exampleUrl =
  "https://mobileapi.365scores.com/Data/Games/GameCenter/?apptype=1&appversion=6.3.4&games=4467438&lang=10&oddsformat=1&shownaodds=true&storeversion=6.3.4&theme=light&tz=15&uc=13&usertestgroup=69&withexpanded=true&withexpandedstats=true&withnews=true&withstats=false&publisher=147";

export const structuredFields = [
  // ── Endpoint-specific query params (shown per endpoint) ──────────────────
  { id: "p-games",               key: "games",               type: "text",      group: "query",  label: "Game ID" },
  { id: "p-topBM",               key: "topBM",               type: "text",      group: "query",  label: "Top BM" },
  { id: "p-lineid",              key: "lineid",              type: "text",      group: "query",  label: "Line ID",              placeholder: "789" },
  { id: "p-pid",                 key: "pid",                 type: "text",      group: "query",  label: "Player ID",            placeholder: "-1" },
  { id: "p-uid",                 key: "uid",                 type: "text",      group: "query",  label: "Update ID",            placeholder: "0" },
  { id: "p-id",                  key: "id",                  type: "text",      group: "query",  label: "Competitor ID" },
  { id: "p-Sections",            key: "Sections",            type: "text",      group: "query",  label: "Sections" },
  { id: "p-CompetitionID",       key: "CompetitionID",       type: "text",      group: "query",  label: "Competition ID" },
  { id: "p-NewsLang",            key: "NewsLang",            type: "text",      group: "query",  label: "News Language" },
  { id: "p-startdate",           key: "startdate",           type: "text",      group: "query",  label: "Start Date",           placeholder: "dd/MM/yyyy" },
  { id: "p-enddate",             key: "enddate",             type: "text",      group: "query",  label: "End Date",             placeholder: "dd/MM/yyyy" },
  { id: "p-competitors",         key: "competitors",         type: "text",      group: "query",  label: "Competitors" },
  { id: "p-FullCurrTime",        key: "FullCurrTime",        type: "checkbox",  group: "query",  label: "Full Curr Time" },
  { id: "p-light",               key: "light",               type: "checkbox",  group: "query",  label: "Light Response" },
  { id: "p-WithMainOdds",        key: "WithMainOdds",        type: "checkbox",  group: "query",  label: "With Main Odds" },
  { id: "p-WithOddsPreviews",    key: "WithOddsPreviews",    type: "checkbox",  group: "query",  label: "With Odds Previews" },
  { id: "p-WithTrendOutcomes",   key: "WithTrendOutcomes",   type: "checkbox",  group: "query",  label: "With Trend Outcomes" },
  { id: "p-month",               key: "month",               type: "text",      group: "query",  label: "Month",                placeholder: "MM/yyyy" },
  { id: "p-competitions",        key: "competitions",        type: "text",      group: "query",  label: "Competitions" },
  { id: "p-favoriteCompetitors", key: "favoriteCompetitors", type: "text",      group: "query",  label: "Favorite Competitors" },
  { id: "p-sid",                 key: "sid",                 type: "text",      group: "query",  label: "Sport ID" },
  { id: "p-competition",         key: "competition",         type: "text",      group: "query",  label: "Competition ID" },
  { id: "p-athlete",             key: "athlete",             type: "text",      group: "query",  label: "Athlete ID" },
  { id: "p-count",               key: "count",               type: "text",      group: "query",  label: "Count",                placeholder: "3" },
  { id: "p-season",              key: "season",              type: "text",      group: "query",  label: "Season" },
  { id: "p-showBettingAddon",    key: "showBettingAddon",    type: "checkbox",  group: "query",  label: "Show Betting Addon" },
  { id: "p-Competitions",        key: "Competitions",        type: "text",      group: "query",  label: "Competitions" },
  { id: "p-Season",              key: "Season",              type: "text",      group: "query",  label: "Season" },
  { id: "p-competitionId",       key: "competitionId",       type: "text",      group: "query",  label: "Competition ID" },
  { id: "p-weekKey",             key: "weekKey",             type: "text",      group: "query",  label: "Week Key" },
  { id: "p-langid",              key: "langid",              type: "text",      group: "query",  label: "Language ID" },

  // ── Legacy Game Center params (shown for unrecognised / old URLs) ─────────
  { id: "p-withexpanded",        key: "withexpanded",        type: "checkbox",  group: "game",   label: "With expanded" },
  { id: "p-withexpandedstats",   key: "withexpandedstats",   type: "checkbox",  group: "game",   label: "With expanded stats" },
  { id: "p-withnews",            key: "withnews",            type: "checkbox",  group: "game",   label: "With news" },
  { id: "p-withstats",           key: "withstats",           type: "checkbox",  group: "game",   label: "With stats" },

  // ── Client ────────────────────────────────────────────────────────────────
  { id: "p-apptype",             key: "apptype",             type: "select",    group: "client", label: "App type",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — iOS" }, { value: "2", label: "2 — Android" }] },
  { id: "p-appversion",          key: "appversion",          type: "text",      group: "client", label: "App version",    placeholder: "6.3.4" },
  { id: "p-storeversion",        key: "storeversion",        type: "text",      group: "client", label: "Store version",  placeholder: "6.3.4" },
  { id: "p-publisher",           key: "publisher",           type: "db-select", group: "client", label: "Publisher",      dbKey: "publishers" },
  { id: "p-theme",               key: "theme",               type: "select",    group: "client", label: "Theme",
    options: [{ value: "", label: "—" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },

  // ── User ──────────────────────────────────────────────────────────────────
  { id: "p-lang",                key: "lang",                type: "db-select", group: "user",   label: "Language",       dbKey: "languages" },
  { id: "p-uc",                  key: "uc",                  type: "db-select", group: "user",   label: "User country",   dbKey: "countries" },
  { id: "p-tz",                  key: "tz",                  type: "text",      group: "user",   label: "Timezone",       placeholder: "15" },
  { id: "p-usertestgroup",       key: "usertestgroup",       type: "text",      group: "user",   label: "User test group", placeholder: "69" },

  // ── Odds ──────────────────────────────────────────────────────────────────
  { id: "p-oddsformat",          key: "oddsformat",          type: "select",    group: "odds",   label: "Odds format",
    options: [{ value: "", label: "—" }, { value: "1", label: "1 — Decimal" }, { value: "2", label: "2 — American" }, { value: "3", label: "3 — Fractional" }] },
  { id: "p-shownaodds",          key: "shownaodds",          type: "checkbox",  group: "odds",   label: "Show N/A odds" },
];

// Standard params sent on every known mobileapi request
const STD  = ["apptype", "appversion", "storeversion", "publisher", "theme", "lang", "uc", "tz", "usertestgroup"];
const ODDS = ["oddsformat", "shownaodds"];

export const mobileApiEndpoints = [
  { label: "Game Center – Statistics",       url: "https://mobileapinew.365scores.com/Data/Games/GameCenter/Statistics/PreGame",      params: [...STD, "games", "topBM"] },
  { label: "Game Center – Odds Movements",   url: "https://mobileapinew.365scores.com/Data/Bets/Lines/Graphs/",                       params: [...STD, ...ODDS, "lineid", "topBM"] },
  { label: "Game Center – Shot Chart",       url: "https://mobileapinew.365scores.com/Data/Games/GameCenter/EventsChart/",             params: [...STD, "games", "pid", "uid"] },
  { label: "Competitor Dashboard",           url: "https://mobileapinew.365scores.com/Data/Entities/Competitors/Dashboard",           params: [...STD, "id", "topBM", "Sections", "CompetitionID", "NewsLang"] },
  { label: "Competitor Matches Calendar",    url: "https://mobileapinew.365scores.com/Data/Games/Dashboard",                          params: [...STD, ...ODDS, "competitors", "startdate", "enddate", "topBM", "FullCurrTime", "light", "WithMainOdds", "WithOddsPreviews", "WithTrendOutcomes"] },
  { label: "Calendar / Events",              url: "https://mobileapinew.365scores.com/data/games/calendar",                           params: [...STD, "month", "competitors", "competitions", "favoriteCompetitors", "sid"] },
  { label: "Player Card – Season Stats",     url: "https://mobileapinew.365scores.com/Data/Entities/Athletes/SeasonStatistics",       params: [...STD, "competition", "athlete"] },
  { label: "Bet of the Day",                 url: "https://mobileapinew.365scores.com/data/bets/BetsOfTheDay",                        params: [...STD, ...ODDS, "count", "topBM"] },
  { label: "Outrights – Competition",        url: "https://mobileapinew.365scores.com/data/outrightsPromotions/competition",          params: [...STD, "competition", "season", "showBettingAddon"] },
  { label: "Outrights – All Competitions",   url: "https://mobileapinew.365scores.com/data/outrightsPromotions/allCompetitions",      params: STD },
  { label: "Standings – Past Tables",        url: "https://mobileapinew.365scores.com/Data/competitionSeasons",                       params: [...STD, "Competitions", "Season"] },
  { label: "Standings – Past Season",        url: "https://mobileapinew.365scores.com/Data/competitionSeasons/season",                params: [...STD, "Competitions", "Season"] },
  { label: "Standings – Most Titles",        url: "https://mobileapinew.365scores.com/Data/Entities/Competitions/MostTitles",         params: [...STD, "competitionId"] },
  { label: "Standings – Team of the Week",   url: "https://mobileapinew.365scores.com/Data/Entities/Competitions/TeamOfTheWeek",      params: [...STD, "weekKey", "langid"] },
];

export const mockDistribution = [
  { id: 14,  name: "Bet365",       color: "#007B5B", pct: 42 },
  { id: 2,   name: "William Hill", color: "#4a90d9", pct: 21 },
  { id: 5,   name: "Ladbrokes",    color: "#e03232", pct: 16 },
  { id: 8,   name: "Betway",       color: "#00a651", pct: 12 },
  { id: 11,  name: "Coral",        color: "#0070b8", pct:  9 },
];
