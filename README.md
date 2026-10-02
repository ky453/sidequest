# Sidequest

React, TypeScript, and Vite app with React Router and Lucide icons.

## Run

```sh
npm install
npm run dev
```

`npm test` checks Discover filters, scheduling, memory fields, search/sorting, seeded associations, monthly profile statistics, budget validation, photo selection limits, and plan import validation/merging. `npm run lint` checks source code. `npm run build` checks TypeScript and creates the production bundle. See [the QA report](docs/QA_Report.md) for tested journeys and remaining limitations.

## Current Scope

Discover, Activity Details, Plans, Add Memory, Memories, and Profile follow their PNGs in `design/`. Product behavior follows `docs/Sidequest_PRD.md`. Each `/activities/:experienceId` page uses the selected mock experience. `/plans` shows shared plans and completed-memory prompts. `/memories` shows searchable, editable entries from shared state, including two seeded mock memories matching the reference cards. `/profile` displays the user's editable basic information and computed monthly recap. Notifications remain disabled.

Search, budget, distance, mood, and category filters work against mock Ithaca experiences. The first three recommendations match the design; See all, search, and filtering also expose additional mock activities. Budget matching uses the upper estimated cost so the entire range fits the selected limit. The image areas intentionally match the empty placeholders in the PNG. Device status and home indicators are omitted from the web UI.

Search and filter values use URL parameters. Save and Add to Plan are independent actions held in a shared React context. Add to Plan opens a scheduling modal; cancelling it does not create a plan. State survives route navigation but resets on refresh. There is no backend or browser storage.

Activity Details uses the same Save and Plan actions as Discover. The back arrow preserves Discover's search and filters when entered from a card, and returns to Discover for direct links. The share button copies the activity's direct URL. Event dates appear in the About section when supplied in the mock data; other detail fields without a current design remain deferred. Distances and locations come from the existing mock records, including where the reference PNG uses different example values.

Plans starts on today's date in Ithaca and includes shared mock records for the October 9 market visit and September 30 completed movie night. The full Sunday-Saturday month grid is generated programmatically, with previous/next controls that cross year boundaries. Today has a peach highlight and outline, the selected day is teal, and planned events have subtle dots. Selecting a day highlights it and shows only its scheduled events. Adjacent-month dates are also selectable; the date input supports jumping to any date. Month arrows select the first day of the destination month. Add Event, or a long press on a calendar day, opens a searchable experience picker followed by scheduling without leaving Plans. Saving or editing a schedule automatically displays its month and selects its exact date.

Flexible activities require an explicit date, start time, and end time. Activity Details leaves these blank for a new plan; Add Event defaults only the date to the selected calendar day. Times are local to Ithaca (Eastern Time), and the end must be after the start on the same day. The market is a fixed event on October 9, 2026, from 4:00 PM to 6:00 PM; its fields are locked. Clicking a scheduled event opens Edit Plan. Flexible plans can be rescheduled or removed; fixed events cannot be rescheduled. Either kind can be marked completed in the plan modal. Saving a schedule selects that date in Plans. Dismiss hides a completed-memory prompt without deleting the completed record. Planning another visit preserves past completed records.

Calendar Import and Export operate on local Sidequest JSON files, not external calendars. Version 2 exports include explicit `plannedDate`, `startTime`, `endTime`, and `status`, as well as completed records and prompt dismissals. Import validates record IDs, activity references, statuses, dates, time ranges, and fixed schedules before merging. A plan linked to a saved memory cannot be reassigned to another activity or reopened as planned by an import. Older unscheduled exports are rejected rather than assigned invented schedules. Calendar exports contain plans only, not memories or local photos.

