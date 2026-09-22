import data from './extra-standard.json';
import type { Point, Vec3 } from './atlas';
import { extraIndicationStudies } from './extra-indications';

export const extraStandard = data;
export const extraCodeAliases: Record<string, string> = {
  'EX-HN13': 'EX-HN12',
  'M-HN14': 'EX-HN8',
  'M-UE24': 'EX-UE8',
  'M-LE34': 'EX-LE3',
  'M-LE26': 'ST35',
};
const oldKeys: Record<string, string> = {
  'EX-HN8': 'M-HN14',
  'EX-UE8': 'M-UE24',
  'EX-LE3': 'M-LE34',
};
// Authored template coordinates, subsequently attached to the learning mesh.
// Oral/nasal points use explicit external index markers until an internal
// anatomical model is available; they are not claimed to lie on the skin.
const additions: Record<string, Vec3> = {
  'EX-HN2': [0.067, 1.8, 0.143],
  'EX-HN9': [0.029, 1.674, 0.183],
  'EX-HN10': [0, 1.64, 0.15],
  'EX-HN11': [0, 1.627, 0.145],
  'EXTRA-XINSHE': [0.093, 1.535, -0.072],
  'EXTRA-XUEYADIAN': [0.1, 1.495, -0.092],
  'EXTRA-TITUO': [0.16, 0.944, 0.12],
  'EXTRA-JIEJI': [0, 1.124, -0.164],
  'EX-B6': [0.153, 1.025, -0.13],
  'EX-UE5': [0.71, 0.737, 0.025],
  'EX-UE6': [0.841, 0.69, 0.006],
  'EX-LE1': [0.237, 0.533, 0.115],
  'EX-LE8': [0.148, 0.115, 0.021],
  'EX-LE9': [0.23, 0.103, 0.01],
  'EXTRA-LINEITING': [0.2, 0.008, 0.247],
  'EX-LE11': [0.189, 0.018, 0.283],
  'EX-LE12': [0.193, 0.04, 0.294],
};
const aliases: Record<string, string> = {
  'EX-HN1': '神聰',
  'EX-HN8': '鼻通；鼻穿；M-HN14（舊資料編號）',
  'EX-HN12': '金津；玉液；EX-HN13',
  'EXTRA-XINSHE': '新識',
  'EX-HN15': '頸百勞；百勞（須區分古籍同名穴）',
  'EXTRA-TITUO': '歸髎',
  'EX-B1': '喘息',
  'EX-B2': '華佗夾脊；佗脊',
  'EX-B3': '胃管下俞；胃下俞；胰俞；消渴穴（部分教學稱呼）',
  'EX-B7': '腰目',
  'EX-B8': '十七椎下',
  'M-UE48': '肩內陵；前腋；腋縫',
  'EX-UE8': '落枕；M-UE24（舊資料編號）',
  'EX-UE11': '鬼城',
  'EX-LE2': '膝頂',
  'EX-LE3': 'M-LE34（舊資料編號）',
  'EX-LE11': '獨會',
  'EX-LE10': '八衝',
};
const related: Record<string, string> = {
  'EX-HN12':
    '國標將金津、玉液作為一個條目；左金津、右玉液兩個穴點保留。兩個標準代碼均可檢索。',
  'EX-B3':
    '國標規範名為胃脘下俞；附錄 C 列胃管下俞、胃下俞。“胰俞”見已收錄的消渴公開方案；“消渴穴”僅作為教學檢索詞，不代表另一獨立國標穴。',
  'EX-UE8':
    '“落枕”保留為舊資料檢索名稱，外勞宮為本標準規範名；對應關係另見南京中醫藥大學學報 2016 年研究的對照組選穴説明。',
  'EX-UE9':
    '國標註釋：第 4、5 指間穴點與液門 TE2 同位。穴組中的重合點不計作新的經穴。',
  'EX-UE11': '國標註釋：中指尖端穴點與中衝 PC9 同位。',
  'EX-LE10':
    '國標註釋：第 1、2 趾間、第 2、3 趾間及第 4、5 趾間穴點分別與行間 LR2、內庭 ST44、俠溪 GB43 同位。',
  'EX-LE4': '外膝眼按現代定位與犢鼻 ST35 同位；本條僅為內膝眼。',
};

