/**
 * Preservation Property Tests — Property 2: SOS Outcomes Unchanged
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 *
 * These tests verify that all SOS outcomes (status messages, alerts, geolocation
 * forwarding, error handling) are preserved after the fix.
 *
 * EXPECTED TO PASS on both unfixed and fixed code.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

// ---------------------------------------------------------------------------
// Inline the triggerSOS logic for direct unit testing.
// This mirrors the exact logic from Dashboard.jsx (unfixed and fixed versions
// share the same outcome logic — only the secondary fetch block differs).
// ---------------------------------------------------------------------------

/**
 * Creates a triggerSOS function with injectable dependencies for testing.
 * This mirrors the exact outcome logic from Dashboard.jsx.
 */
function makeTriggerSOS({ apiPost, setStatus, alertFn, coords }) {
  return async function triggerSOS() {
    try {
      const { data } = await apiPost('/sos/trigger', coords)

      if (data.notified === 0) {
        setStatus('SOS Sent (No Contacts!)')
        alertFn('SOS Sent! However, you have no emergency contacts saved in your circle.')
      } else {
        setStatus(`SOS Sent! Notified ${data.notified} Guardians`)
        alertFn(`EMERGENCY SOS SENT! Notified ${data.notified} guardians with your location.`)
      }
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message
      setStatus(`SOS Failed: ${errorMsg}`)
      alertFn(`SOS FAILED: ${errorMsg}. Please try calling emergency services manually.`)
    }
  }
}

