import standardIndications from './standard-indications.json';
import { getLuoStudy, luoStudies } from './luo-data';
import primaryIndicationScan from './primary-indication-scan.json';
import {
  vesselStudies,
  confluentPointIds,
  type VesselStudy,
} from './vessel-points';
import reference from './point-reference.json';
import { extraCatalog } from './extra-points';
import { extraCodeAliases, extraStandard } from './extra-standard';
import type { IndicationStudy } from './extra-indications';
import { classicSongs, extraordinarySong } from './classics';
import nationalStandard from './national-standard.json';
import { locationFacts, describeLocationFacts } from './location-facts';
import { applyPlacementRules } from './placement-rules';
import { attachHumanMesh } from './human-mesh';
import {
  standardLocations,
  describeStandardLocation,
} from './standard-locations';
export type Vec3 = [number, number, number];
export type Point = {
  id: string;
  name: string;
  channel: string;
  index: number;
  position: Vec3;
  roles: string[];
  location?: string;
  indications?: string;
  indicationStudy?: IndicationStudy;
  additionalIndicationStudies?: IndicationStudy[];
  source?: string;
  aliases?: string;
  displayCode?: string;
  standardCodes?: string[];
  catalog?: 'standard-extra' | 'supplement-extra';
  catalogNote?: string;
  positions?: Vec3[];
  bilateral?: boolean;
  locationReference?: { label: string; url: string };
  modelPlacement?: string;
  templatePosition?: Vec3;
  templatePositions?: Vec3[];
};
export type RoutePresentation = {
  note: string;
  sequential: boolean;
  paths: {
    label: string;
    kind: string;
    closed?: boolean;
    animate?: boolean;
    mirror?: boolean;
    anchorIds: string[];
  }[];
};
export type Channel = {
  id: string;
  name: string;
  short: string;
  polarity: string;
  color: string;
  hour?: number;
  branch?: string;
  pair?: string;
  points: Point[];
  confluentPointIds?: string[];
  vesselStudy?: VesselStudy;
  routePresentation?: RoutePresentation;
  route: Vec3[];
  routes?: Vec3[][];
  templateRoute?: Vec3[];
  templateRoutes?: Vec3[][];
  note: string;
};

