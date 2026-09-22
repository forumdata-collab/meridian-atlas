import charTable from './jyutping.json';
import overrides from './jyutping-overrides.json';

/**
 * Cantonese pronunciation lookup (Jyutping, LSHK romanisation).
 *
 * GB/T 12346-2021 prescribes Mandarin pinyin only, so Cantonese readings are a
 * reference aid, not a national-standard annotation. Two mechanisms work together:
 *
 * 1. Character readings come from Unicode Unihan `kCantonese` (standard Jyutping).
 *    The table stores "primary|alternate|alternate", so a polyphone can list its
 *    other attested readings instead of silently picking one.
 * 2. `jyutping-overrides.json` fixes cases where the TCM sense differs from the
 *    character's most common reading (膻 is zin1 "rank smell", but daan6 in 膻中).
 *    The key is the *toneless GB/T Mandarin syllable*, because the national
 *    standard already fixes which sense a point name uses.
 */
export type JyutpingUnit = {
  text: string;
  reading: string;
  /** Other attested readings for this character (de-duplicated). */
  alternates: string[];
  /** True when an override chosen by the GB/T Mandarin reading was applied. */
  corrected: boolean;
  unknown: boolean;
};

type OverrideMap = Record<string, Record<string, string>>;

const table = charTable as Record<string, string>;
const overrideMap = overrides as unknown as OverrideMap;

const isHan = (ch: string) => /\p{Script=Han}/u.test(ch);

/** 'shào' -> 'shao'; strips tone marks so GB/T syllables match override keys. */
const toneless = (syllable: string) =>
  syllable
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();

const split = (entry: string | undefined) =>
  entry ? entry.split('|').filter(Boolean) : [];

function resolve(ch: string, mandarin?: string) {
  const readings = split(table[ch]);
  const primary = readings[0] || '';
  const alternates = readings.slice(1);
  if (mandarin) {
    const fixed = overrideMap[ch]?.[toneless(mandarin)];
    if (fixed && fixed !== primary) {
      return { reading: fixed, alternates, corrected: true };
    }
  }
  return { reading: primary, alternates, corrected: false };
}

/**
 * @param mandarin Optional per-character GB/T Mandarin readings (tone-marked),
 *   used to disambiguate Cantonese polyphones. Index-aligned with the input.
 */
export function lookupJyutping(
  input: string,
  mandarin?: (string | undefined)[],
) {
  const text = Array.from(input.trim()).slice(0, 500).join('');
  const units: JyutpingUnit[] = [];
  let corrected = 0;

  Array.from(text).forEach((ch, index) => {
    const { reading, alternates, corrected: fixed } = resolve(
      ch,
      mandarin?.[index],
    );
    if (fixed) corrected += 1;
    units.push({
      text: ch,
      reading,
      alternates,
      corrected: fixed,
      unknown: !reading && isHan(ch),
    });
  });

  return {
    text,
    units,
    /** Jyutping for the whole input, space-separated (unreadable units skipped). */
    jyutping: units
      .map((u) => u.reading)
      .filter(Boolean)
      .join(' '),
    /** How many characters the GB/T Mandarin reading disambiguated. */
    corrected,
  };
}

export type JyutpingResult = ReturnType<typeof lookupJyutping>;

/** A single-character query can show the other attested readings. */
export function otherReadings(result: JyutpingResult | null) {
  if (!result || result.units.length !== 1) return [];
  const unit = result.units[0];
  return unit.alternates.filter((r) => r !== unit.reading);
}

export const jyutpingAttribution = {
  primary: 'Unicode Unihan kCantonese（標準粵拼）',
  alternates: '其他讀音：漢語多功能字庫',
  overrides: '穴位粵讀校正：按 GB/T 12346-2021 普通話讀音定音',
  url: 'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/',
} as const;
