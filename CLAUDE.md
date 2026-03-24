# Betting Request Simulator

## Project overview
A REST-based browser client for visualising, building, and sending requests to the company's betting rules backend service. Built with **React + Vite**.

## Running locally
```bash
npm run dev
```
Then open `http://localhost:5173` in Chrome.

## Git
- `main` — stable baseline
- `claude-v1` — initial vanilla JS build
- `response_summary_v1` — active branch; React migration + Response Summary feature

## Architecture

### Framework
React 18 + Vite 5. No state management library — all state lives in `App.jsx` via hooks.

### Source structure
```
src/
├── main.jsx                          # Entry point; mounts <App />
├── styles.css                        # Global dark-theme styles
├── App.jsx                           # Root component; wires all hooks and callbacks
│
├── constants/
│   └── fields.js                     # structuredFields, mockDistribution, exampleUrl
│
├── utils/
│   ├── urlUtils.js                   # parseUrl(), buildUrl()
│   └── jsonUtils.js                  # collectBmMeta()
│
├── hooks/
│   ├── useParams.js                  # Structured + extra param state
│   ├── useRequest.js                 # Fetch logic, response state
│   └── useHistory.js                 # Last 8 request history
│
└── components/
    ├── History.jsx
    ├── builder/
    │   ├── BuilderPanel.jsx          # Full builder card
    │   └── ParamField.jsx            # text / select / checkbox field
    └── response/
        ├── ResponseSummary.jsx       # Returned BM + mock distribution bars
        ├── ResponseViewer.jsx        # Scrollable response card
        └── JsonNode.jsx              # Recursive collapsible JSON tree
```

### Legacy files (root)
`app.js`, `styles.css` — original vanilla JS build, kept for reference. Not served by Vite.

## Example endpoint
```
https://mobileapi.365scores.com/Data/Games/GameCenter/
```

### Known query parameters
| Parameter | Key | Type | Notes |
|---|---|---|---|
| Game ID | `games` | text | |
| With expanded | `withexpanded` | checkbox | |
| With expanded stats | `withexpandedstats` | checkbox | |
| With news | `withnews` | checkbox | |
| With stats | `withstats` | checkbox | |
| App type | `apptype` | select | 1 = iOS, 2 = Android |
| App version | `appversion` | text | |
| Store version | `storeversion` | text | |
| Publisher | `publisher` | text | |
| Theme | `theme` | select | light / dark |
| Language | `lang` | text | |
| User country | `uc` | text | |
| Timezone | `tz` | text | |
| User test group | `usertestgroup` | text | |
| Odds format | `oddsformat` | select | 1 = Decimal, 2 = American, 3 = Fractional |
| Show N/A odds | `shownaodds` | checkbox | |

## UI structure
1. **Request URL bar** — paste or build a URL; Parse / Send request buttons
2. **Builder** (left panel) — structured param groups (Game, Client, User, Odds) + Extra parameters section for unknown params
3. **Right column** (stacked):
   - **Response Summary** — returned bookmaker (from `Games[0].TopBookmaker`) + mock bookmaker distribution bars; always visible with shimmer skeleton before first request
   - **Response viewer** — interactive collapsible JSON tree, 450px scrollable, collapsed from depth 1 by default
4. **History** — last 8 sent requests with status code and timestamp

## Design
- Dark theme (`#0f1115` background, `#171a21` cards)
- Font: Inter (system fallback), applied via `font-family: inherit` on all form controls
- `color-scheme: dark` + `select-wrapper` div pattern for native dropdown dark styling
- JSON tree colour coding: keys = blue, strings = light blue, numbers = yellow, booleans = red, null = grey
- Shimmer animation on skeleton placeholders in Response Summary