// Coordinates are authored schematic positions, not anatomical measurements.
type Seed = [
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  string,
  string,
];
const seeds: Seed[] = [
  [
    'LU',
    '手太陰肺經',
    '肺',
    '手三陰',
    '#65d9eb',
    3,
    '寅',
    'LI',
    '中府 雲門 天府 俠白 尺澤 孔最 列缺 經渠 太淵 魚際 少商',
  ],
  [
    'LI',
    '手陽明大腸經',
    '大腸',
    '手三陽',
    '#efb36a',
    5,
    '卯',
    'LU',
    '商陽 二間 三間 合谷 陽溪 偏歷 温溜 下廉 上廉 手三里 曲池 肘髎 手五里 臂臑 肩髃 巨骨 天鼎 扶突 口禾髎 迎香',
  ],
  [
    'ST',
    '足陽明胃經',
    '胃',
    '足三陽',
    '#e8c264',
    7,
    '辰',
    'SP',
    '承泣 四白 巨髎 地倉 大迎 頰車 下關 頭維 人迎 水突 氣舍 缺盆 氣户 庫房 屋翳 膺窗 乳中 乳根 不容 承滿 梁門 關門 太乙 滑肉門 天樞 外陵 大巨 水道 歸來 氣衝 髀關 伏兔 陰市 梁丘 犢鼻 足三里 上巨虛 條口 下巨虛 豐隆 解溪 衝陽 陷谷 內庭 厲兑',
  ],
  [
    'SP',
    '足太陰脾經',
    '脾',
    '足三陰',
    '#e49a72',
    9,
    '巳',
    'ST',
    '隱白 大都 太白 公孫 商丘 三陰交 漏谷 地機 陰陵泉 血海 箕門 衝門 府舍 腹結 大橫 腹哀 食竇 天溪 胸鄉 周榮 大包',
  ],
  [
    'HT',
    '手少陰心經',
    '心',
    '手三陰',
    '#f184a0',
    11,
    '午',
    'SI',
    '極泉 青靈 少海 靈道 通裏 陰郄 神門 少府 少衝',
  ],
  [
    'SI',
    '手太陽小腸經',
    '小腸',
    '手三陽',
    '#dc85b8',
    13,
    '未',
    'HT',
    '少澤 前谷 後溪 腕骨 陽穀 養老 支正 小海 肩貞 臑俞 天宗 秉風 曲垣 肩外俞 肩中俞 天窗 天容 顴髎 聽宮',
  ],
  [
    'BL',
    '足太陽膀胱經',
    '膀胱',
    '足三陽',
    '#83a6f1',
    15,
    '申',
    'KI',
    '睛明 攢竹 眉衝 曲差 五處 承光 通天 絡卻 玉枕 天柱 大杼 風門 肺俞 厥陰俞 心俞 督俞 膈俞 肝俞 膽俞 脾俞 胃俞 三焦俞 腎俞 氣海俞 大腸俞 關元俞 小腸俞 膀胱俞 中膂俞 白環俞 上髎 次髎 中髎 下髎 會陽 承扶 殷門 浮郄 委陽 委中 附分 魄户 膏肓 神堂 譩譆 膈關 魂門 陽綱 意舍 胃倉 肓門 志室 胞肓 秩邊 合陽 承筋 承山 飛揚 跗陽 崑崙 僕參 申脈 金門 京骨 束骨 足通谷 至陰',
  ],
  [
    'KI',
    '足少陰腎經',
    '腎',
    '足三陰',
    '#9e9dea',
    17,
    '酉',
    'BL',
    '湧泉 然谷 太溪 大鐘 水泉 照海 復溜 交信 築賓 陰谷 橫骨 大赫 氣穴 四滿 中注 肓俞 商曲 石關 陰都 腹通谷 幽門 步廊 神封 靈墟 神藏 彧中 俞府',
  ],
  [
    'PC',
    '手厥陰心包經',
    '心包',
    '手三陰',
    '#ba8ce6',
    19,
    '戌',
    'TE',
    '天池 天泉 曲澤 郄門 間使 內關 大陵 勞宮 中衝',
  ],
  [
    'TE',
    '手少陽三焦經',
    '三焦',
    '手三陽',
    '#d4a0e1',
    21,
    '亥',
    'PC',
    '關衝 液門 中渚 陽池 外關 支溝 會宗 三陽絡 四瀆 天井 清泠淵 消濼 臑會 肩髎 天髎 天牖 翳風 瘈脈 顱息 角孫 耳門 耳和髎 絲竹空',
  ],
  [
    'GB',
    '足少陽膽經',
    '膽',
    '足三陽',
    '#91c97a',
    23,
    '子',
    'LR',
    '瞳子髎 聽會 上關 頷厭 懸顱 懸釐 曲鬢 率谷 天衝 浮白 頭竅陰 完骨 本神 陽白 頭臨泣 目窗 正營 承靈 腦空 風池 肩井 淵腋 輒筋 日月 京門 帶脈 五樞 維道 居髎 環跳 風市 中瀆 膝陽關 陽陵泉 陽交 外丘 光明 陽輔 懸鐘 丘墟 足臨泣 地五會 俠溪 足竅陰',
  ],
  [
    'LR',
    '足厥陰肝經',
    '肝',
    '足三陰',
    '#63c9ac',
    1,
    '醜',
    'GB',
    '大敦 行間 太沖 中封 蠡溝 中都 膝關 曲泉 陰包 足五里 陰廉 急脈 章門 期門',
  ],
  [
    'CV',
    '任脈',
    '任脈',
    '奇經八脈',
    '#eebd93',
    -1,
    '',
    '',
    '會陰 曲骨 中極 關元 石門 氣海 陰交 神闕 水分 下脘 建裏 中脘 上脘 巨闕 鳩尾 中庭 膻中 玉堂 紫宮 華蓋 璇璣 天突 廉泉 承漿',
  ],
  [
    'GV',
    '督脈',
    '督脈',
    '奇經八脈',
    '#a0c9e6',
    -1,
    '',
    '',
    '長強 腰俞 腰陽關 命門 懸樞 脊中 中樞 筋縮 至陽 靈台 神道 身柱 陶道 大椎 啞門 風府 腦户 強間 後頂 百會 前頂 囟會 上星 神庭 素髎 水溝 兑端 齦交',
  ],
];
type Anchor = [number, number, number, number];
const anchors: Record<string, Anchor[]> = {
  LU: [
    [1, 0.34, 1.39, 0.19],
    [2, 0.36, 1.45, 0.16],
    [3, 0.48, 1.27, 0.13],
    [4, 0.5, 1.21, 0.13],
    [5, 0.58, 1.09, 0.115],
    [6, 0.65, 0.95, 0.12],
    [7, 0.69, 0.84, 0.105],
    [8, 0.7, 0.81, 0.1],
    [9, 0.7, 0.79, 0.1],
    [10, 0.715, 0.75, 0.105],
    [11, 0.704, 0.704, 0.11],
  ],
  LI: [
    [1, 0.785, 0.65, 0.08],
    [4, 0.758, 0.73, 0.065],
    [5, 0.733, 0.8, 0.035],
    [11, 0.616, 1.1, 0.005],
    [15, 0.39, 1.43, 0.035],
    [16, 0.32, 1.48, 0],
    [18, 0.117, 1.5, 0.14],
    [19, 0.036, 1.63, 0.188],
    [20, 0.041, 1.67, 0.19],
  ],
  ST: [
    [1, 0.066, 1.711, 0.18],
    [2, 0.073, 1.692, 0.18],
    [3, 0.078, 1.668, 0.18],
    [4, 0.053, 1.635, 0.184],
    [5, 0.1, 1.612, 0.145],
    [6, 0.123, 1.637, 0.11],
    [7, 0.134, 1.684, 0.087],
    [8, 0.114, 1.79, 0.08],
    [9, 0.065, 1.527, 0.11],
    [12, 0.208, 1.452, 0.145],
    [13, 0.19, 1.42, 0.183],
    [18, 0.172, 1.262, 0.189],
    [19, 0.09, 1.23, 0.188],
    [25, 0.09, 1.04, 0.18],
    [30, 0.08, 0.87, 0.135],
    [31, 0.172, 0.84, 0.157],
    [32, 0.2, 0.69, 0.134],
    [34, 0.22, 0.53, 0.108],
    [35, 0.23, 0.465, 0.115],
    [36, 0.23, 0.42, 0.117],
    [40, 0.23, 0.24, 0.105],
    [41, 0.206, 0.1, 0.11],
    [42, 0.206, 0.065, 0.17],
    [45, 0.232, 0.04, 0.29],
  ],
  SP: [
    [1, 0.115, 0.04, 0.29],
    [3, 0.121, 0.052, 0.215],
    [4, 0.123, 0.055, 0.18],
    [5, 0.13, 0.103, 0.05],
    [6, 0.13, 0.17, 0.028],
    [9, 0.12, 0.445, 0.025],
    [10, 0.134, 0.51, 0.11],
    [11, 0.13, 0.7, 0.11],
    [12, 0.09, 0.873, 0.12],
    [15, 0.19, 1.04, 0.148],
    [16, 0.225, 1.19, 0.155],
    [17, 0.255, 1.27, 0.15],
    [20, 0.26, 1.405, 0.165],
    [21, 0.285, 1.3, 0.035],
  ],
  HT: [
    [1, 0.37, 1.355, 0.012],
    [2, 0.49, 1.21, 0.031],
    [3, 0.547, 1.095, 0.051],
    [4, 0.67, 0.851, 0.078],
    [7, 0.704, 0.79, 0.068],
    [8, 0.751, 0.724, 0.07],
    [9, 0.812, 0.683, 0.057],
  ],
  SI: [
    [1, 0.828, 0.669, 0.012],
    [3, 0.792, 0.71, -0.022],
    [4, 0.768, 0.764, -0.035],
    [5, 0.743, 0.8, -0.048],
    [8, 0.606, 1.083, -0.069],
    [9, 0.372, 1.365, -0.09],
    [10, 0.345, 1.419, -0.109],
    [11, 0.219, 1.345, -0.144],
    [12, 0.229, 1.447, -0.135],
    [13, 0.174, 1.437, -0.148],
    [14, 0.128, 1.454, -0.129],
    [15, 0.076, 1.469, -0.101],
    [16, 0.08, 1.518, 0.007],
    [17, 0.113, 1.589, 0.048],
    [18, 0.1, 1.665, 0.139],
    [19, 0.148, 1.687, 0.04],
  ],
  BL: [
    [1, 0.028, 1.715, 0.179],
    [2, 0.04, 1.753, 0.17],
    [3, 0.04, 1.785, 0.136],
    [7, 0.062, 1.823, -0.026],
    [9, 0.063, 1.753, -0.146],
    [10, 0.064, 1.538, -0.087],
    [11, 0.075, 1.463, -0.144],
    [17, 0.08, 1.29, -0.173],
    [23, 0.074, 1.101, -0.13],
    [30, 0.07, 0.888, -0.137],
    [31, 0.037, 0.965, -0.166],
    [34, 0.039, 0.895, -0.148],
    [35, 0.026, 0.865, -0.12],
    [36, 0.182, 0.823, -0.135],
    [37, 0.193, 0.68, -0.111],
    [40, 0.184, 0.476, -0.063],
    [41, 0.16, 1.451, -0.144],
    [46, 0.175, 1.288, -0.15],
    [50, 0.15, 1.166, -0.121],
    [54, 0.18, 0.866, -0.134],
    [55, 0.193, 0.402, -0.097],
    [57, 0.203, 0.294, -0.092],
    [58, 0.254, 0.246, -0.033],
    [60, 0.239, 0.105, -0.023],
    [62, 0.248, 0.071, 0.017],
    [64, 0.26, 0.049, 0.164],
    [67, 0.286, 0.032, 0.236],
  ],
  KI: [
    [1, 0.18, 0.014, 0.175],
    [2, 0.126, 0.066, 0.135],
    [3, 0.132, 0.106, -0.015],
    [4, 0.13, 0.09, -0.03],
    [5, 0.13, 0.068, -0.019],
    [6, 0.127, 0.076, 0.027],
    [7, 0.129, 0.169, -0.022],
    [8, 0.121, 0.171, 0.012],
    [9, 0.122, 0.27, -0.033],
    [10, 0.124, 0.478, -0.016],
    [11, 0.026, 0.877, 0.156],
    [16, 0.026, 1.04, 0.19],
    [21, 0.027, 1.245, 0.184],
    [22, 0.09, 1.279, 0.196],
    [27, 0.091, 1.452, 0.142],
  ],
  PC: [
    [1, 0.239, 1.329, 0.167],
    [2, 0.458, 1.307, 0.14],
    [3, 0.565, 1.1, 0.128],
    [4, 0.649, 0.939, 0.126],
    [5, 0.675, 0.878, 0.124],
    [6, 0.687, 0.853, 0.123],
    [7, 0.716, 0.796, 0.112],
    [8, 0.768, 0.718, 0.09],
    [9, 0.802, 0.622, 0.084],
  ],
  TE: [
    [1, 0.827, 0.63, 0.027],
    [3, 0.791, 0.732, -0.013],
    [4, 0.752, 0.8, -0.021],
    [5, 0.729, 0.855, -0.028],
    [6, 0.715, 0.887, -0.028],
    [7, 0.721, 0.9, -0.031],
    [10, 0.604, 1.095, -0.087],
    [14, 0.379, 1.425, -0.062],
    [15, 0.25, 1.473, -0.078],
    [16, 0.084, 1.531, -0.048],
    [17, 0.123, 1.627, -0.009],
    [19, 0.135, 1.73, -0.039],
    [20, 0.138, 1.754, 0.02],
    [21, 0.15, 1.707, 0.056],
    [22, 0.148, 1.737, 0.072],
    [23, 0.099, 1.757, 0.134],
  ],
  GB: [
    [1, 0.09, 1.716, 0.144],
    [2, 0.15, 1.67, 0.044],
    [3, 0.15, 1.705, 0.086],
    [4, 0.116, 1.773, 0.06],
    [7, 0.14, 1.738, 0.014],
    [9, 0.138, 1.76, -0.04],
    [12, 0.107, 1.661, -0.098],
    [13, 0.1, 1.798, 0.106],
    [14, 0.066, 1.777, 0.146],
    [15, 0.062, 1.813, 0.105],
    [19, 0.083, 1.739, -0.132],
    [20, 0.085, 1.566, -0.094],
    [21, 0.258, 1.482, -0.024],
    [22, 0.307, 1.332, 0],
    [23, 0.29, 1.302, 0.099],
    [24, 0.155, 1.251, 0.169],
    [25, 0.221, 1.132, -0.027],
    [26, 0.249, 1.055, 0.006],
    [27, 0.229, 0.942, 0.092],
    [28, 0.242, 0.915, 0.048],
    [29, 0.26, 0.905, -0.004],
    [30, 0.248, 0.857, -0.099],
    [31, 0.29, 0.664, 0.012],
    [33, 0.261, 0.5, 0.028],
    [34, 0.259, 0.431, 0.032],
    [39, 0.259, 0.195, 0.021],
    [40, 0.262, 0.095, 0.064],
    [41, 0.26, 0.058, 0.19],
    [44, 0.273, 0.034, 0.26],
  ],
  LR: [
    [1, 0.133, 0.041, 0.302],
    [2, 0.145, 0.048, 0.261],
    [3, 0.158, 0.057, 0.208],
    [4, 0.135, 0.11, 0.093],
    [5, 0.129, 0.251, 0.056],
    [6, 0.124, 0.291, 0.047],
    [7, 0.121, 0.421, 0.023],
    [8, 0.121, 0.475, 0.005],
    [9, 0.119, 0.597, 0.055],
    [10, 0.092, 0.775, 0.078],
    [11, 0.079, 0.819, 0.099],
    [12, 0.068, 0.87, 0.12],
    [13, 0.239, 1.185, 0.094],
    [14, 0.174, 1.271, 0.183],
  ],
  CV: [
    [1, 0, 0.843, 0],
    [2, 0, 0.876, 0.164],
    [8, 0, 1.04, 0.197],
    [14, 0, 1.237, 0.18],
    [17, 0, 1.337, 0.199],
    [22, 0, 1.493, 0.097],
    [23, 0, 1.547, 0.117],
    [24, 0, 1.62, 0.15],
  ],
  GV: [
    [1, 0, 0.853, -0.121],
    [2, 0, 0.918, -0.181],
    [4, 0, 1.106, -0.139],
    [10, 0, 1.37, -0.169],
    [14, 0, 1.49, -0.098],
    [15, 0, 1.569, -0.096],
    [16, 0, 1.62, -0.142],
    [19, 0, 1.798, -0.105],
    [20, 0, 1.849, 0],
    [24, 0, 1.797, 0.134],
    [25, 0, 1.691, 0.213],
    [26, 0, 1.65, 0.175],
    [27, 0, 1.636, 0.18],
    [28, 0, 1.633, 0.168],
  ],
};
const roleMap: Record<string, number[]> = {
  LU: [11, 10, 9, 8, 5, 9, 7],
  LI: [1, 2, 3, 5, 11, 4, 6],
  ST: [45, 44, 43, 41, 36, 42, 40],
  SP: [1, 2, 3, 5, 9, 3, 4],
  HT: [9, 8, 7, 4, 3, 7, 5],
  SI: [1, 2, 3, 5, 8, 4, 7],
  BL: [67, 66, 65, 60, 40, 64, 58],
  KI: [1, 2, 3, 7, 10, 3, 4],
  PC: [9, 8, 7, 5, 3, 7, 6],
  TE: [1, 2, 3, 6, 10, 4, 5],
  GB: [44, 43, 41, 38, 34, 40, 37],
  LR: [1, 2, 3, 4, 8, 3, 5],
};
export const roleNames = ['井', '滎', '輸', '經', '合', '原', '絡'];
export function interpolate(list: Anchor[], index: number): Vec3 {
  const b = list.findIndex((a) => a[0] >= index);
  if (b <= 0) return list[0].slice(1) as Vec3;
  const a = list[b - 1],
    z = list[b],
    t = (index - a[0]) / (z[0] - a[0]);
  return [1, 2, 3].map((k) => a[k] + (z[k] - a[k]) * t) as Vec3;
}
export const channels: Channel[] = seeds.map(
  ([id, name, short, polarity, color, hour, branch, pair, names]) => {
    const points = names.split(' ').map(
      (name, i): Point => ({
        id: `${id}${i + 1}`,
        name,
        channel: id,
        index: i + 1,
        position: interpolate(anchors[id], i + 1),
        roles: roleNames.filter((_, r) => roleMap[id]?.[r] === i + 1),
      }),
    );
    return {
      id,
      name,
      short,
      polarity,
      color,
      hour: hour < 0 ? undefined : hour,
      branch,
      pair,
      points,
      route: points.map((p) => p.position),
      note: '體表經穴順序示意；未顯示完整體內分支，三維位置待專業校準。',
    };
  },
);
// GB/T 12346-2021 inserts Yintang between GV24 and GV25 without
// renumbering the existing points. Keep its old URL codes as aliases below.
const governor = channels.find((c) => c.id === 'GV')!;
const yintang = extraCatalog.find((p) => p.id === 'EX-HN3')!;
const yintangStudy: IndicationStudy = {
  kind: 'secondary',
  summary:
    '痴呆、癇證、失眠、健忘、頭痛、眩暈、鼻衄、鼻淵、小兒驚風等傳統主治列舉。',
  references: [
    {
      label: '中國醫藥信息查詢平台 · 印堂穴（詳細主治）',
      url: 'https://m.dayi.org.cn/acupuncture/1141758.html',
    },
  ],
  note: '核對現代術語網頁，非古籍原版或療效研究。網頁附註説明原經外奇穴 EX-HN3 現歸督脈；本應用按現行國標使用 GV24+，舊編號僅用於檢索。摘要選錄部分病候，未展開產科急症或操作方法。',
};
governor.points.splice(24, 0, {
  ...yintang,
  id: 'GV24+',
  indications: yintangStudy.summary,
  indicationStudy: yintangStudy,
  channel: 'GV',
  index: 25,
  roles: [],
  bilateral: false,
  aliases: 'EX-HN3；GV29（舊編號）；印堂',
});
governor.points.forEach((p, i) => {
  p.index = i + 1;
});
governor.route = governor.points.map((p) => p.position);

