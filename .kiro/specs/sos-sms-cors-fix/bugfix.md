# Bugfix Requirements Document

## Introduction

When the SOS button is triggered on the Dashboard, the frontend (`triggerSOS` in `Dashboard.jsx`) makes a secondary direct fetch call to the external Twilio Function URL (`https://rakshika-8850.twil.io/send-sos`) from the browser. This call is blocked by the browser's CORS policy because the Twilio-hosted function does not include an `Access-Control-Allow-Origin` header, and the request returns a 403 Forbidden. The fix routes this secondary SMS dispatch through the existing Express backend instead of calling the Twilio Function URL directly from the browser.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the SOS button is triggered and the browser attempts to POST directly to `https://rakshika-8850.twil.io/send-sos` THEN the system is blocked by CORS policy with the error "No 'Access-Control-Allow-Origin' header is present on the requested resource"

1.2 WHEN the direct fetch to the Twilio Function URL is made from the browser THEN the system receives a `403 Forbidden` response and logs `POST https://rakshika-8850.twil.io/send-sos net::ERR_FAILED 403 (Forbidden)`

1.3 WHEN the CORS-blocked fetch fails THEN the system logs "Secondary Twilio Function call failed (ignoring as primary backend is the main source) TypeError: Failed to fetch" in the browser console

### Expected Behavior (Correct)

2.1 WHEN the SOS button is triggered THEN the system SHALL NOT make any direct browser-to-Twilio-Function fetch calls, eliminating the CORS error entirely

2.2 WHEN the SOS button is triggered THEN the system SHALL route all SMS/notification dispatch through the existing Express backend endpoint (`POST /sos/trigger`) which already handles Twilio communication server-side

2.3 WHEN the SOS button is triggered and the backend `/sos/trigger` call succeeds THEN the system SHALL complete the SOS flow without any CORS-related errors or console warnings

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the SOS button is triggered THEN the system SHALL CONTINUE TO call `POST /sos/trigger` on the Express backend to notify emergency contacts via SMS and WhatsApp

3.2 WHEN the SOS trigger completes with zero contacts THEN the system SHALL CONTINUE TO display the "SOS Sent (No Contacts!)" status and alert the user

3.3 WHEN the SOS trigger completes with one or more contacts notified THEN the system SHALL CONTINUE TO display the "SOS Sent! Notified N Guardians" status and alert the user

3.4 WHEN the SOS trigger fails due to a backend error THEN the system SHALL CONTINUE TO display the "SOS Failed" status and prompt the user to call emergency services manually

3.5 WHEN the SOS button is triggered THEN the system SHALL CONTINUE TO attempt geolocation and pass coordinates to the backend

3.6 WHEN the SOS countdown is active and the user cancels THEN the system SHALL CONTINUE TO cancel the countdown without triggering any SOS calls