export function standardiseExtras(legacy: Point[]): Point[] {
  const originals = new Map(legacy.map((p) => [p.id, p]));
  const used = new Set(['EX-HN13', 'M-LE26']);
  const standard: Point[] = data.entries.map((entry, index) => {
    const oldId = oldKeys[entry.id] || entry.id;
    const old = originals.get(oldId);
    const study = extraIndicationStudies[entry.id];
    used.add(oldId);
    const position = old?.position || additions[entry.id];
    if (!position)
      throw new Error(`Missing extra-point template: ${entry.name}`);
    const p: Point = {
      ...old,
      id: entry.id,
      name: entry.name,
      channel: 'EX',
      index: index + 1,
      position,
      roles: ['經外奇穴'],
      indications: study?.summary || old?.indications,
      indicationStudy: study,
      catalog: 'standard-extra',
      displayCode: entry.standardCodes.length
        ? entry.standardCodes.join(' / ')
        : '國標未設代碼',
      standardCodes: entry.standardCodes,
      aliases: aliases[entry.id] || old?.aliases,
      location: `區域：${entry.region}。定位關係：${entry.relations.join('；')}。`,
      locationReference: {
        label: `${data.standard} · ${entry.clause} · PDF 第 ${entry.pdfPage} 頁`,
        url: `${data.documentUrl}#page=${entry.pdfPage}`,
      },
      catalogNote: [
        related[entry.id],
        entry.editorialNote,
        !entry.standardCodes.length
          ? '本標準以漢字和拼音命名，未指定英文代碼。舊資料編號保留檢索用途。'
          : undefined,
      ]
        .filter(Boolean)
        .join(' '),
      source: study
        ? '主治摘要據下列文獻；名稱與定位另據 GB/T 40997-2021。'
        : old?.source ||
          '本條名稱與基本定位據 GB/T 40997-2021；該標準不提供本條主治摘要，主治另待文獻核對。',
    };
    if (!entry.standardCodes.length && old)
      p.aliases = [p.aliases, old.id + '（舊資料編號）']
        .filter(Boolean)
        .join('；');
    if (['EX-HN9', 'EX-HN10', 'EX-HN11', 'EX-HN12'].includes(p.id))
      p.modelPlacement =
        '本穴位於口鼻內部；現有模型沒有黏膜與舌部解剖層，面部標記僅作條目索引。';
    if (p.id === 'EX-HN12') {
      p.positions = [
        originals.get('EX-HN12')!.position,
        originals.get('EX-HN13')!.position,
      ];
      p.bilateral = false;
    }
    if (['EX-HN10', 'EX-HN11', 'EXTRA-JIEJI'].includes(p.id))
      p.bilateral = false;
    if (p.id === 'EX-LE1')
      p.positions = [
        [0.177, 0.533, 0.115],
        [0.297, 0.533, 0.115],
      ];
    if (p.id === 'EX-LE12')
      p.positions = [
        [0.135, 0.041, 0.298],
        [0.18, 0.044, 0.302],
        [0.217, 0.042, 0.292],
        [0.25, 0.038, 0.278],
        [0.277, 0.032, 0.26],
      ];
    return p;
  });
  const other = legacy
    .filter((p) => !used.has(p.id))
    .map((p) =>
      p.id === 'EX-HN3'
        ? p
        : {
            ...p,
            catalog: 'supplement-extra' as const,
            displayCode: '資料 ' + p.id,
            catalogNote:
              p.id === 'EX-B9'
                ? '腰奇未收入 GB/T 40997-2021。這裏保留舊資料條目供對照，不計入 51 個國標奇穴。'
                : p.id === 'EX-LE5'
                  ? '膝眼為內、外膝眼的合稱；國標奇穴目錄單列內膝眼，外膝眼與犢鼻 ST35 同位。此處保留穴組資料，不計入國標奇穴數。'
                  : '此為補充資料條目，未收入 GB/T 40997-2021 的 51 個奇穴；資料編號不作為本標準代碼。',
          },
    );
  return [...standard, ...other].map((p, index) => ({
    ...p,
    ...(extraIndicationStudies[p.id]
      ? {
          indications: extraIndicationStudies[p.id].summary,
          indicationStudy: extraIndicationStudies[p.id],
          source: '主治摘要據所附文獻；目錄歸屬與定位來源另列。',
        }
      : {}),
    index: index + 1,
  }));
}