const extraSeeds: [string, string, string[], Vec3[], string][] = [
  [
    'CHONG',
    '衝脈',
    ['SP4'],
    [
      [0.055, 0.86, 0.14],
      [0.058, 1.05, 0.19],
      [0.075, 1.27, 0.185],
      [0.055, 1.49, 0.12],
    ],
    '起於胞中、與任督同源的傳統循行概念；當前顯示腹胸段示意。八脈交會穴：公孫。',
  ],
  [
    'DAI',
    '帶脈',
    ['GB41'],
    Array.from(
      { length: 49 },
      (_, i) =>
        [
          0.255 * Math.cos((i / 48) * Math.PI * 2),
          1.055,
          0.15 * Math.sin((i / 48) * Math.PI * 2),
        ] as Vec3,
    ),
    '環腰一週的傳統循行示意。八脈交會穴：足臨泣；帶脈、五樞、維道等為交會穴。',
  ],
  [
    'YINQIAO',
    '陰蹺脈',
    ['KI6'],
    [
      [0.126, 0.076, 0.027],
      [0.115, 0.45, 0.018],
      [0.092, 0.78, 0.065],
      [0.11, 1.04, 0.166],
      [0.16, 1.31, 0.173],
      [0.08, 1.52, 0.11],
      [0.028, 1.715, 0.179],
    ],
    '從足內側上行至目內眥的概念示意。八脈交會穴：照海。',
  ],
  [
    'YANGQIAO',
    '陽蹺脈',
    ['BL62'],
    [
      [0.248, 0.071, 0.017],
      [0.267, 0.45, 0.028],
      [0.27, 0.84, -0.015],
      [0.31, 1.26, 0],
      [0.39, 1.43, 0.035],
      [0.116, 1.62, 0.08],
      [0.028, 1.715, 0.179],
    ],
    '從足外側上行至頭目的概念示意。八脈交會穴：申脈。',
  ],
  [
    'YINWEI',
    '陰維脈',
    ['PC6'],
    [
      [0.122, 0.27, -0.033],
      [0.11, 0.6, 0.04],
      [0.11, 0.86, 0.13],
      [0.2, 1.05, 0.16],
      [0.174, 1.271, 0.183],
      [0, 1.493, 0.097],
    ],
    '沿下肢內側上行聯絡腹胸咽喉的概念示意。八脈交會穴：內關。',
  ],
  [
    'YANGWEI',
    '陽維脈',
    ['TE5'],
    [
      [0.254, 0.17, -0.015],
      [0.26, 0.46, 0],
      [0.26, 0.9, 0],
      [0.31, 1.3, -0.045],
      [0.25, 1.473, -0.078],
      [0.085, 1.566, -0.094],
      [0.083, 1.739, -0.132],
      [0.1, 1.798, 0.106],
    ],
    '沿下肢外側與肩頸頭部聯絡的概念示意。八脈交會穴：外關。',
  ],
];
channels.find((c) => c.id === 'BL')!.routes = [
  channels.find((c) => c.id === 'BL')!.route.slice(0, 40),
  [
    channels.find((c) => c.id === 'BL')!.route[9],
    ...channels.find((c) => c.id === 'BL')!.route.slice(40, 54),
    channels.find((c) => c.id === 'BL')!.route[39],
    ...channels.find((c) => c.id === 'BL')!.route.slice(54),
  ],
];
export const pointById: Record<string, Point> = Object.fromEntries(
  channels.flatMap((c) => c.points.map((p) => [p.id, p])),
);
for (const [id, name, confluent, route, note] of extraSeeds)
  channels.push({
    id,
    name,
    short: name,
    polarity: '奇經八脈',
    color: '#71d7c4',
    points: [
      ...new Set([
        ...(vesselStudies[id]?.members.map((p) => p.id) || []),
        ...confluent,
      ]),
    ].map((p) => pointById[p]),
    vesselStudy: vesselStudies[id],
    route,
    note,
  });
