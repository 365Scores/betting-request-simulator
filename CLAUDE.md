# Betting Request Simulator

## Project overview
A REST-based browser client for visualising, building, and sending requests to the company's betting rules backend service. Built as a static HTML/CSS/JS app served locally via Python's `http.server`.

## Running locally
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080` in Chrome.

## Git
- Main work branch: `claude-v1`
- Initial commit on `main`, all feature work on `claude-v1`

## Architecture
- `index.html` — layout and markup
- `styles.css` — dark-theme styles
- `app.js` — all logic (no frameworks, vanilla JS)

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
3. **Response** (right panel) — interactive collapsible JSON tree, 450px scrollable, collapsed from depth 1 by default
4. **History** — last 8 sent requests with status code and timestamp

## Design
- Dark theme (`#0f1115` background, `#171a21` cards)
- Font: Inter (system fallback)
- `color-scheme: dark` + `select-wrapper` div pattern for native dropdown dark styling
- JSON tree colour coding: keys = blue, strings = light blue, numbers = yellow, booleans = red, null = grey
