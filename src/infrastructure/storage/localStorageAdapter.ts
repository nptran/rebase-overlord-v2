/**
 * Infrastructure Layer - Storage Adapter
 * Abstracts browser local storage operations to persist configuration variables.
 */

export const LocalStorageAdapter = {
  get(key: string, fallback: string = ''): string {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || fallback;
      }
    } catch (e) {
      console.warn(`LocalStorage reading failed for key: ${key}`, e);
    }
    return fallback;
  },

  set(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`LocalStorage writing failed for key: ${key}`, e);
    }
  },

  getBoolean(key: string, fallback: boolean): boolean {
    const raw = this.get(key);
    if (!raw) return fallback;
    return raw === 'true';
  },

  setBoolean(key: string, value: boolean): void {
    this.set(key, String(value));
  },

  getObject<T>(key: string, fallback: T): T {
    const raw = this.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setObject<T>(key: string, value: T): void {
    try {
      this.set(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to catalog object string for key: ${key}`, e);
    }
  },

  remove(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`LocalStorage deletion failed for key: ${key}`, e);
    }
  }
};
