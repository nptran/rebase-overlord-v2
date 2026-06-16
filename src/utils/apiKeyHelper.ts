/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Constructs request headers including the user's custom stored Gemini API key.
 * Uses Base64 obfuscation for safe transfer across the local port 3000 loopback
 * in desktop container shells (e.g., Electron / Tauri).
 */
export function getApiHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    const key = window.localStorage.getItem('gemini_api_key') || '';
    if (key && key.trim()) {
      // NOTE: Base64 is obfuscation only, not encryption.
      // Safe because all traffic stays on localhost loopback (Electron app context).
      // Do NOT use this obfuscation scheme as a security mechanism for public web deployments.
      try {
        headers['x-gemini-api-key'] = btoa(key.trim());
      } catch {
        headers['x-gemini-api-key'] = key.trim();
      }
    }
    
    // Include selected Gemini model in custom headers
    const model = window.localStorage.getItem('gemini_model') || 'gemini-3.5-flash';
    headers['x-gemini-model'] = model;
  }

  return headers;
}