for (const c of channels) c.confluentPointIds = confluentPointIds[c.id];
export const primaryChannels = channels.filter((c) => c.hour !== undefined);
export function channelAtHour(hour: number) {
  if (!Number.isFinite(hour)) throw new Error('Hour must be finite');
  const h = ((hour % 24) + 24) % 24;
  return primaryChannels.find((c) => (h - c.hour! + 24) % 24 < 2)!;
}
export function timeLabel(hour: number) {
  if (!Number.isFinite(hour)) throw new Error('Hour must be finite');
  const minutes = Math.floor((((hour % 24) + 24) % 24) * 60 + 1e-7) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export const diabetesHealthSource = {
  label: 'NCCIH · 糖尿病與補充健康方法',
  url: 'https://www.nccih.nih.gov/health/diabetes-and-dietary-supplements-what-you-need-to-know',
  scope: '未經證實的方法不能替代糖尿病規範治療。',
};
export const sources = [
  {
    label: 'GB/T 40997-2021 · 經外奇穴名稱與定位（51 條）',
    url: extraStandard.statusUrl,
    scope:
      '現行奇穴目錄與中文基本定位。金津玉液合為一組；未設英文代碼的 8 條不另造標準編號。舊資料和同位穴另作説明。',
  },
  {
    label: 'MakeHuman · CC0 人體網格',
    url: 'https://github.com/makehumancommunity/makehuman/blob/a8bc2d54ff0ac92e78ff71431b1023eda42bf482/LICENSE.ASSETS.md',
    scope:
      '提取基礎人體網格並調整前臂學習體位；通用資產並非醫學影像，也未還原特定人物。',
  },
  {
    label: 'GB/T 12346-2021 · 經穴名稱與定位（362 經穴）',
    url: nationalStandard.statusUrl,
    scope:
      '默認目錄採用現行國標：印堂 GV24+ 歸督脈。362 穴基本定位要點已整理，詳情鏈接到正文對應頁；條文註釋、文字校訂與三維定位校準分別處理。',
  },
  {
    label: 'WHO · 標準針灸穴名（361 經穴）',
    url: 'https://www.who.int/publications/i/item/9290611057',
    scope: '穴名、標準編碼參考；不意味着三維座標經 WHO 驗證。',
  },
  {
    label: 'TARA · 經穴本體與資料來源',
    url: 'https://github.com/SciCrunch/TARA-Ontology-Repository',
    scope: '穴名、傳統主治與定位資料核對入口。',
  },
  {
    label: '十二時辰與經脈對應 · 連州市衞生健康局',
    url: 'https://www.lianzhou.gov.cn/qylzwsj/gkmlpt/content/1/1736/post_1736096.html',
    scope: '傳統時辰配屬參考，不代表血管循環或現代生理測量。',
  },
  diabetesHealthSource,
];
export function mnemonic(c: Channel) {
  return classicSongs[c.id]?.text || extraordinarySong.text;
}
export const extraPoints: Point[] = extraCatalog.filter(
  (p) => p.id !== 'EX-HN3',
);
const refs: Record<
  string,
  {
    indications: string;
    region: string;
    referencePage: number | null;
    reference: string;
    curation: string;
  }
> = reference;
for (const p of Object.values(pointById)) {
  const r = refs[p.id];
  if (!r) continue;
  p.indications = r.indications;
  p.location = `體表區域：${r.region}。現代標準的完整文字定位見 WHO《西太平洋地區標準針灸穴位定位》${r.referencePage ? '第 ' + r.referencePage + ' 頁' : ''}。模型位置為近似示意。`;
  p.source = r.reference + '；' + r.curation;
}
for (const p of extraPoints) pointById[p.id] = p;

const nationalIndex: Record<
  string,
  { name: string; clause: string; pdfPage: number }
> = nationalStandard.points;
for (const [id, entry] of Object.entries(nationalIndex)) {
  const p = pointById[id];
  p.locationReference = {
    label: `GB/T 12346-2021 · ${entry.clause} · PDF 第 ${entry.pdfPage} 頁`,
    url: `${nationalStandard.documentUrl}#page=${entry.pdfPage}`,
  };
}
pointById.ST35.aliases = '外膝眼；M-LE26（舊資料編號）';
pointById.TE11.aliases = '清冷淵（所核古籍版本用字，現代標準名稱為清泠淵）';
applyPlacementRules(pointById);
// Standard text is authoritative; model-generation rules must not shorten or
// replace its anatomical landmarks. Preserve the separately authored LI digest.
for (const [id, location] of Object.entries(standardLocations)) {
  pointById[id].location = locationFacts[id]
    ? describeLocationFacts(locationFacts[id]) +
      (location.postureNote ? `體位提示：${location.postureNote}` : '')
    : describeStandardLocation(location);
}
for (const c of channels) {
  if (c.points.some((p) => p.modelPlacement) && c.id.length === 2)
    c.route = c.points.map((p) => p.position);
}
attachHumanMesh(pointById, channels);

const pointCodeAliases: Record<string, string> = {
  ...extraCodeAliases,
  'EX-HN3': 'GV24+',
  GV29: 'GV24+',
};
export function resolvePointId(value: string): string | null {
  const id = value.trim().toUpperCase();
  if (Object.hasOwn(pointById, id)) return id;
  return Object.hasOwn(pointCodeAliases, id) ? pointCodeAliases[id] : null;
}
export function parseComparisonPoints(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(',')
        .map(resolvePointId)
        .filter((id): id is string => id !== null),
    ),
  ].slice(0, 30);
}

