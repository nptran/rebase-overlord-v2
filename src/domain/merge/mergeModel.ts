import { ConflictFile } from '../../types';

export interface CodeBlock {
  type: 'normal' | 'conflict';
  commonText?: string;
  oursText?: string;
  theirsText?: string;
}

export interface ConflictBlockAnalysis {
  isSimpleConflict: boolean;
  isNonConflicting: boolean;
  mergedProposal: string;
  reason: string;
}

/**
 * Parses Git conflict markers into sequential CodeBlocks of 'normal' text and 'conflict' text blocks.
 */
export const parseConflictFile = (content: string): CodeBlock[] => {
  if (!content) return [];
  const lines = content.split('\n');
  const blocks: CodeBlock[] = [];
  let currentNormalLines: string[] = [];
  let isInsideOurs = false;
  let isInsideTheirs = false;
  let currentOursLines: string[] = [];
  let currentTheirsLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<<<<<<<')) {
      if (currentNormalLines.length > 0) {
        blocks.push({ type: 'normal', commonText: currentNormalLines.join('\n') });
        currentNormalLines = [];
      }
      isInsideOurs = true;
    } else if (line.startsWith('=======')) {
      isInsideOurs = false;
      isInsideTheirs = true;
    } else if (line.startsWith('>>>>>>>')) {
      isInsideTheirs = false;
      blocks.push({
        type: 'conflict',
        oursText: currentOursLines.join('\n'),
        theirsText: currentTheirsLines.join('\n')
      });
      currentOursLines = [];
      currentTheirsLines = [];
    } else {
      if (isInsideOurs) {
        currentOursLines.push(line);
      } else if (isInsideTheirs) {
        currentTheirsLines.push(line);
      } else {
        currentNormalLines.push(line);
      }
    }
  }

  if (currentNormalLines.length > 0) {
    blocks.push({ type: 'normal', commonText: currentNormalLines.join('\n') });
  }

  return blocks;
};

/**
 * Analyzes ours vs theirs texts within a conflicting block to identify simple or non-conflicting entries.
 */
export const analyzeAndMergeConflictBlock = (block: CodeBlock): ConflictBlockAnalysis => {
  const ours = block.oursText || '';
  const theirs = block.theirsText || '';

  if (ours === theirs) {
    return {
      isSimpleConflict: false,
      isNonConflicting: true,
      mergedProposal: ours,
      reason: 'Both sides are identical'
    };
  }

  if (ours === '') {
    return {
      isSimpleConflict: true,
      isNonConflicting: false,
      mergedProposal: theirs,
      reason: 'Our side deleted, their side added text'
    };
  }

  if (theirs === '') {
    return {
      isSimpleConflict: true,
      isNonConflicting: false,
      mergedProposal: ours,
      reason: 'Their side deleted, our side added text'
    };
  }

  return {
    isSimpleConflict: false,
    isNonConflicting: false,
    mergedProposal: '',
    reason: 'Both sides have conflicting changes'
  };
};

/**
 * Materializes current conflict file back down to conflict marked content if not already loaded.
 */
export const getContentWithConflictMarkers = (file: ConflictFile): string => {
  if (file.contentBefore && file.contentBefore.includes('<<<<<<<')) {
    return file.contentBefore;
  }
  
  return [
    'const express = require("express");',
    'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);',
    '',
    '<<<<<<< HEAD',
    '// Alex Nguyen: Add stripe secure charge webhook',
    'app.post("/api/v2/charge", async (req, res) => {',
    '  const { amount, currency } = req.body;',
    '  const paymentIntent = await stripe.paymentIntents.create({',
    '    amount,',
    '    currency,',
    '    metadata: { integration: "rebase-overlord-secured" }',
    '  });',
    '  res.json({ clientSecret: paymentIntent.client_secret });',
    '});',
    '=======',
    '// Sarah Connor: Bump rate-limits and add telemetry handlers',
    'app.post("/api/v2/charge", async (req, res) => {',
    '  const { amount, currency, telemetryId } = req.body;',
    '  logger.info(`Intake transaction telemetry: ${telemetryId}`);',
    '  const charge = await stripe.charges.create({',
    '    amount,',
    '    currency,',
    '    description: "Legacy charges backup pipeline"',
    '  });',
    '  res.json({ success: true, charge });',
    '});',
    '>>>>>>> incoming'
  ].join('\n');
};

/**
 * Assembles merged text from parsed blocks based on chosen priorities, orders, or customized edits.
 */
export function getMergedContentOfBlocks(
  blocks: CodeBlock[],
  choices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>,
  customTexts: Record<number, string> = {},
  orderRecord: Record<number, 'left' | 'right' | null> = {}
): string {
  return blocks.map((block, idx) => {
    if (block.type === 'normal') {
      return block.commonText;
    } else {
      const choice = choices[idx] || { left: 'pending', right: 'pending' };
      if (customTexts[idx] !== undefined && customTexts[idx] !== '') {
        return customTexts[idx];
      }
      if (choice.left === 'accepted' && choice.right === 'accepted') {
        const order = orderRecord[idx];
        if (order === 'right') {
          return `${block.theirsText}\n${block.oursText}`;
        }
        return `${block.oursText}\n${block.theirsText}`;
      }
      if (choice.left === 'accepted') {
        return block.oursText;
      }
      if (choice.right === 'accepted') {
        return block.theirsText;
      }
      if (choice.left === 'ignored' && choice.right === 'ignored') {
        return '';
      }
      if (choice.left === 'ignored' && choice.right === 'pending') {
        return block.theirsText;
      }
      if (choice.right === 'ignored' && choice.left === 'pending') {
        return block.oursText;
      }
      return '';
    }
  }).join('\n');
}
