/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resolves the absolute backend API URL based on active client environment.
 * Helps seamlessly transition between Web-hosted, Localhost express,
 * Electron app (file://) and Tauri desktop frameworks (tauri://localhost).
 */
export function resolveApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. Explicit environment variable check
  const envApiUrl = (import.meta as any).env?.VITE_API_URL;
  if (envApiUrl) {
    return `${envApiUrl.replace(/\/$/, '')}${cleanEndpoint}`;
  }

  // 2. Client environment protocol parsing
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // Detect packaging contexts
    const isDesktopShell = 
      protocol === 'file:' || 
      protocol.startsWith('tauri') || 
      protocol.startsWith('app') || 
      protocol.startsWith('vscode') ||
      !hostname;

    if (isDesktopShell) {
      // Return local express desktop loopback
      return `http://localhost:3000${cleanEndpoint}`;
    }
  }

  // 3. Fallback to standard relative web routes
  return cleanEndpoint;
}
