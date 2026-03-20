import { CLI_MAPPINGS, CLIFamily } from '@data/cliConverterContent';

export type LineStatus = 'matched' | 'behavior-warning' | 'unmatched' | 'blank' | 'comment';

export interface TranslatedLine {
  original: string;
  eosCommand: string;
  notes: string;
  status: LineStatus;
}

export function normalizeCmd(cmd: string): string {
  return cmd.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function translateLine(line: string, family: CLIFamily): TranslatedLine {
  const trimmed = line.trim();

  if (trimmed === '') return { original: line, eosCommand: '', notes: '', status: 'blank' };
  if (trimmed.startsWith('!') || trimmed.startsWith('#'))
    return { original: line, eosCommand: line, notes: '', status: 'comment' };

  const candidates = CLI_MAPPINGS.filter(
    m => m.family === family || m.family === 'both'
  );

  for (const mapping of candidates) {
    const patterns = [mapping.ciscoCommand, ...(mapping.ciscoVariants ?? [])];
    for (const pattern of patterns) {
      // Normalize pattern (lowercase, collapsed spaces), then build a case-insensitive
      // regex where each <token> becomes a capture group.
      const normPattern = normalizeCmd(pattern);
      const escaped = normPattern.replace(/[.+*?^${}()|[\]\\]/g, '\\$&');
      const regexSrc = escaped.replace(/<[^>]+>/g, '(\\S+)');
      const regex = new RegExp('^' + regexSrc + '(?:\\s.*)?$', 'i');

      // Match against `trimmed` (not lowercased) so captured token values preserve case.
      const match = trimmed.match(regex);
      if (match) {
        // Substitute each captured token value into the EOS template in order.
        const captured = match.slice(1);
        let i = 0;
        const eos = mapping.eosCommand.replace(/<[^>]+>/g, () => captured[i++] ?? '');
        return {
          original: line,
          eosCommand: eos,
          notes: mapping.notes ?? '',
          status: mapping.behaviorDifference ? 'behavior-warning' : 'matched',
        };
      }
    }
  }

  return { original: line, eosCommand: trimmed, notes: 'Review manually — no mapping found', status: 'unmatched' };
}
