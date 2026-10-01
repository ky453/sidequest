# Sidequest

React, TypeScript, and Vite app with React Router and Lucide icons.

## Run

```sh
npm install
npm run dev
```

`npm test` checks scheduling, memory fields, photo selection limits, and plan import validation. `npm run lint` checks source code. `npm run build` checks TypeScript and creates the production bundle.

## Current Scope

Discover, Activity Details, Plans, and Add Memory follow their PNGs in `design/`. Product behavior follows `docs/Sidequest_PRD.md`. Each `/activities/:experienceId` page uses the selected mock experience. `/plans` shows shared plans and completed-memory prompts. `/memories` is a read-only list of the user's saved entries, styled from the Memories PNG; it contains no invented sample memories. Profile and notifications remain disabled.

Search, budget, distance, mood, and category filters work against mock Ithaca experiences. The first three recommendations match the design; See all, search, and filtering also expose additional mock activities. Budget matching uses the upper estimated cost so the entire range fits the selected limit. The image areas intentionally match the empty placeholders in the PNG. Device status and home indicators are omitted from the web UI.

Search and filter values use URL parameters. Save and Add to Plan are independent actions held in a shared React context. Add to Plan opens a scheduling modal; cancelling it does not create a plan. State survives route navigation but resets on refresh. There is no backend or browser storage.

Activity Details uses the same Save and Plan actions as Discover. The back arrow preserves Discover's search and filters when entered from a card, and returns to Discover for direct links. The share button copies the activity's direct URL. Event dates appear in the About section when supplied in the mock data; other detail fields without a current design remain deferred. Distances and locations come from the existing mock records, including where the reference PNG uses different example values.

Plans starts on today's date in Ithaca and includes shared mock records for the October 9 market visit and September 30 completed movie night. The full Sunday-Saturday month grid is generated programmatically, with previous/next controls that cross year boundaries. Today has a peach highlight and outline, the selected day is teal, and planned events have subtle dots. Selecting a day highlights it and shows only its scheduled events. Adjacent-month dates are also selectable; the date input supports jumping to any date. Month arrows select the first day of the destination month. Add Event, or a long press on a calendar day, opens a searchable experience picker followed by scheduling without leaving Plans. Saving or editing a schedule automatically displays its month and selects its exact date.

Flexible activities require an explicit date, start time, and end time. Activity Details leaves these blank for a new plan; Add Event defaults only the date to the selected calendar day. Times are local to Ithaca (Eastern Time), and the end must be after the start on the same day. The market is a fixed event on October 9, 2026, from 4:00 PM to 6:00 PM; its fields are locked. Clicking a scheduled event opens Edit Plan. Flexible plans can be rescheduled or removed; fixed events cannot be rescheduled. Either kind can be marked completed in the plan modal. Saving a schedule selects that date in Plans. Dismiss hides a completed-memory prompt without deleting the completed record. Planning another visit preserves past completed records.

Calendar Import and Export operate on local Sidequest JSON files, not external calendars. Version 2 exports include explicit `plannedDate`, `startTime`, `endTime`, and `status`, as well as completed records and prompt dismissals. Import validates record IDs, activity references, statuses, dates, time ranges, and fixed schedules before merging. Older unscheduled exports are rejected rather than assigned invented schedules. Calendar exports contain plans only, not memories or local photos.

Add Memory opens from a completed plan, with its experience name and scheduled date pre-filled. Name and date are required; rating (1-5), people, journal, spending, and photo are optional per the PRD. Blank spending stays unset, while zero explicitly records a free experience. Friend names are trimmed and deduplicated; the X removes a tag. A local JPEG, PNG, WebP, or GIF up to 5 MB can be previewed, replaced, or removed. Images are kept as in-memory data URLs, never uploaded. Save Memory associates the entry with both its Experience and completed Plan, hides that plan's outstanding memory prompt, and navigates to `/memories`. Each completed plan has at most one memory; another completed visit can have its own. Back and Cancel return to Plans without saving. Memories and photos reset on refresh along with the rest of local state; summaries, memory editing, and cloud storage are outside this step.

Selected rating stars are filled. Add Memory pre-fills Start Time and End Time from the completed plan. Users can change the range to record the actual experience times in Eastern Time, or clear both fields. A supplied range must have both endpoints and end after its start on the same day, using the same validation as planning. The saved memory displays the range without modifying the original plan schedule.

## Structure

- `src/components/`: shared app shell, navigation, header, search, filters, buttons, experience cards, calendar, and accessible planning modals.
- `src/data/`: typed mock experiences and category metadata.
- `src/lib/`: search/filter logic and display formatting.
- `src/state/`: shared saved-experience, plan, and memory state.
- `src/views/`: Discover, Activity Details, Plans, Add Memory, a saved-memory list, and unknown-route handling.
- `src/types.ts`: experience, saved-experience, plan, and memory models.

Future deployment must serve `index.html` for app routes to support direct links with BrowserRouter. Features without current designs, including available-time filters and submissions, are deferred.
