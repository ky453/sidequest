# Sidequest

React, TypeScript, and Vite app with React Router and Lucide icons.

## Run

```sh
npm install
npm run dev
```

`npm run lint` checks source code. `npm run build` checks TypeScript and creates the production bundle.

## Current Scope

Discover follows `design/sidequest-discover.png`. Product behavior follows `docs/Sidequest_PRD.md`. Only Discover is implemented; `/activities/:experienceId` is a minimal route placeholder. Plans, Memories, Profile, and notifications are disabled until their screens are implemented.

Search, budget, distance, mood, and category filters work against mock Ithaca experiences. The first three recommendations match the design; See all, search, and filtering also expose additional mock activities. Budget matching uses the upper estimated cost so the entire range fits the selected limit. The image areas intentionally match the empty placeholders in the PNG. Device status and home indicators are omitted from the web UI.

Search and filter values use URL parameters. Save and Add to Plan are independent, reversible actions held in a shared React context. Plans are unscheduled until scheduling is implemented. State survives route navigation but resets on refresh. There is no backend or browser storage.

## Structure

- `src/components/`: shared app shell, navigation, header, search, filters, buttons, and experience cards.
- `src/data/`: typed mock experiences and category metadata.
- `src/lib/`: search/filter logic and display formatting.
- `src/state/`: shared saved-experience and plan state.
- `src/views/`: Discover and the activity route placeholder.
- `src/types.ts`: experience, saved-experience, and plan models.

Future deployment must serve `index.html` for app routes to support direct links with BrowserRouter. Features without current designs, including available-time filters and submissions, are deferred.
