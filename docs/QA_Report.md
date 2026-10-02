# Sidequest QA Pass

Date: October 1, 2026. Scope: existing prototype only; no redesign, new product features, backend, or external services.

## Bugs Fixed

- Plan imports could change a memory-linked plan's activity or reopen it as planned, breaking the shared association. Imports now reject those changes before updating state.
- Completed-memory prompts sorted timestamp strings, misordering records with different timezone offsets. They now sort by actual time.
- Experience-picker transitions could leave focus outside the scheduling modal. Each modal step now retains focus inside its dialog.
- Completing/removing an event could restore focus to a disappearing trigger. Restoration now waits for DOM updates and falls back to the main content.
- Adding, cancelling, or removing people, and removing a photo, could lose keyboard focus in the memory form. Focus now returns to an appropriate surviving control.
- Route changes had inconsistent scroll/focus behavior. The app shell now scrolls to the top and focuses the content on pathname changes; query-only filters and modal changes retain their context.

## UX and Accessibility

- Already-scheduled experience actions now say **Edit Plan**, matching their behavior, while Save remains independent.
- Discover remains announced as the current navigation section on Activity Details. Navigation and category selections now have non-color visual cues.
- Improved text contrast on teal buttons, active filters, category/date badges, secondary copy, and text actions without replacing the established palette or layouts.
- Improved calendar dot/outline contrast and enlarged small navigation, clear, close, edit, rating, and tag-removal targets. Audited visible enabled controls meet a 24px minimum; most compact controls are 32px or larger.
- Touch-oriented form fields use 16px text to avoid small-input zoom. Readable desktop widths and the requested Profile section order remain unchanged.
- Corrected Profile's statistic definition-list markup so labels precede values semantically, retaining the original visible value-first layout.
- Checked labels, image alternatives, filled-star keyboard interaction, skip link, Escape, modal focus trapping/restoration, empty states, validation messages, and read-only Profile previews. This is not a complete accessibility conformance certification.

## Refactoring

- Centralized route scroll/focus behavior instead of duplicating it in individual views.
- Extracted money validation shared by memories and profile budgets.
- Extracted tested plan-import merging and completed-prompt selection. Shared data remains in the existing provider; no duplicate stores were introduced.
- Added regression tests for Discover filters, safe import merging, prompt ordering, and daylight-saving calendar arithmetic.

## Validation

- Complete journey passed in Chrome at **390px, 768px, and 1440px**, with 39 screenshots and checks for overflow, readable widths, rendered images, text contrast, control sizes, and browser errors.
- Verified search and combined budget/category/mood/distance filters; Save/unsave propagation; flexible and locked fixed scheduling; arbitrary months and year boundaries; event editing/removal/completion; memory creation, search, detail, editing, deletion, and newest-first ordering.
- Verified memory mutations immediately recalculate Profile spending, ratings, completed counts, unique places, favorites, and Recent Spending, including date changes between months. Budget edits, zero/over-budget states, previous-month navigation, and empty months passed.
- Six existing browser regression suites passed: scheduling, monthly calendar, memory creation/photos, memory timeline, Profile spending, and read-only Profile favorites. These also cover 320px layouts, local photo validation, long-press cancellation, JSON import/export, cancellation, and association guards.
- `npm test`: **30 passing tests**. `npm run lint`: passed. `npm run build`: TypeScript and production bundle passed. No browser console errors or network writes were observed in the tested flows.
- The same complete responsive journey also passed against the production preview; direct-route smoke checks cover all screens and missing routes.

## Remaining Limitations

- All state and photos remain in memory and reset on refresh. JSON export contains plans only, not memories or photos.
- Profile has **no budget-aware Discover CTA** in the current implementation. Discover's explicit budget filter works, but it is not automatically linked to the monthly remaining budget. This gap was deferred rather than introducing a feature during QA.
- The budget is a recurring target, not a historical month-by-month ledger. New places means unique experiences within that month, not first-ever visits.
- Scheduling supports one upcoming plan per experience and same-day time ranges in Ithaca's timezone. Today is initialized when the app loads. Seed data and the fixed mock event retain their reference dates.
- Browser checks used Chrome; Safari, Firefox, real-device input behavior, and assistive-technology testing remain outstanding. Browser automation was run from the local QA harness, not added as a project dependency or CI job.

## Before Persistence or Backend

- Define occurrence IDs, ownership, one-memory-per-completed-plan constraints, import conflicts, and server-side validation before persisting these associations.
- Agree on timezone/DST and overnight rules, midnight refresh behavior, memory-date versus completion-date reporting, historical budgets, and the definition of a new place.
- Store currency in integer cents; add versioned schema migrations and explicit recovery behavior for failed writes.
- Define safe photo storage, size limits, validation, and cleanup before replacing local data URLs.
- Add repeatable browser tests to CI, cross-browser/assistive-technology coverage, and pending/error/retry behavior when asynchronous persistence is introduced.
