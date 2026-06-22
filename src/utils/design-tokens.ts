/**
 * Design Tokens Configuration
 * Implements fluid sizing using clamp() and clean rem-based ratios to scale
 * flawlessly across Mobile, Desktop, 2K/4K, and Ultra-wide displays.
 */

/**
 * Returns a CSS clamp string for a responsive fluid scale.
 * @param minPx Minimum size in pixels (at mobile viewport, e.g. 375px)
 * @param maxPx Maximum size in pixels (at 4K viewport, e.g. 3840px)
 * @param minViewport Minimum viewport width in pixels (default 375)
 * @param maxViewport Maximum viewport width in pixels (default 3840)
 */
export function fluidClamp(
  minPx: number,
  maxPx: number,
  minViewport: number = 375,
  maxViewport: number = 3840
): string {
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  
  // Linear equation: y = mx + c
  // m = (maxSize - minSize) / (maxViewport - minViewport)
  const slope = (maxPx - minPx) / (maxViewport - minViewport);
  // c = minSize - m * minViewport
  const intersection = minPx - slope * minViewport;
  
  const preferredVal = `${(intersection / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
  
  return `clamp(${minRem.toFixed(4)}rem, ${preferredVal}, ${maxRem.toFixed(4)}rem)`;
}

export const SpacingTokens = {
  xs: fluidClamp(4, 10),     // 4px to 10px fluid
  sm: fluidClamp(8, 16),     // 8px to 16px fluid
  md: fluidClamp(16, 28),    // 16px to 28px fluid
  lg: fluidClamp(24, 44),    // 24px to 44px fluid
  xl: fluidClamp(32, 64),    // 32px to 64px fluid
  xxl: fluidClamp(48, 96),   // 48px to 96px fluid
};

export const FontSizeTokens = {
  // Overcoming pixel-based text scaling hacks for high-density 2K/4K scaling
  tiny: fluidClamp(9.5, 15),     // Replaces [class*="text-[9.5px]"] hack
  xs: fluidClamp(11, 16),        // Replaces [class*="text-[10px]"] and [class*="text-[11px]"] hacks
  sm: fluidClamp(13, 18),        // Replaces font scaling bugs for sub-labels
  base: fluidClamp(15, 22),      // Replaces base typography scale
  lg: fluidClamp(18, 26),        // Header scales
  xl: fluidClamp(22, 34),
  xxl: fluidClamp(28, 48),
  display: fluidClamp(36, 72),   // Hero text fluid scale
};

export const RadiusTokens = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px'
};

export const ShadowTokens = {
  subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  m3low: '0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.02)',
  glow: '0 0 15px rgba(99, 102, 241, 0.15)',
};

export const ColorTokens = {
  // Primary (Indigo)
  primary: {
    bg: 'bg-indigo-600',
    hover: 'hover:bg-indigo-700',
    text: 'text-indigo-400',
    textDark: 'text-indigo-600',
    border: 'border-indigo-500/30',
    ring: 'focus:ring-indigo-500',
  },
  // Success (Green)
  success: {
    bg: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    text: 'text-emerald-400',
    textDark: 'text-emerald-600',
    border: 'border-emerald-500/30',
    ring: 'focus:ring-emerald-500',
  },
  // Danger (Red)
  danger: {
    bg: 'bg-red-650',
    hover: 'hover:bg-red-700',
    text: 'text-red-400',
    textDark: 'text-red-600',
    border: 'border-red-500/30',
    ring: 'focus:ring-red-500',
  },
  // Warning (Amber)
  warning: {
    bg: 'bg-amber-600',
    hover: 'hover:bg-amber-700',
    text: 'text-amber-400',
    textDark: 'text-amber-600',
    border: 'border-amber-500/30',
    ring: 'focus:ring-amber-500',
  }
};