Add Memory opens from a completed plan, with its experience name and scheduled date pre-filled. Name and date are required; rating (1-5), people, journal, spending, and photo are optional per the PRD. Blank spending stays unset, while zero explicitly records a free experience. Friend names are trimmed and deduplicated; the X removes a tag. A local JPEG, PNG, WebP, or GIF up to 5 MB can be previewed, replaced, or removed. Images are kept as in-memory data URLs, never uploaded. Save Memory associates the entry with both its Experience and completed Plan, hides that plan's outstanding memory prompt, and navigates to `/memories`. Each completed plan has at most one memory; another completed visit can have its own. Back and Cancel return to Plans without saving. Memories and photos reset on refresh along with the rest of local state; cloud storage remains deferred.

Selected rating stars are filled. Add Memory pre-fills Start Time and End Time from the completed plan. Users can change the range to record the actual experience times in Eastern Time, or clear both fields. A supplied range must have both endpoints and end after its start on the same day, using the same validation as planning. The saved memory displays the range without modifying the original plan schedule.

Memories sorts by experience date newest first, then by creation time for entries on the same date. Search matches experience names and journal text, with case-insensitive multi-word matching. Search and the selected detail use URL parameters. Cards open a detail modal showing the full journal, photo, date, time range, rating, people, and spending. Edit Memory at `/memories/:memoryId/edit` reuses the Add Memory form with every field pre-filled; saving immediately updates the list without changing the original experience/plan links or plan schedule. Back and Cancel discard edits and return to the previous detail/search. Delete Memory requires confirmation and removes only the memory, retaining its completed plan; that plan's undismissed Add Memory prompt becomes available again. The two seeded entries have corresponding completed mock plans and placeholder images matching the PNG. No extra filter controls are added because the Memories reference contains none.

Profile starts in the current Ithaca month and uses `?month=YYYY-MM` for previous-month navigation, including past years. Next is disabled in the current month; future or invalid month URLs fall back to the current month. Spending sums only the selected month's recorded memory amounts in cents. Ratings average only rated memories. Completed visits count each completed plan once, including those without a memory, and use the memory's recorded date when available; otherwise they use the plan's scheduled date. A memory whose plan was replaced by an import still counts as a completed visit. New places counts unique experience IDs among those visits, not repeat visits. Deleting a memory removes its spending/rating but retains its plan's completion history. Empty months show zero totals and no favorites rather than sample statistics.

The Profile mini rows show up to three actual selected-month memories, highest ratings first and newest first for ties, with local photos when present. Clicking a row opens a read-only Memory Detail modal over Profile without changing the route or selected month. This preview has no editing, deletion, or interactive rating controls; only the Memories page enables Edit/Delete in the shared detail modal. Closing or pressing Escape restores focus to the favorite row. Edit Profile changes name, year, location, and budget; the budget pencil opens the same lightweight form with only its budget field. The profile starts with the reference's mock name/location and a $300 recreational budget. This is a recurring monthly target shared across the recap months, not a historical budget ledger. Editing it updates progress and remaining spending immediately. Progress caps at 100% and displays an explicit over-budget amount when needed; a zero budget never produces an invalid percentage. Profile edits reset on refresh like all prototype state. There is no authentication, bank connection, or external API.

Profile places the month selector above the budget, followed immediately by Recent Spending in the same unframed spending group. The list shows up to three newest recorded amounts for that month, including explicit zero but excluding unset amounts. See all/See less expands or collapses the month's list in place; it is disabled when all entries already fit. Monthly Summary follows this spending group and contains only the experience statistics; Favorite Memories stays last. Month changes reset the spending expansion without changing memory data.

## Structure

- `src/components/`: shared app shell, navigation, header, search, filters, buttons, experience cards, calendar, accessible modals, memory form/detail, and profile editing form.
- `src/data/`: typed mock experiences, plans, memories, profile, and category metadata.
- `src/lib/`: search/filter logic, monthly summaries, validation, and display formatting.
- `src/state/`: shared saved-experience, plan, memory, and profile state.
- `src/views/`: Discover, Activity Details, Plans, Add/Edit Memory, Memories, Profile, and unknown-route handling.
- `src/types.ts`: experience, saved-experience, plan, memory, and profile models.

Future deployment must serve `index.html` for app routes to support direct links with BrowserRouter. Features without current designs, including available-time filters and submissions, are deferred.
