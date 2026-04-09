# SOS SMS CORS Fix - Bugfix Design

## Overview

The `triggerSOS` function in `client/src/pages/Dashboard.jsx` makes a secondary direct `fetch` call from the browser to `https://rakshika-8850.twil.io/send-sos`. This call is blocked by the browser's CORS policy because the Twilio-hosted function does not return an `Access-Control-Allow-Origin` header, resulting in a `403 Forbidden` / `net::ERR_FAILED` error.

The fix is minimal and surgical: remove the direct browser-to-Twilio fetch block entirely. The existing `POST /sos/trigger` backend call already handles all SMS and WhatsApp dispatch via `server/utils/twilio.js`, so no new backend work is needed. The UI is left completely unchanged.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — the browser executes a `fetch` to an external Twilio Function URL directly from `triggerSOS`
- **Property (P)**: The desired behavior — SOS completes without any CORS error; all notifications are dispatched server-side via `/sos/trigger`
- **Preservation**: All existing SOS outcomes (notified count, status messages, alerts, geolocation, countdown cancel) must remain identical after the fix
- **triggerSOS**: The async function in `client/src/pages/Dashboard.jsx` that orchestrates the SOS flow
- **`/sos/trigger`**: The Express route in `server/routes/sos.js` that sends SMS and WhatsApp messages to all saved contacts via `server/utils/twilio.js`
- **Secondary Twilio fetch**: The inner `try/catch` block inside `triggerSOS` that calls `https://rakshika-8850.twil.io/send-sos` directly — this is the defective code

## Bug Details

### Fault Condition

The bug manifests when `triggerSOS` is called (via SOS button press or check-in timer expiry) and the browser attempts to POST directly to the external Twilio Function URL. The browser enforces CORS and the Twilio-hosted function does not include the required `Access-Control-Allow-Origin` response header, so the request is blocked before it reaches the server.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input — the execution context of triggerSOS in Dashboard.jsx
  OUTPUT: boolean

  RETURN browserMakesDirectFetch(
           url = 'https://rakshika-8850.twil.io/send-sos',
           origin = window.location.origin
         )
         AND twilioFunctionLacksCORSHeader(url)
END FUNCTION
```

### Examples

- User presses SOS button → countdown reaches 0 → `triggerSOS` fires → backend `/sos/trigger` succeeds → browser then attempts `fetch('https://rakshika-8850.twil.io/send-sos', ...)` → **CORS error: 403 Forbidden, net::ERR_FAILED**
- Check-in timer expires → `triggerSOS` fires automatically → same CORS failure occurs in the secondary fetch block
- Expected: `triggerSOS` calls only `api.post('/sos/trigger', coords)` and completes cleanly with no CORS errors

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- `POST /sos/trigger` on the Express backend MUST continue to be called with geolocation coordinates
- When `data.notified === 0`, the status "SOS Sent (No Contacts!)" and the corresponding alert MUST still appear
- When `data.notified > 0`, the status "SOS Sent! Notified N Guardians" and the corresponding alert MUST still appear
- When the backend call throws, the "SOS Failed" status and manual-call prompt MUST still appear
- Geolocation acquisition before the backend call MUST remain unchanged
- The SOS countdown and cancel flow MUST remain unchanged
- No UI component, layout, or styling may be modified

**Scope:**
All inputs that do NOT involve the secondary Twilio fetch block are completely unaffected. This includes:
- Mouse clicks on the SOS button (countdown → `triggerSOS`)
- Check-in timer auto-trigger of `triggerSOS`
- Location sharing toggle
- Chat assistant SOS trigger path
- All other Dashboard interactions

## Hypothesized Root Cause

The root cause is straightforward and confirmed by the requirements:

1. **Direct browser-to-third-party fetch**: The `triggerSOS` function contains an inner `try/catch` block that calls `fetch('https://rakshika-8850.twil.io/send-sos', ...)` directly from the browser. Cross-origin requests from a browser require the target server to opt in via CORS headers.

2. **Twilio Function missing CORS headers**: The Twilio-hosted function at `rakshika-8850.twil.io` does not return `Access-Control-Allow-Origin`, so the browser blocks the preflight/request and returns `403 Forbidden`.

3. **Redundant call**: The backend `POST /sos/trigger` already calls `sendSMS` and `sendWhatsApp` via `server/utils/twilio.js` for all saved contacts. The secondary fetch was an attempt at extra reliability but is entirely redundant and broken.

4. **No server-side proxy**: There is no backend endpoint that proxies to the Twilio Function URL, and none is needed since the existing `/sos/trigger` route already covers the notification use case.

## Correctness Properties

Property 1: Fault Condition - No Direct Browser-to-Twilio Fetch

_For any_ invocation of `triggerSOS` where the bug condition holds (i.e., the browser would attempt a direct fetch to `https://rakshika-8850.twil.io/send-sos`), the fixed `triggerSOS` function SHALL NOT make that fetch call, eliminating the CORS error entirely and completing the SOS flow without any `net::ERR_FAILED` or `403 Forbidden` errors.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - SOS Outcomes Unchanged

_For any_ invocation of `triggerSOS` where the bug condition does NOT hold (i.e., all code paths other than the removed secondary fetch block), the fixed `triggerSOS` function SHALL produce exactly the same observable behavior as the original function — same status messages, same alerts, same backend call, same geolocation logic, and same error handling.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

**File**: `client/src/pages/Dashboard.jsx`

**Function**: `triggerSOS`

