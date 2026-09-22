import data from './standard-location-facts.json';

export type StandardRelation =
  | {
      kind: 'distance';
      reference: string;
      direction: string;
      cun: number;
      detail: string;
      approximate: boolean;
    }
  | { kind: 'level' | 'axis'; reference: string }
  | { kind: 'line'; names: string[]; pointIds: string[] }
  | { kind: 'intercostal'; space: number }
  | { kind: 'anatomical'; detail: string };
export type StandardLocation = {
  region: string;
  relations: StandardRelation[];
  clause: string;
  pdfPage: number;
  postureNote?: string;
};
export const standardLocations = data.points as unknown as Record<
  string,
  StandardLocation
>;
export function describeStandardLocation(location: StandardLocation): string {
  const relations = location.relations.map((r) => {
    switch (r.kind) {
      case 'distance':
        return `${r.approximate ? '約在' : ''}${r.reference}${r.direction} ${r.cun} 寸${r.detail}`;
      case 'level':
        return `與${r.reference}同高`;
      case 'axis':
        return `位於${r.reference}`;
      case 'line':
        return `${r.names.join('—')}連線（${r.pointIds.join('—')}）`;
      case 'intercostal':
        return `第 ${r.space} 肋間隙`;
      case 'anatomical':
        return r.detail;
    }
  });
  return `區域：${location.region}。定位關係：${relations.join('；')}。${location.postureNote ? `體位提示：${location.postureNote}` : ''}`;
}
