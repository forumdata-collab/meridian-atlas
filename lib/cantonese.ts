import charTable from './jyutping.json';
import nameReadings from './jyutping-names.json';

/**
 * Cantonese pronunciation lookup (Jyutping, LSHK romanisation).
 *
 * GB/T 12346-2021 prescribes Mandarin pinyin only, so Cantonese readings are a
 * reference aid, not a national-standard annotation. Character readings come
 * from Unicode Unihan `kCantonese`; the 413 standard point names prefer
 * word-aware readings from the 漢語多功能字庫 Jyutping dictionary so polyphones
 * (差 / 行 / 便 …) follow the point name rather than a global default.
 */
export type JyutpingUnit = {
  text: string;
  reading: string;
  unknown: boolean;
};

const table = charTable as Record<string, string>;
const ordered = [...nameReadings].sort((a, b) => b.name.length - a.name.length);

const isHan = (ch: string) => /\p{Script=Han}/u.test(ch);

export function lookupJyutping(input: string) {
  const text = Array.from(input.trim()).slice(0, 500).join('');
  const units: JyutpingUnit[] = [];
  const matched = new Set<string>();

  const pushRun = (run: string) => {
    for (const ch of Array.from(run)) {
      const reading = table[ch] || '';
      units.push({
        text: ch,
        reading,
        unknown: !reading && isHan(ch),
      });
    }
  };

  let cursor = 0;
  let pending = '';
  while (cursor < text.length) {
    const match = ordered.find((r) => text.startsWith(r.name, cursor));
    if (!match) {
      const ch = String.fromCodePoint(text.codePointAt(cursor)!);
      pending += ch;
      cursor += ch.length;
      continue;
    }
    if (pending) {
      pushRun(pending);
      pending = '';
    }
    Array.from(match.name).forEach((ch, index) => {
      const reading = match.syllables[index] || table[ch] || '';
      units.push({ text: ch, reading, unknown: !reading && isHan(ch) });
    });
    matched.add(match.id);
    cursor += match.name.length;
  }
  if (pending) pushRun(pending);

  return {
    text,
    units,
    /** Jyutping for the whole input, space-separated (unknown units skipped). */
    jyutping: units
      .map((u) => u.reading)
      .filter(Boolean)
      .join(' '),
    names: [...matched],
  };
}

export type JyutpingResult = ReturnType<typeof lookupJyutping>;

export const jyutpingAttribution = {
  label: '粵拼參考：Unicode Unihan kCantonese ＋ 漢語多功能字庫',
  url: 'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/',
} as const;
