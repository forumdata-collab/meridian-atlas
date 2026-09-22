export const diabetesSource = {
  title: '山西省衞生健康委員會公開診療方案 · 消渴病',
  url: 'https://wjw.shanxi.gov.cn/tzgg/zcwj/202203/P020220311553533901443.pdf#page=106',
  date: '2022 年公開文件',
  section: 'PDF 第 106 頁（印刷頁 106），針灸治療',
};
export const diabetesCore = ['EX-B3', 'BL13', 'BL20', 'BL23', 'SP6', 'KI3'];
export const diabetesPatterns = [
  {
    id: 'core',
    name: '基礎配穴',
    points: [],
    explanation:
      '該公開方案將背俞穴與足少陰、足太陰經相關穴位配合，以下按原文件整理。',
  },
  {
    id: 'upper',
    name: '上消',
    points: ['LU9', 'HT8'],
    explanation:
      '原方案上消配穴：在基礎穴組上加入太淵、少府。僅用於文獻比照，不能據“口渴”自行判斷證型。',
  },
  {
    id: 'middle',
    name: '中消',
    points: ['ST44', 'SP8'],
    explanation: '原方案中消配穴：在基礎穴組上加入內庭、地機。',
  },
  {
    id: 'lower',
    name: '下消',
    points: ['KI7', 'LR3'],
    explanation: '原方案下消配穴：在基礎穴組上加入復溜、太沖。',
  },
];
export const classicalDiabetes = {
  title: '《針灸大成》鼻口門 · 消渴條',
  url: 'https://zh.wikisource.org/wiki/針灸大成/卷十#鼻口門',
  points: [
    'GV26',
    'CV24',
    'EX-HN12',
    'LI11',
    'PC8',
    'LR3',
    'LR2',
    'SP5',
    'KI2',
    'SP1',
  ],
  note: '原文金津、玉液兩名均保留於“金津玉液”組穴詳情；按現行標準合併顯示為 10 個條目，仍包含左右兩個穴點。此為古籍同一病候條下的用穴集合，原文未要求所有穴同時使用。古代“消渴”不能直接等同於全部現代糖尿病。',
};
export const confluentPairs = [
  { name: '公孫 · 內關', vessels: '衝脈 / 陰維脈', points: ['SP4', 'PC6'] },
  { name: '足臨泣 · 外關', vessels: '帶脈 / 陽維脈', points: ['GB41', 'TE5'] },
  { name: '後溪 · 申脈', vessels: '督脈 / 陽蹺脈', points: ['SI3', 'BL62'] },
  { name: '列缺 · 照海', vessels: '任脈 / 陰蹺脈', points: ['LU7', 'KI6'] },
];
