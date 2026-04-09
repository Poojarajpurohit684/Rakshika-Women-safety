# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Direct Browser-to-Twilio Fetch
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing case — any `triggerSOS` invocation where `api.post('/sos/trigger')` resolves successfully
  - In `client/src/pages/Dashboard.jsx` (unfixed), mock `api.post('/sos/trigger')` to resolve with `{ data: { notified: 1 } }` and mock `window.fetch` as a spy
  - Assert that `window.fetch` was called with `'https://rakshika-8850.twil.io/send-sos'` — this WILL pass on unfixed code, confirming the bug condition holds
  - Assert that after the fix, `window.fetch` is NEVER called with that URL (property: for all `triggerSOS` invocations, no direct fetch to the Twilio Function URL)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS on fixed code (fetch spy is never called) — confirms the bug is eliminated
  - Document counterexample found: `triggerSOS()` → `fetch('https://rakshika-8850.twil.io/send-sos', ...)` is invoked, returns `403 Forbidden` / `net::ERR_FAILED`
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - SOS Outcomes Unchanged Across All Backend Response Variants
  - **IMPORTANT**: Follow observation-first methodology
  - Observe on UNFIXED code: `triggerSOS()` with mock `/sos/trigger` returning `{ notified: 0 }` → status = "SOS Sent (No Contacts!)", alert fires
  - Observe on UNFIXED code: `triggerSOS()` with mock `/sos/trigger` returning `{ notified: 3 }` → status = "SOS Sent! Notified 3 Guardians", alert fires
  - Observe on UNFIXED code: `triggerSOS()` with mock `/sos/trigger` rejecting → status = "SOS Failed: ...", manual-call alert fires
  - Observe on UNFIXED code: `api.post('/sos/trigger', coords)` always receives the geolocation coordinates unchanged
  - Write property-based test: for all `notified` values in [0..100], status string matches expected pattern (`"SOS Sent (No Contacts!)"` when 0, `"SOS Sent! Notified N Guardians"` when N > 0)
  - Write property-based test: for all random backend error messages, status always starts with `"SOS Failed:"`
  - Write property-based test: for all random coordinate pairs `{ lat, lng }`, `api.post('/sos/trigger', coords)` always receives them unchanged
  - Verify all tests PASS on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Fix CORS error — remove direct browser-to-Twilio fetch from triggerSOS

  - [x] 3.1 Remove the secondary Twilio fetch block and dead mapUrl variable from Dashboard.jsx
    - In `client/src/pages/Dashboard.jsx`, locate the `triggerSOS` async function
    - Delete the entire inner `try/catch` block that calls `fetch('https://rakshika-8850.twil.io/send-sos', ...)` — this is the only frontend change needed
    - Delete the `mapUrl` constant (e.g. `const mapUrl = coords.lat ? \`https://www.google.com/maps?q=...\` : 'Location unavailable'`) — it was only used by the removed fetch block and is now dead code
    - Leave all other code in `triggerSOS` completely unchanged: geolocation logic, `api.post('/sos/trigger', coords)` call, status/alert logic, and error handling
    - Make zero changes to JSX, styles, or any other component
    - _Bug_Condition: isBugCondition(input) — browser executes fetch('https://rakshika-8850.twil.io/send-sos') from triggerSOS_
    - _Expected_Behavior: triggerSOS calls only api.post('/sos/trigger', coords) and completes without any CORS error or net::ERR_FAILED_
    - _Preservation: all status messages, alerts, geolocation forwarding, and error handling remain identical to the original_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.2 Review server/routes/sos.js, server/utils/twilio.js, and server/utils/notifications.js
    - Confirm `POST /sos/trigger` fetches all saved contacts for the authenticated user and dispatches SMS and WhatsApp to each
    - Confirm `server/utils/twilio.js` sends SMS and WhatsApp correctly using the Twilio SDK (server-side, no CORS concerns)
    - Confirm `server/utils/notifications.js` (if used) correctly formats and routes notifications
    - If any gap is found (e.g. contacts not fetched, SMS not sent), apply the minimal fix needed and document it
    - No changes expected — this review is a confidence check only
    - _Requirements: 2.2, 3.1_

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - No Direct Browser-to-Twilio Fetch
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 asserts `window.fetch` is never called with the Twilio Function URL
    - Run bug condition exploration test from step 1 against the fixed code
    - **EXPECTED OUTCOME**: Test PASSES (confirms the CORS-causing fetch has been removed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - SOS Outcomes Unchanged Across All Backend Response Variants
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all preservation property tests from step 2 against the fixed code
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in status messages, alerts, geolocation, or error handling)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite and confirm all tests pass
  - Verify no CORS errors appear in the browser DevTools Network tab when the SOS button is pressed
  - Ensure the `mapUrl` variable no longer exists anywhere in `triggerSOS`
  - Ensure `fetch` with the Twilio Function URL no longer appears anywhere in `Dashboard.jsx`
  - Ask the user if any questions arise
