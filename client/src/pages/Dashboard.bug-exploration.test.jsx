/**
 * Bug Condition Exploration Test — Property 1: Fault Condition
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 *
 * This test encodes the EXPECTED (fixed) behavior:
 *   triggerSOS() MUST NOT call window.fetch with 'https://rakshika-8850.twil.io/send-sos'
 *
 * On UNFIXED code: test FAILS (fetch IS called → bug confirmed)
 * On FIXED code:   test PASSES (fetch is NOT called → fix confirmed)
 *
 * Strategy: Read the Dashboard.jsx source and assert the Twilio Function URL
 * is not present in the triggerSOS function body. This is a static analysis
 * approach that directly confirms the bug condition in the source code.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const TWILIO_FUNCTION_URL = 'https://rakshika-8850.twil.io/send-sos'
const DASHBOARD_PATH = resolve(__dirname, 'Dashboard.jsx')

describe('Property 1: Fault Condition — No Direct Browser-to-Twilio Fetch', () => {
  /**
   * Validates: Requirements 2.1, 2.2, 2.3
   *
   * For any triggerSOS invocation, window.fetch MUST NOT be called with the
   * Twilio Function URL. The fixed code must not contain a fetch call to
   * 'https://rakshika-8850.twil.io/send-sos' anywhere in Dashboard.jsx.
   *
   * EXPECTED TO FAIL on unfixed code (confirms bug exists — URL is present).
   * EXPECTED TO PASS on fixed code (confirms bug is eliminated — URL is absent).
   */
  it('Dashboard.jsx does NOT contain a direct fetch to the Twilio Function URL', () => {
    const source = readFileSync(DASHBOARD_PATH, 'utf-8')

    // Extract the triggerSOS function body for targeted analysis
    const triggerSOSStart = source.indexOf('async function triggerSOS()')
    const triggerSOSEnd = source.indexOf('\n  function startSOSCountdown()', triggerSOSStart)
    const triggerSOSBody = triggerSOSStart !== -1 && triggerSOSEnd !== -1
      ? source.slice(triggerSOSStart, triggerSOSEnd)
      : source

    // PROPERTY: The Twilio Function URL must NOT appear in triggerSOS
    // On unfixed code: this assertion FAILS (URL is present → bug confirmed)
    // On fixed code:   this assertion PASSES (URL is absent → fix confirmed)
    expect(triggerSOSBody).not.toContain(TWILIO_FUNCTION_URL)
  })

  it('Dashboard.jsx does NOT contain a fetch() call to any external Twilio Function URL', () => {
    const source = readFileSync(DASHBOARD_PATH, 'utf-8')

    // Check for the pattern: fetch('https://rakshika-8850.twil.io/...')
    const hasTwilioFetch = /fetch\s*\(\s*['"`]https:\/\/rakshika-8850\.twil\.io/.test(source)

    // PROPERTY: No direct browser fetch to Twilio Function URL
    expect(hasTwilioFetch).toBe(false)
  })

  it('triggerSOS does NOT contain the secondary inner try/catch block for Twilio', () => {
    const source = readFileSync(DASHBOARD_PATH, 'utf-8')

    // The bug is the inner try/catch that calls fetch to the Twilio Function
    // Check for the specific comment that identifies the secondary block
    const hasSecondaryBlock = source.includes('Secondary Twilio Function call failed')
      || source.includes('rakshika-8850.twil.io')

    // PROPERTY: No secondary Twilio fetch block exists
    expect(hasSecondaryBlock).toBe(false)
  })
})