**Specific Changes**:

1. **Remove the secondary Twilio fetch block**: Delete the entire inner `try/catch` block (approximately lines 380–400) that calls `fetch('https://rakshika-8850.twil.io/send-sos', ...)`. This is the only change needed in the frontend.

2. **Remove the dead `mapUrl` variable**: The `mapUrl` constant was constructed solely for use in the secondary fetch body parameter. Once the fetch block is removed, `mapUrl` is unused and should be deleted to keep the code clean.

3. **No backend changes required**: `server/routes/sos.js` already handles all SMS/WhatsApp dispatch. `server/utils/twilio.js` and `server/utils/notifications.js` are untouched.

4. **No UI changes**: Zero modifications to JSX, styles, or component structure.

**Before (defective `triggerSOS` structure):**
```js
async function triggerSOS() {
  // ... geolocation ...
  const mapUrl = coords.lat ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : 'Location unavailable'

  try {
    const { data } = await api.post('/sos/trigger', coords)

    // ❌ This block causes the CORS error — remove entirely
    try {
      const twilioRes = await fetch('https://rakshika-8850.twil.io/send-sos', { ... })
      // ...
    } catch (twilioErr) {
      console.warn('Secondary Twilio Function call failed ...', twilioErr)
    }

    // status/alert logic ...
  } catch (e) {
    // error handling ...
  }
}
```

**After (fixed `triggerSOS` structure):**
```js
async function triggerSOS() {
  // ... geolocation (unchanged) ...

  try {
    const { data } = await api.post('/sos/trigger', coords)
    // status/alert logic (unchanged) ...
  } catch (e) {
    // error handling (unchanged) ...
  }
}
```

## Testing Strategy

### Validation Approach

Two-phase approach: first run exploratory tests against the unfixed code to confirm the bug manifests as described, then verify the fix eliminates the CORS call while preserving all SOS outcomes.

### Exploratory Fault Condition Checking

**Goal**: Confirm that the unfixed `triggerSOS` makes a direct fetch to the Twilio Function URL and that this call fails with a CORS/network error.

**Test Plan**: Mock `window.fetch` and `api.post` in a unit test environment. Call `triggerSOS` on the unfixed code and assert that `fetch` was called with the Twilio Function URL. In a real browser, observe the `net::ERR_FAILED 403` in DevTools Network tab.

**Test Cases**:
1. **Direct fetch is called (unfixed)**: Mock `api.post('/sos/trigger')` to resolve successfully, then assert `window.fetch` was called with `'https://rakshika-8850.twil.io/send-sos'` — will pass on unfixed code, confirming the bug
2. **CORS failure is swallowed**: Assert that even when `fetch` rejects, `triggerSOS` still sets the correct status — confirms the silent failure behavior
3. **mapUrl construction**: Assert `mapUrl` is built from coords and passed to the fetch body — confirms the dead variable

**Expected Counterexamples**:
- `fetch` is invoked with the external Twilio URL on every SOS trigger
- The call fails silently, masking the CORS error from the user but polluting the console

### Fix Checking

**Goal**: Verify that after the fix, `triggerSOS` never calls `fetch` with the Twilio Function URL.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := triggerSOS_fixed(input)
  ASSERT fetch NOT called with 'https://rakshika-8850.twil.io/send-sos'
  ASSERT api.post('/sos/trigger', coords) WAS called
  ASSERT NO CORS error thrown
END FOR
```

### Preservation Checking

**Goal**: Verify that all SOS outcomes are identical before and after the fix.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT triggerSOS_original(input).statusMessage = triggerSOS_fixed(input).statusMessage
  ASSERT triggerSOS_original(input).alertText = triggerSOS_fixed(input).alertText
END FOR
```

**Testing Approach**: Property-based testing is well-suited here because the SOS outcomes depend on the `data.notified` value returned by the backend, which can vary. Generating random `notified` counts (0, 1, N) and backend error scenarios covers the full outcome space.

**Test Cases**:
1. **Zero contacts preservation**: Mock `/sos/trigger` returning `{ notified: 0 }` — assert status is "SOS Sent (No Contacts!)" and alert fires, both before and after fix
2. **N contacts preservation**: Mock `/sos/trigger` returning `{ notified: 3 }` — assert status is "SOS Sent! Notified 3 Guardians" and alert fires
3. **Backend error preservation**: Mock `/sos/trigger` rejecting — assert status is "SOS Failed: ..." and manual-call alert fires
4. **Geolocation preservation**: Assert `api.post('/sos/trigger', { lat, lng })` receives the correct coordinates in both unfixed and fixed versions

### Unit Tests

- Test that fixed `triggerSOS` does NOT call `window.fetch` under any condition
- Test status message for `notified === 0`, `notified > 0`, and backend error cases
- Test that `mapUrl` variable no longer exists in the fixed function

### Property-Based Tests

- Generate random `notified` values (0 to 100) and verify the status string always matches the expected pattern
- Generate random backend error messages and verify the "SOS Failed" status always includes the error text
- Generate random coordinate pairs and verify they are always forwarded to `api.post('/sos/trigger', coords)` unchanged

### Integration Tests

- Full SOS flow in a browser: press SOS → countdown → trigger → verify no CORS error in Network tab → verify correct alert shown
- Check-in timer expiry flow: set 1-minute timer → let expire → verify `triggerSOS` fires → verify no CORS error
- Cancel flow: press SOS → cancel before countdown ends → verify no backend call and no fetch call made
