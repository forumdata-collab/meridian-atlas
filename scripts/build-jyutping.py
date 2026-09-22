#!/usr/bin/env python3
"""Build the Cantonese (Jyutping) tables used by the 查讀音 panel.

Outputs
-------
lib/jyutping.json            character -> "primary|alternate|alternate"
lib/jyutping-overrides.json  character -> {toneless GB/T Mandarin: Jyutping}

Sources and rationale
---------------------
* **Primary readings** come from Unicode Unihan ``kCantonese``. It matches
  standard LSHK Jyutping. The third-party ``jyutping`` pip package does *not*
  (it gives 三 -> saam3, 中 -> zung3 in words, 差別 -> caai1), so only the
  *set* of alternative readings is taken from it, never a primary.
* **Overrides** exist because a character's most common reading is not always
  the TCM sense: 膻 is zin1 "rank smell" but daan6 in 膻中 (徒旱切, cf. 但/憚).
  The key is the toneless GB/T 12346-2021 Mandarin syllable, since the national
  standard already fixes which sense each point name uses.

Usage
-----
    curl -O https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
    unzip -o Unihan.zip Unihan_Readings.txt -d /tmp/unihan
    python3 -m pip install jyutping
    python3 scripts/build-jyutping.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UNIHAN = os.environ.get('UNIHAN_READINGS', '/tmp/unihan/Unihan_Readings.txt')

# character -> {toneless Mandarin syllable: Jyutping}
# Every entry is justified by the Mandarin sense GB/T 12346-2021 assigns to the
# point name; the comment names the ordinary word that carries the same sense.
OVERRIDES = {
    '中': {'zhong': 'zung1'},   # 中府 = 中心 zung1
    '少': {'shao': 'siu3'},     # 少商/少海 = 少年 siu3（Unihan 主讀 siu2「多少」）
    '膻': {'dan': 'daan6'},     # 膻中 = 徒旱切，音袒 → daan6（Unihan 主讀 zin1「腥膻」）
    '膀': {'pang': 'pong4'},    # 膀胱俞 = 膀胱 pong4（Unihan 主讀 bong2）
    '椎': {'zhui': 'zeoi1'},    # 大椎/十七椎 = 脊椎 zeoi1（Unihan 主讀 ceoi4）
    '溜': {'liu': 'liu1'},      # 温溜/復溜 = 溜 liu1（Unihan 主讀 lau6「溜走」）
    '上': {'shang': 'soeng6'},  # 上廉/上髎/上巨虛 = 上面 soeng6
    '會': {'hui': 'wui6'},      # 會陽 = 會議 wui6
    '委': {'wei': 'wai2'},      # 委中 = 委託 wai2
    '舍': {'she': 'se3'},       # 氣舍/府舍/意舍 = 宿舍 se3
    '藏': {'cang': 'cong4'},    # 神藏 = 收藏 cong4
    '參': {'can': 'caam1'},     # 僕參 = 參加 caam1（非 人參 sam1）
    '攢': {'cuan': 'cyun4'},    # 攢竹 = 攢眉 cyun4
    '乙': {'yi': 'jyut3'},      # 太乙 = 甲乙 jyut3
    '差': {'cha': 'caa1'},      # 曲差 = 差別 caa1
    '正': {'zheng': 'zing3'},   # 支正 = 正確 zing3
    '聽': {'ting': 'ting1'},    # 聽宮 = 聽 ting1
    '處': {'chu': 'cyu3'},      # 五處 = 到處 cyu3
    '枕': {'zhen': 'zam2'},     # 玉枕 = 枕頭 zam2
    '分': {'fen': 'fan1'},      # 附分 = 分開 fan1
    '間': {'jian': 'gaan1'},    # 二間/三間 = 中間 gaan1
    '青': {'qing': 'cing1'},    # 青靈 = 青年 cing1
    '解': {'jie': 'gaai2'},     # 解溪 = 解答 gaai2
    '三': {'san': 'saam1'},     # 三間/三里/三陰交 = saam1
    '里': {'li': 'lei5'},       # 三里/五里 = 公里 lei5
    '橫': {'heng': 'waang4'},   # 大橫/橫骨 = 橫 waang4
    '率': {'shuai': 'seot1'},   # 率谷 = 率領 seot1
}


def main() -> int:
    if not os.path.exists(UNIHAN):
        print(f'Unihan readings not found at {UNIHAN}', file=sys.stderr)
        print('Set UNIHAN_READINGS or download Unihan.zip first (see docstring).', file=sys.stderr)
        return 1

    primary = {}
    for line in open(UNIHAN, encoding='utf-8'):
        if 'kCantonese' not in line:
            continue
        parts = line.rstrip('\n').split('\t')
        if len(parts) < 3:
            continue
        try:
            ch = chr(int(parts[0][2:], 16))
        except ValueError:
            continue
        if '\u4e00' <= ch <= '\u9fff':          # CJK Unified Ideographs
            readings = parts[2].strip().split()
            if readings:
                primary[ch] = readings[0]

    # alternative readings (set only) — optional dependency
    alternatives = {}
    try:
        import jyutping as jyutping_pkg
    except ImportError:
        print('note: `jyutping` package missing; writing primary readings only')
        jyutping_pkg = None

    out = {}
    multi = 0
    for ch, main in primary.items():
        alts = set()
        if jyutping_pkg is not None:
            try:
                sets = jyutping_pkg.get(ch, multiple=True)
                s = sets[0] if isinstance(sets, list) else sets
                if isinstance(s, set):
                    alts = {x for x in s if x and x != main}
            except Exception:
                alts = set()
        if alts:
            multi += 1
            out[ch] = '|'.join([main] + sorted(alts))
        else:
            out[ch] = main

    with open(f'{ROOT}/lib/jyutping.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    with open(f'{ROOT}/lib/jyutping-overrides.json', 'w', encoding='utf-8') as f:
        json.dump(OVERRIDES, f, ensure_ascii=False, separators=(',', ':'))
    print(f'lib/jyutping.json: {len(out)} characters, {multi} with alternates')
    print(f'lib/jyutping-overrides.json: {len(OVERRIDES)} characters')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
