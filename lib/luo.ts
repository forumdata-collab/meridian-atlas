import { channels, pointById, type Channel, type Vec3 } from './atlas';
import { luoStudies } from './luo-data';
import { boundedPolyline, closestPolylinePoint } from './regional-anchor';
import heelRoute from './luo-heel.json';
import surfaceData from './luo-surface.json';

type Region = {
  label: string;
  position: Vec3;
  binding?: { channel: string; from: string; to: string; reference: string };
};
type Landmark = string | Region;
type Segment = { label: string; nodes: Landmark[]; fittedPath?: Vec3[] };
const region = (label: string, position: Vec3): Region => ({ label, position });
function channelRegion(
  label: string,
  channelId: string,
  from: string,
  to: string,
  reference: string,
): Region {
  const channel = channels.find((c) => c.id === channelId)!;
  const path = boundedPolyline(
    channel.route,
    pointById[from].position,
    pointById[to].position,
  );
  return {
    label,
    position: closestPolylinePoint(path, pointById[reference].position),
    binding: { channel: channelId, from, to, reference },
  };
}
// Existing surface anchors constrain the drawing, but are not a claim that a
// collateral passes through every named acupoint. Interior nodes are regions.
const heart = region('心繫區域', [0, 1.375, 0.025]);
const pericardium = region('心包區域', [0.018, 1.355, 0.035]);
const stomach = region('胃區域', [0, 1.225, 0.035]);
const bowel = region('腸區域', [0, 1.04, 0.015]);
const tongue = region('舌本區域', [0.008, 1.646, 0.09]);
const eye = region('目系區域', [0.0392, 1.7252, 0.1135]);
const neck = region('喉咽區域', [0.025, 1.535, 0.035]);
const lowerTeeth = region('下齒區域', [0.018, 1.617, 0.105]);
const lumbar = region('腰脊區域', [0.035, 1.12, -0.02]);
const genital = region('陰部區域', [0.02, 0.91, 0.055]);
export const luoSegments: Record<string, Segment[]> = {
  'LUO-LU': [
    { label: '列缺 → 掌中 → 魚際區域', nodes: ['LU7', 'LU9', 'PC8', 'LU10'] },
    {
      label: '別走手陽明的聯繫示意',
      nodes: ['LU7', channelRegion('前臂陽明區域', 'LI', 'LI5', 'LI7', 'LU7')],
    },
  ],
  'LUO-LI': [
    {
      label: '偏歷 → 臂肩 → 頰齒區域',
      nodes: ['LI6', 'LI10', 'LI11', 'LI14', 'LI15', 'LI17', 'ST5', lowerTeeth],
    },
    {
      label: '頰部 → 耳中區域',
      nodes: ['ST5', 'SI19', region('耳中', [0.075, 1.698, 0.065])],
    },
    {
      label: '別入手太陰的聯繫示意',
      nodes: ['LI6', channelRegion('前臂太陰區域', 'LU', 'LU7', 'LU6', 'LI6')],
    },
  ],
  'LUO-ST': [
    {
      label: '豐隆 → 脛外側 → 頭項 → 喉咽區域',
      nodes: [
        'ST40',
        'ST36',
        'ST32',
        'ST31',
        'ST30',
        'ST25',
        'ST19',
        'ST12',
        'ST9',
        'ST8',
        'GB20',
        neck,
      ],
    },
    {
      label: '別走足太陰的聯繫示意',
      nodes: [
        'ST40',
        channelRegion('小腿太陰區域', 'SP', 'SP6', 'SP9', 'ST40'),
      ],
    },
  ],
  'LUO-SP': [
    {
      label: '公孫 → 腸胃區域',
      nodes: ['SP4', 'SP5', 'SP6', 'SP9', 'SP10', 'SP12', bowel, stomach],
    },
    {
      label: '別走足陽明的聯繫示意',
      nodes: [
        'SP4',
        channelRegion('足背陽明區域', 'ST', 'ST42', 'ST43', 'SP4'),
      ],
    },
  ],
  'LUO-HT': [
    {
      label: '通裏 → 心中 → 舌本 → 目系區域',
      nodes: ['HT5', 'HT3', 'HT2', 'HT1', heart, neck, tongue, eye],
    },
    {
      label: '別走手太陽的聯繫示意',
      nodes: ['HT5', channelRegion('前臂太陽區域', 'SI', 'SI5', 'SI7', 'HT5')],
    },
  ],
  'LUO-SI': [
    { label: '支正 → 肘 → 肩髃區域', nodes: ['SI7', 'SI8', 'SI9', 'LI15'] },
    {
      label: '內注手少陰的聯繫示意',
      nodes: ['SI7', channelRegion('前臂少陰區域', 'HT', 'HT5', 'HT3', 'SI7')],
    },
  ],
  'LUO-BL': [
    {
      label: '飛揚 → 足少陰區域（經間聯繫）',
      nodes: [
        'BL58',
        channelRegion('小腿少陰區域', 'KI', 'KI9', 'KI10', 'BL58'),
      ],
    },
  ],
  'LUO-KI': [
    {
      label: '大鐘 → 繞跟 → 足太陽區域',
      nodes: [
        'KI4',
        region('跟中', heelRoute.heelBinding.position as Vec3),
        'BL60',
      ],
      fittedPath: heelRoute.points as Vec3[],
    },
    {
      label: '大鐘 → 隨經上行 → 心包 → 腰脊區域',
      nodes: ['KI4', 'KI7', 'KI9', 'KI10', 'KI11', 'KI16', pericardium, lumbar],
    },
  ],
  'LUO-PC': [
    {
      label: '內關 → 心包絡、心繫區域',
      nodes: ['PC6', 'PC3', 'PC2', 'PC1', pericardium, heart],
    },
  ],
  'LUO-TE': [
    {
      label: '外關 → 繞臂 → 胸中、心主區域',
      nodes: ['TE5', 'TE9', 'TE10', 'TE13', 'TE14', 'ST12', pericardium],
    },
  ],
  'LUO-GB': [
    {
      label: '光明 → 足背散佈區域',
      nodes: ['GB37', 'GB40', 'GB41', region('足背', [0.24, 0.035, 0.17])],
    },
    {
      label: '別走足厥陰的聯繫示意',
      nodes: [
        'GB37',
        channelRegion('小腿厥陰區域', 'LR', 'LR4', 'LR6', 'GB37'),
      ],
    },
  ],
  'LUO-LR': [
    {
      label: '蠡溝 → 小腿上行 → 陰部區域',
      nodes: ['LR5', 'LR7', 'LR8', 'LR10', 'LR12', genital],
    },
    {
      label: '別走足少陽的聯繫示意',
      nodes: [
        'LR5',
        channelRegion('小腿少陽區域', 'GB', 'GB39', 'GB37', 'LR5'),
      ],
    },
  ],
  'LUO-CV': [
    { label: '鳩尾 → 上腹散佈區域', nodes: ['CV15', 'ST19', 'SP16', 'ST25'] },
    { label: '鳩尾 → 下腹散佈區域', nodes: ['CV15', 'KI19', 'KI16', 'ST28'] },
  ],
  'LUO-GV': [
    {
      label: '長強 → 挾脊 → 項部 → 頭部散佈',
      nodes: [
        'GV1',
        'BL28',
        'BL25',
        'BL23',
        'BL20',
        'BL17',
        'BL13',
        'BL10',
        'BL7',
        'GB15',
      ],
    },
    {
      label: '頭項 → 肩胛 → 足太陽、脊旁區域',
      nodes: [
        'BL7',
        'BL10',
        'SI14',
        'BL43',
        region('脊旁深部', [0.035, 1.33, -0.025]),
      ],
    },
  ],
  'LUO-SP-MAJOR': [
    { label: '大包 → 胸部散佈區域', nodes: ['SP21', 'SP19', 'ST16', 'KI24'] },
    { label: '大包 → 脅部散佈區域', nodes: ['SP21', 'GB24', 'LR13'] },
  ],
};

export const luoChannels: Channel[] = luoStudies.map((study) => {
  const segments = luoSegments[study.id];
  const fitted = surfaceData.paths as Record<string, { points: number[][] }[]>;
  const routes = fitted[study.id].map((path) => path.points as Vec3[]);
  return {
    id: study.id,
    name: study.name,
    short: pointById[study.pointId].name,
    polarity: '十五絡脈',
    color: channels.find((channel) => channel.id === study.parent)!.color,
    points: [pointById[study.pointId]],
    route: routes[0],
    routes,
    note: study.summary,
    routePresentation: {
      note: '虛線表示古文所述的聯繫區域。體表參照間的連線已貼合當前人體，體內及不確定區域仍為示意，尚未逐段解剖校準。只有發光穴點是本絡的絡穴，其餘轉折不代表新增穴位或必經穴；經間聯繫不等於原絡配穴連線。',
      sequential: false,
      paths: segments.map((segment) => ({
        label: segment.label,
        kind: 'region',
        animate: false,
        anchorIds: segment.nodes.filter(
          (node): node is string => typeof node === 'string',
        ),
      })),
    },
  };
});
export const studyChannels = [...channels, ...luoChannels];
