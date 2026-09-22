import type { Point, Vec3 } from './atlas';
import {
  abdominalY,
  bodyLandmarks,
  clavicularY,
  lateralCun,
  proportionalUnits,
  torsoSurface,
} from './body-landmarks';

// Factual distances/landmarks: GB/T 12346-2021, table 1 and each point's
// linked clause. Mannequin landmark coordinates remain authored estimates.
export type TorsoRule =
  | { kind: 'abdomen'; heightCun: number; lateral: number }
  | { kind: 'rib'; space: number; lateral: number }
  | { kind: 'clavicle'; lateral: number }
  | { kind: 'xiphoid' | 'notch' | 'belowNotch' | 'nipple' };
export const torsoRules: Record<string, TorsoRule> = {};
function abdomen(id: string, heightCun: number, lateral: number) {
  torsoRules[id] = { kind: 'abdomen', heightCun, lateral };
}
function rib(id: string, space: number, lateral: number) {
  torsoRules[id] = { kind: 'rib', space, lateral };
}
for (let i = 19; i <= 30; i++) abdomen(`ST${i}`, 25 - i, 2);
[-5, -4, -3, -2, -1, 0, 2, 3, 4, 5, 6].forEach((v, i) =>
  abdomen(`KI${i + 11}`, v, 0.5),
);
[-5, -4, -3, -2, -1.5, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((v, i) =>
  abdomen(`CV${i + 2}`, v, 0),
);
[-4.3, -1.3, 0, 3].forEach((v, i) => abdomen(`SP${i + 13}`, v, 4));
rib('LU1', 1, 6);
torsoRules.LU2 = { kind: 'clavicle', lateral: 6 };
torsoRules.ST13 = { kind: 'clavicle', lateral: 4 };
torsoRules.KI27 = { kind: 'clavicle', lateral: 2 };
for (let i = 14; i <= 18; i++) rib(`ST${i}`, i - 13, 4);
torsoRules.ST17 = { kind: 'nipple' };
for (let i = 22; i <= 26; i++) rib(`KI${i}`, 27 - i, 2);
for (let i = 17; i <= 20; i++) rib(`SP${i}`, 22 - i, 6);
for (let i = 17; i <= 20; i++) rib(`CV${i}`, 21 - i, 0);
rib('PC1', 4, 5);
rib('LR14', 6, 4);
rib('GB24', 7, 4);
torsoRules.CV16 = { kind: 'xiphoid' };
torsoRules.CV21 = { kind: 'belowNotch' };
torsoRules.CV22 = { kind: 'notch' };

export function torsoPosition(rule: TorsoRule): Vec3 {
  switch (rule.kind) {
    case 'abdomen':
      return torsoSurface(lateralCun(rule.lateral), abdominalY(rule.heightCun));
    case 'rib':
      return torsoSurface(
        lateralCun(rule.lateral),
        bodyLandmarks.intercostalY[rule.space],
      );
    case 'clavicle': {
      const x = lateralCun(rule.lateral);
      return torsoSurface(x, clavicularY(x));
    }
    case 'xiphoid':
      return torsoSurface(0, bodyLandmarks.xiphoidTipY);
    case 'notch':
      return torsoSurface(0, bodyLandmarks.sternalNotchY);
    case 'belowNotch':
      return torsoSurface(0, clavicularY(0));
    case 'nipple':
      return torsoSurface(
        bodyLandmarks.nippleHalfWidth,
        bodyLandmarks.intercostalY[4],
      );
  }
}
export function torsoDescription(rule: TorsoRule): string {
  const offset =
    'lateral' in rule
      ? rule.lateral
        ? `前正中線旁開 ${rule.lateral} 寸`
        : '前正中線上'
      : '前正中線上';
  switch (rule.kind) {
    case 'abdomen':
      return `${rule.heightCun === 0 ? '臍中水平' : `臍中${rule.heightCun > 0 ? '上' : '下'} ${Math.abs(rule.heightCun)} 寸`}，${offset}。`;
    case 'rib':
      return `第 ${rule.space} 肋間隙水平，${offset}。`;
    case 'clavicle':
      return `鎖骨下緣區域，${offset}。`;
    case 'xiphoid':
      return '劍突尖，前正中線上。';
    case 'notch':
      return '胸骨上窩中央，前正中線上。';
    case 'belowNotch':
      return '胸骨上窩下 1 寸，前正中線上。';
    case 'nipple':
      return '乳頭中央；通用人形的乳頭標誌採用第 4 肋間隙水平，個體乳頭位置不可由此推定。';
  }
}

type ForearmRule = {
  wrist: string;
  elbow: string | Vec3;
  cun: number;
  landmarks: string;
  sideOffset?: Vec3;
};
export const forearmRules: Record<string, ForearmRule> = {};
function forearm(
  id: string,
  wrist: string,
  elbow: string | Vec3,
  cun: number,
  landmarks: string,
) {
  forearmRules[id] = { wrist, elbow, cun, landmarks };
}
for (const [id, cun] of [
  ['LU6', 7],
  ['LU7', 1.5],
  ['LU8', 1],
] as const)
  forearm(id, 'LU9', 'LU5', cun, '前臂橈側；肌腱與動脈的細部位置另見原文');
for (const [id, cun] of [
  ['LI6', 3],
  ['LI7', 5],
  ['LI8', 8],
  ['LI9', 9],
  ['LI10', 10],
] as const)
  forearm(id, 'LI5', 'LI11', cun, '陽溪—曲池連線');
for (const [id, cun] of [
  ['HT4', 1.5],
  ['HT5', 1],
  ['HT6', 0.5],
] as const)
  forearm(id, 'HT7', 'HT3', cun, '前臂前內側，尺側腕屈肌腱的橈側緣');
for (const [id, cun] of [
  ['PC4', 5],
  ['PC5', 3],
  ['PC6', 2],
] as const)
  forearm(id, 'PC7', 'PC3', cun, '前臂前側，掌長肌腱與橈側腕屈肌腱之間');
forearm('SI6', 'SI5', 'SI8', 1, '前臂後側，尺骨頭橈側凹陷');
forearm('SI7', 'SI5', 'SI8', 5, '尺骨尺側與尺側腕屈肌之間');
// The olecranon is the zero-elbow landmark. TE10 is 1 cun above it and
// must not be substituted as the endpoint of the 12-cun forearm interval.
export const olecranon: Vec3 = [0.594, 1.1, -0.058];
for (const [id, cun] of [
  ['TE5', 2],
  ['TE6', 3],
  ['TE7', 3],
  ['TE8', 4],
  ['TE9', 7],
] as const)
  forearm(
    id,
    'TE4',
    olecranon,
    cun,
    id === 'TE7'
      ? '前臂後側，尺骨橈側緣；位於支溝尺側'
      : '前臂後側，尺骨與橈骨間隙',
  );
// Same longitudinal level as TE6; transverse offset is mannequin-specific.
forearmRules.TE7.sideOffset = [0.012, 0, 0];

export function alongForearm(wrist: Vec3, elbow: Vec3, cun: number): Vec3 {
  const t = cun / proportionalUnits.forearm;
  if (!Number.isFinite(t) || t < 0 || t > 1)
    throw new RangeError('Outside forearm interval');
  return wrist.map((v, i) => v + (elbow[i] - v) * t) as Vec3;
}
export function applyPlacementRules(points: Record<string, Point>) {
  for (const [id, rule] of Object.entries(torsoRules)) {
    const p = points[id];
    p.position = torsoPosition(rule);
    p.modelPlacement =
      torsoDescription(rule) +
      '模型已按比例和體表網格約束；解剖標誌仍為通用人形估計值，待逐穴複核。';
    // Keep more specific existing LU locations and ST17's nipple landmark.
    if (!['LU1', 'LU2'].includes(id))
      p.location =
        torsoDescription(rule) +
        '（定位要點；完整表述與個體差異見所附國標條款。）';
  }
  for (const [id, rule] of Object.entries(forearmRules)) {
    const wrist = points[rule.wrist].position;
    const elbow =
      typeof rule.elbow === 'string' ? points[rule.elbow].position : rule.elbow;
    const position = alongForearm(wrist, elbow, rule.cun);
    if (rule.sideOffset)
      rule.sideOffset.forEach((v, i) => {
        position[i] += v;
      });
    points[id].position = position;
    points[id].modelPlacement =
      `腕肘間按 12 骨度寸折算，本穴腕上 ${rule.cun} 寸。比例已約束；腕肘端點、橫向偏移及肌腱定位仍待複核。`;
    if (!id.startsWith('LU') && !id.startsWith('LI')) {
      const wristSurface =
        id.startsWith('HT') || id.startsWith('PC') ? '掌' : '背';
      points[id].location =
        `腕${wristSurface}側遠端橫紋向肘 ${rule.cun} 寸；${rule.landmarks}。完整定位與特殊體位見所附國標條款。`;
    }
  }
}
