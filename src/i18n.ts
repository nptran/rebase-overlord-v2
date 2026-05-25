/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import languagesJson from '../config/languages.json';
import emojiMapJson from '../config/emoji_map.json';
import { TranslationTone } from './types';

// Let's type-cast JSONs safely
interface TranslationEntry {
  [key: string]: string | string[] | Record<string, string | string[]>;
}

const languages = languagesJson as Record<string, Record<string, string | string[]>>;
const emojiMap = emojiMapJson as Record<string, string>;

export function translate(
  key: string,
  tone: TranslationTone = TranslationTone.PROFESSIONAL,
  args?: Record<string, string | number>,
  useEmoji: boolean = false
): string {
  const langDict = languages[key];
  if (!langDict) {
    return key;
  }

  // Get the string or array for the tone
  let msgData = langDict[tone];

  // Fallback chain
  if (!msgData) {
    msgData = langDict[TranslationTone.PROFESSIONAL] || langDict[TranslationTone.ENGLISH] || key;
  }

  let msg = '';
  if (Array.isArray(msgData)) {
    // If it's an array of funny messages, deterministic default or pseudo-random
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    msg = msgData[hash % msgData.length];
  } else if (typeof msgData === 'string') {
    msg = msgData;
  } else {
    msg = key;
  }

  // Format arguments (e.g. {source})
  if (args && msg) {
    Object.entries(args).forEach(([k, v]) => {
      msg = msg.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }

  // Add emoji
  if (useEmoji && emojiMap[key]) {
    msg = `${msg} ${emojiMap[key]}`;
  }

  return msg;
}
