export type VesselStudy = {
  chapter: string;
  references: { label: string; url: string }[];
  members: { id: string; sourceName: string; landmark?: boolean }[];
  note: string;
};
const members = (pairs: string): VesselStudy['members'] =>
  pairs.split(' ').map((pair) => {
    const [id, sourceName] = pair.split(':');
    return { id, sourceName };
  });
const source = (chapter: string) => [
  {
    label: `《奇經八脈考》· ${chapter}（維基文庫轉錄）`,
    url: `https://zh.wikisource.org/wiki/奇經八脈考/${chapter}`,
  },
];
export const confluentPointIds: Record<string, string[]> = {
  CHONG: ['SP4'],
  DAI: ['GB41'],
  YINQIAO: ['KI6'],
  YANGQIAO: ['BL62'],
  YINWEI: ['PC6'],
  YANGWEI: ['TE5'],
  CV: ['LU7'],
  GV: ['SI3'],
};
// A book-specific association index, not a modern standardized list of all
// crossing points. Point IDs refer to existing national-standard records.
export const vesselStudies: Record<string, VesselStudy> = {
  CHONG: {
    chapter: '沖脈',
    references: source('沖脈'),
    members: members(
      'ST30:氣衝 KI11:橫骨 KI12:大赫 KI13:氣穴 KI14:四滿 KI15:中注 KI16:肓腧 KI17:商曲 KI18:石關 KI19:陰都 KI20:通谷 KI21:幽門',
    ),
    note: '按本篇“浮而外者”自氣衝至幽門的列穴整理，共12個名稱。肓腧對應肓俞，通谷依本段腹部語境對應腹通谷 KI20，不是足通谷 BL66。公孫是八脈交會穴，另列，不當作本段循行中的穴。',
  },
  DAI: {
    chapter: '帶脈',
    references: source('帶脈'),
    members: members('LR13:章門 GB26:帶脈 GB27:五樞 GB28:維道'),
    note: '本篇從章門起，繼列帶脈、五樞、維道，原文作“凡八穴”。目錄按4個穴名列出，左右穴點不重複造編號；足臨泣另屬八脈交會穴。',
  },
  YINQIAO: {
    chapter: '陰蹻脈',
    references: source('陰蹻脈'),
    members: [
      { id: 'KI2', sourceName: '然谷', landmark: true },
      ...members('KI6:照海 KI8:交信 BL1:睛明'),
    ],
    note: '然谷是原文起點的參照：“然谷穴之後”，不把它直接改稱交會穴。原轉錄將然谷寫作足少陽，與現行規範歸屬足少陰不同；代碼仍用 KI2。缺盆、人迎在此用於經過區域的描述，未直接當作新增交會穴。',
  },
  YANGQIAO: {
    chapter: '陽蹻脈',
    references: [
      {
        label:
          '《古今圖書集成·藝術典》所錄《奇經八脈考》· 陽蹺脈（識典古籍轉錄）',
        url: 'https://www.shidianguji.com/zh/book/GJTS17/chapter/1lpfcduxqylnn',
      },
      {
        label: '《奇經八脈考》· 陽蹺脈（中國哲學書電子化計劃，肩髃文字對照）',
        url: 'https://ctext.org/wiki.pl?chapter=741969&if=en',
      },
    ],
    members: members(
      'BL62:申脈 BL61:僕參 BL59:附陽 SI10:臑俞 LI16:巨骨 LI15:肩髃 ST4:地倉 ST3:巨窌 ST1:承泣 BL1:睛明 GB20:風池',
    ),
    note: '依所錄陽蹺脈段列11個穴名，保留古文附陽、巨窌等字形，對應現行跗陽、巨髎。識典“肩”後缺字，以中國哲學書電子化計劃公開索引中的“會手陽明、少陽於肩髃”校對；該站全文本輪未取到。維基文庫同名頁誤載陽維正文，未採用。此表不宣稱窮盡其他版本的列穴。',
  },
  YINWEI: {
    chapter: '陰維脈',
    references: source('陰維脈'),
    members: members(
      'KI9:築賓 SP13:府舍 SP15:大橫 SP16:腹哀 LR14:期門 CV22:天突 CV23:廉泉',
    ),
    note: '本篇明確列出7個穴名。原文“凡一十四穴”保留為古籍記數，不能直接按現代正中穴與雙側穴的計數換算；也不把其他版本的增補穴混作本篇原文。內關是八脈交會穴，另列。',
  },
  YANGWEI: {
    chapter: '陽維脈',
    references: source('陽維脈'),
    members: members(
      'BL63:金門 GB35:陽交 GB29:居髎 LI14:臂臑 TE13:臑會 TE15:天髎 GB21:肩井 SI10:臑腧 GB20:風池 GB19:腦空 GB18:承靈 GB17:正營 GB16:目窗 GB15:臨泣 GB14:陽白 GB13:本神',
    ),
    note: '按本篇金門至本神列16個穴名，順序是該版本的敍述順序。臨泣依頭部語境對應頭臨泣 GB15，不是足臨泣 GB41；臑腧對應臑俞。外關另屬八脈交會穴。',
  },
};