export function canInspectPoint(
  selected: string | null,
  p: Point | null,
): boolean {
  return (
    !!p &&
    !!selected &&
    (getLuoStudy(selected)?.pointId === p.id ||
      p.channel === selected ||
      !!channels
        .find((c) => c.id === selected)
        ?.points.some((q) => q.id === p.id) ||
      !!confluentPointIds[selected]?.includes(p.id))
  );
}

// Collateral identities include the Ren/Du luo points and the great luo of
// the spleen. Keep 大絡 distinct so the spleen's usual 絡 category is 公孫.
for (const study of luoStudies) {
  const p = pointById[study.pointId];
  const role = study.id === 'LUO-SP-MAJOR' ? '大絡' : '絡';
  if (!p.roles.includes(role)) p.roles.push(role);
}

for (const [id, study] of Object.entries(primaryIndicationScan.points)) {
  const p = pointById[id];
  const document =
    primaryIndicationScan.documents[
      study.documentId as keyof typeof primaryIndicationScan.documents
    ];
  const scannedStudy: IndicationStudy = {
    kind: 'classical',
    summary: study.summary,
    excerpt: study.excerpt,
    references: [
      {
        label: `${document.title} · ${study.printedLeaf} · PDF 第 ${study.pdfPage} 頁（掃描）`,
        url: `${document.url}#page=${study.pdfPage}`,
      },
    ],
    note: study.note,
  };
  if ('supplemental' in study && study.supplemental) {
    p.additionalIndicationStudies = [
      ...(p.additionalIndicationStudies ?? []),
      scannedStudy,
    ];
    continue;
  }
  p.indications = study.summary;
  p.indicationStudy = scannedStudy;
  p.source = '文獻説明已按所附《針灸大成》掃描頁核對；現代定位與三維校準另列。';
}