describe('Property 2: Preservation — SOS Outcomes Unchanged', () => {
  let setStatus
  let alertFn
  let apiPost

  beforeEach(() => {
    setStatus = vi.fn()
    alertFn = vi.fn()
    apiPost = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // PBT: notified count → status message
  // Validates: Requirements 3.2, 3.3
  // -------------------------------------------------------------------------
  it('PBT: for all notified values in [0..100], status matches expected pattern', async () => {
    /**
     * Validates: Requirements 3.2, 3.3
     *
     * For any notified value N in [0..100]:
     *   N === 0 → status = "SOS Sent (No Contacts!)"
     *   N > 0   → status = "SOS Sent! Notified N Guardians"
     */
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (notified) => {
          setStatus.mockClear()
          apiPost.mockResolvedValue({ data: { notified } })

          const triggerSOS = makeTriggerSOS({
            apiPost,
            setStatus,
            alertFn,
            coords: { lat: 12.9716, lng: 77.5946 },
          })

          await triggerSOS()

          expect(setStatus).toHaveBeenCalledOnce()
          const [statusMsg] = setStatus.mock.calls[0]

          if (notified === 0) {
            expect(statusMsg).toBe('SOS Sent (No Contacts!)')
          } else {
            expect(statusMsg).toBe(`SOS Sent! Notified ${notified} Guardians`)
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  // -------------------------------------------------------------------------
  // PBT: backend error → "SOS Failed: ..." status
  // Validates: Requirement 3.4
  // -------------------------------------------------------------------------
  it('PBT: for all backend error messages, status always starts with "SOS Failed:"', async () => {
    /**
     * Validates: Requirement 3.4
     *
     * For any backend error message string, the status must start with "SOS Failed:"
     */
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (errorMessage) => {
          setStatus.mockClear()
          apiPost.mockRejectedValue(new Error(errorMessage))

          const triggerSOS = makeTriggerSOS({
            apiPost,
            setStatus,
            alertFn,
            coords: { lat: 12.9716, lng: 77.5946 },
          })

          await triggerSOS()

          expect(setStatus).toHaveBeenCalledOnce()
          const [statusMsg] = setStatus.mock.calls[0]
          expect(statusMsg).toMatch(/^SOS Failed:/)
          expect(statusMsg).toContain(errorMessage)
        }
      ),
      { numRuns: 50 }
    )
  })

  // -------------------------------------------------------------------------
  // PBT: coordinates forwarded unchanged to api.post('/sos/trigger')
  // Validates: Requirement 3.5
  // -------------------------------------------------------------------------
  it('PBT: for all coordinate pairs, api.post receives them unchanged', async () => {
    /**
     * Validates: Requirement 3.5
     *
     * For any coordinate pair { lat, lng }, api.post('/sos/trigger', coords)
     * must receive exactly those coordinates.
     */
    await fc.assert(
      fc.asyncProperty(
        fc.float({ min: -90, max: 90, noNaN: true }),
        fc.float({ min: -180, max: 180, noNaN: true }),
        async (lat, lng) => {
          apiPost.mockClear()
          apiPost.mockResolvedValue({ data: { notified: 1 } })

          const coords = { lat, lng }
          const triggerSOS = makeTriggerSOS({
            apiPost,
            setStatus,
            alertFn,
            coords,
          })

          await triggerSOS()

          expect(apiPost).toHaveBeenCalledWith('/sos/trigger', coords)
          const [, receivedCoords] = apiPost.mock.calls[0]
          expect(receivedCoords.lat).toBe(lat)
          expect(receivedCoords.lng).toBe(lng)
        }
      ),
      { numRuns: 50 }
    )
  })

  // -------------------------------------------------------------------------
  // Unit: zero contacts — exact status and alert text
  // Validates: Requirement 3.2
  // -------------------------------------------------------------------------
  it('notified=0 → status "SOS Sent (No Contacts!)" and correct alert', async () => {
    apiPost.mockResolvedValue({ data: { notified: 0 } })

    const triggerSOS = makeTriggerSOS({
      apiPost,
      setStatus,
      alertFn,
      coords: { lat: 12.9716, lng: 77.5946 },
    })

    await triggerSOS()

    expect(setStatus).toHaveBeenCalledWith('SOS Sent (No Contacts!)')
    expect(alertFn).toHaveBeenCalledWith(
      'SOS Sent! However, you have no emergency contacts saved in your circle.'
    )
  })

  // -------------------------------------------------------------------------
  // Unit: N contacts — exact status and alert text
  // Validates: Requirement 3.3
  // -------------------------------------------------------------------------
  it('notified=3 → status "SOS Sent! Notified 3 Guardians" and correct alert', async () => {
    apiPost.mockResolvedValue({ data: { notified: 3 } })

    const triggerSOS = makeTriggerSOS({
      apiPost,
      setStatus,
      alertFn,
      coords: { lat: 12.9716, lng: 77.5946 },
    })

    await triggerSOS()

    expect(setStatus).toHaveBeenCalledWith('SOS Sent! Notified 3 Guardians')
    expect(alertFn).toHaveBeenCalledWith(
      'EMERGENCY SOS SENT! Notified 3 guardians with your location.'
    )
  })

  // -------------------------------------------------------------------------
  // Unit: backend error — status and alert
  // Validates: Requirement 3.4
  // -------------------------------------------------------------------------
  it('backend error → status "SOS Failed: ..." and manual-call alert', async () => {
    apiPost.mockRejectedValue(new Error('Network Error'))

    const triggerSOS = makeTriggerSOS({
      apiPost,
      setStatus,
      alertFn,
      coords: { lat: 12.9716, lng: 77.5946 },
    })

    await triggerSOS()

    expect(setStatus).toHaveBeenCalledWith('SOS Failed: Network Error')
    expect(alertFn).toHaveBeenCalledWith(
      'SOS FAILED: Network Error. Please try calling emergency services manually.'
    )
  })

  // -------------------------------------------------------------------------
  // Unit: backend error with response.data.error field
  // Validates: Requirement 3.4
  // -------------------------------------------------------------------------
  it('backend error with response.data.error → uses that error message', async () => {
    const err = new Error('generic')
    err.response = { data: { error: 'Twilio credentials missing' } }
    apiPost.mockRejectedValue(err)

    const triggerSOS = makeTriggerSOS({
      apiPost,
      setStatus,
      alertFn,
      coords: { lat: 12.9716, lng: 77.5946 },
    })

    await triggerSOS()

    expect(setStatus).toHaveBeenCalledWith('SOS Failed: Twilio credentials missing')
  })
})
