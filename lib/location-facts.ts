// Anatomical facts curated from GB/T 12346-2021, clauses 5.2.1–5.2.20.
// This is an authored factual digest, not a transcription of the standard.
// Numeric cun values remain proportional measurements, never world coordinates.
export type LocationFacts = {
  region: string;
  landmarks: string[];
  relation: string;
};
export const locationFacts: Record<string, LocationFacts> = {
  LI1: {
    region: '食指橈側末端',
    landmarks: ['指甲根角'],
    relation: '甲根角側上方，距離 0.1 寸。',
  },
  LI2: {
    region: '食指根部橈側',
    landmarks: ['第二掌指關節', '赤白肉際'],
    relation: '關節遠端的皮膚移行處。',
  },
  LI3: {
    region: '手背橈側',
    landmarks: ['第二掌指關節'],
    relation: '關節近端凹陷；與二間分居該關節近、遠兩側。',
  },
  LI4: {
    region: '手背',
    landmarks: ['第一掌骨', '第二掌骨'],
    relation: '兩骨之間，約與第二掌骨橈側中點平齊。',
  },
  LI5: {
    region: '腕後外側',
    landmarks: ['腕背側遠端橫紋', '橈骨莖突', '解剖學鼻煙窩'],
    relation: '橫紋橈側、莖突遠端的鼻煙窩凹陷。',
  },
  LI6: {
    region: '前臂後外側',
    landmarks: ['陽溪 LI5', '曲池 LI11', '腕背側遠端橫紋'],
    relation: '沿陽溪—曲池連線，自腕橫紋向肘量 3 寸。',
  },
  LI7: {
    region: '前臂後外側',
    landmarks: ['陽溪 LI5', '曲池 LI11', '腕背側遠端橫紋'],
    relation: '沿陽溪—曲池連線，自腕橫紋向肘量 5 寸。',
  },
  LI8: {
    region: '前臂後外側',
    landmarks: ['陽溪 LI5', '曲池 LI11', '肘橫紋'],
    relation: '沿陽溪—曲池連線，自肘橫紋向腕量 4 寸。',
  },
  LI9: {
    region: '前臂後外側',
    landmarks: ['陽溪 LI5', '曲池 LI11', '肘橫紋'],
    relation: '沿陽溪—曲池連線，自肘橫紋向腕量 3 寸。',
  },
  LI10: {
    region: '前臂後外側',
    landmarks: ['陽溪 LI5', '曲池 LI11', '肘橫紋'],
    relation: '沿陽溪—曲池連線，自肘橫紋向腕量 2 寸。',
  },
  LI11: {
    region: '肘外側',
    landmarks: ['尺澤 LU5', '肱骨外上髁'],
    relation: '兩標誌連線的中點。',
  },
  LI12: {
    region: '肘後外側',
    landmarks: ['肱骨外上髁', '肱骨髁上嵴'],
    relation: '外上髁的上緣與髁上嵴的前緣處。',
  },
  LI13: {
    region: '上臂外側',
    landmarks: ['曲池 LI11', '肩髃 LI15', '肘橫紋'],
    relation: '曲池—肩髃連線上，自肘橫紋向肩量 3 寸。',
  },
  LI14: {
    region: '上臂外側',
    landmarks: ['曲池 LI11', '肩髃 LI15', '三角肌前緣'],
    relation: '經線與三角肌前緣相遇處；應優先辨認肌緣，不能只憑固定長度。',
  },
  LI15: {
    region: '肩帶',
    landmarks: ['肩峯外側緣前端', '肱骨大結節'],
    relation: '兩個骨性標誌之間的凹陷。',
  },
  LI16: {
    region: '肩帶',
    landmarks: ['鎖骨肩峯端', '肩胛岡'],
    relation: '兩骨之間的凹陷。',
  },
  LI17: {
    region: '頸前部',
    landmarks: ['環狀軟骨', '胸鎖乳突肌後緣'],
    relation: '肌肉後緣上，與環狀軟骨同高。',
  },
  LI18: {
    region: '頸前部',
    landmarks: ['甲狀軟骨上緣', '胸鎖乳突肌'],
    relation: '與甲狀軟骨上緣同高，位於該肌前後緣之間。',
  },
  LI19: {
    region: '鼻下方',
    landmarks: ['鼻孔外緣', '人中溝'],
    relation: '鼻孔外緣垂直向下，與人中溝上三分之一分界處同高。',
  },
  LI20: {
    region: '鼻旁',
    landmarks: ['鼻翼外緣中點', '鼻唇溝'],
    relation: '鼻翼外緣中點旁的鼻唇溝內。',
  },
};
export function describeLocationFacts(facts: LocationFacts): string {
  return `區域：${facts.region}。標誌：${facts.landmarks.join('、')}。關係：${facts.relation}（按國標整理的定位要點；寸為人體比例單位，三維座標仍待校準。）`;
}