// Standard basic indications are separate from historical accounts and locations.
for (const [id, entry] of Object.entries(standardIndications.points)) {
  const p = pointById[id];
  if (
    'preserveExisting' in entry &&
    entry.preserveExisting &&
    p.indicationStudy
  ) {
    p.additionalIndicationStudies = [
      ...(p.additionalIndicationStudies || []),
      p.indicationStudy,
    ];
  }
  p.indications = entry.summary;
  p.indicationStudy = {
    kind: 'standard',
    summary: entry.summary,
    references: [
      {
        label: `${standardIndications.standard}《${standardIndications.title}》· ${entry.clause} · 正文第 ${entry.printedPage} 頁（PDF 第 ${entry.pdfPage} 頁）`,
        url: `${standardIndications.documentUrl}#page=${entry.pdfPage}`,
      },
    ],
    note:
      '按國家標準原頁整理基礎主治。標準以古今文獻整理為依據，所列病證不等於逐病完成現代療效驗證；不包含特殊操作與個體治療方案。定位仍按現行定位標準單獨展示。' +
      (id === 'EX-B2'
        ? '夾脊為胸腰段穴組，主治須分段閲讀，不能認為每個穴點均對應全部病症。'
        : '') +
      (id === 'EX-B3' ? '消渴為傳統病證，不直接等同於現代糖尿病。' : ''),
  };
  p.source = '基礎主治已按所附國家標準原頁核對；三維位置校準另列。';
}
