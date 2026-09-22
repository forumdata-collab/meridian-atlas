import {
  yangweiCourse,
  yangweiCourseTimelines,
  type YangweiCoursePath,
} from './yangwei-course';
import {
  yinweiCourse,
  yinweiCourseTimelines,
  type YinweiCoursePath,
} from './yinwei-course';
import {
  yangqiaoCourse,
  yangqiaoCourseTimelines,
  type YangqiaoCoursePath,
} from './yangqiao-course';
import {
  yinqiaoCourse,
  yinqiaoCourseTimelines,
  type YinqiaoCoursePath,
} from './yinqiao-course';
import {
  chongCourse,
  chongCourseTimelines,
  type ChongCoursePath,
} from './chong-course';
import { gvCourse, gvCourseTimelines, type GvCoursePath } from './gv-course';
import { cvCourse, cvCourseTimelines, type CvCoursePath } from './cv-course';
import { stCourse, stCourseTimelines, type StCoursePath } from './st-course';
import { gbCourse, gbCourseTimelines, type GbCoursePath } from './gb-course';
import { blCourse, blCourseTimelines, type BlCoursePath } from './bl-course';
import { lrCourse, lrCourseTimelines, type LrCoursePath } from './lr-course';
import { kiCourse, kiCourseTimelines, type KiCoursePath } from './ki-course';
import { spCourse, spCourseTimelines, type SpCoursePath } from './sp-course';
import { teCourse, teCourseTimelines, type TeCoursePath } from './te-course';
import { pcCourse, pcCourseTimelines, type PcCoursePath } from './pc-course';
import { siCourse, siCourseTimelines, type SiCoursePath } from './si-course';
import type { Vec3 } from './atlas';
import type { FlowTimeline } from './flow';
import { liCourse, liCourseTimelines, type LiCoursePath } from './li-course';
import { htCourse, htCourseTimelines, type HtCoursePath } from './ht-course';

type CourseStudy = {
  channel: string;
  assetSha256: string;
  registrationSha256: string;
  source: {
    title: string;
    revision: string;
    url: string;
    sourceSha256: string;
  };
  passage: string;
  note: string;
  paths: Record<
    string,
    { label: string; kind: 'surface' | 'internal' | 'region'; points: Vec3[] }
  >;
  nodes: { label: string; position: Vec3 }[];
  toggleLabel: string;
  summary: string;
  focusLabel: string;
  focusPoint?: string;
  focusView?: 'sole' | 'dorsum' | 'lateral';
  timelines: (lengths: Record<string, number>) => Record<string, FlowTimeline>;
};

export const courseCatalog: Record<string, CourseStudy> = {
  YANGWEI: {
    ...yangweiCourse,
    toggleLabel: '肩頭循行與入耳區域',
    focusLabel: '查看頭耳回行',
    summary:
      '金門、陽交 → 股外側、居髎 → 脅肩、耳後 → 風池與頭部所列穴 → 陽白 → 入耳區域 → 本神。',
    timelines: (lengths) =>
      yangweiCourseTimelines(lengths as Record<YangweiCoursePath, number>),
  },
  YINWEI: {
    ...yinweiCourse,
    toggleLabel: '胸膈挾咽與頂前示意',
    focusLabel: '查看咽部與頂前',
    summary:
      '築賓 → 股內側、腹脅 → 期門 → 胸膈、挾咽 → 天突、廉泉 → 本書所述頂前區域。',
    timelines: (lengths) =>
      yinweiCourseTimelines(lengths as Record<YinweiCoursePath, number>),
  },
  YANGQIAO: {
    ...yangqiaoCourse,
    toggleLabel: '跟中起始與肩面回行',
    focusLabel: '查看跟中起始',
    focusPoint: 'BL62',
    focusView: 'lateral',
    summary:
      '跟中 → 申脈、僕參、跗陽 → 股外側、脅後、肩部 → 口吻、內眼角 → 髮際、耳後 → 風池。',
    timelines: (lengths) =>
      yangqiaoCourseTimelines(lengths as Record<YangqiaoCoursePath, number>),
  },
  YINQIAO: {
    ...yinqiaoCourse,
    toggleLabel: '胸裏咽目循行',
    focusLabel: '查看咽目連接',
    summary:
      '跟中 → 照海、交信 → 股內側 → 入陰、胸裏 → 缺盆、人迎之前 → 喉嚨、頄內廉 → 睛明。',
    timelines: (lengths) =>
      yinqiaoCourseTimelines(lengths as Record<YinqiaoCoursePath, number>),
  },
  CHONG: {
    ...chongCourse,
    toggleLabel: '背裏咽口與下行支路',
    focusLabel: '查看足部兩支',
    focusPoint: 'LR3',
    focusView: 'dorsum',
    summary:
      '胞中起始，分向背裏及氣衝腹部，上達胸中、咽喉與唇口；下行支自腎下出氣街，經腿內側、內踝後，分入足底及足背大趾間。',
    timelines: (lengths) =>
      chongCourseTimelines(lengths as Record<ChongCoursePath, number>),
  },
  GV: {
    ...gvCourse,
    toggleLabel: '脊裏入腦與別絡',
    focusLabel: '查看入腦與面部',
    summary:
      '按《奇經八脈考》：少腹會陰至長強，脊裏上行、系舌入腦，循巔額鼻至齦交；另示該書所述走任、面部入腦、下項絡腎別絡。',
    timelines: (lengths) =>
      gvCourseTimelines(lengths as Record<GvCoursePath, number>),
  },
  CV: {
    ...cvCourse,
    toggleLabel: '腹內經過與面部支路',
    focusLabel: '查看環唇與目下',
    summary:
      '按《奇經八脈考》：少腹內出會陰，循腹胸上喉頤；環唇後分行兩側面部至目下。另示該書所述尾翳別絡散腹。',
    timelines: (lengths) =>
      cvCourseTimelines(lengths as Record<CvCoursePath, number>),
  },
  ST: {
    ...stCourse,
    toggleLabel: '體內經過與口足分支',
    focusLabel: '查看足趾分支',
    focusPoint: 'ST42',
    focusView: 'dorsum',
    summary:
      '鼻外入上齒、環唇，經下頜分向額部與缺盆；屬胃絡脾、腹內與體表在氣街會合，下行後分向足趾與大趾。趾名異文保留在依據説明。',
    timelines: (lengths) =>
      stCourseTimelines(lengths as Record<StCoursePath, number>),
  },
  GB: {
    ...gbCourse,
    toggleLabel: '體內經過與耳足分支',
    focusLabel: '查看足背分支',
    focusPoint: 'GB41',
    focusView: 'dorsum',
    summary:
      '外眼角經頭、耳後和頸肩至缺盆；面頰支路下胸聯繫肝膽，與胸脅路線在髀部會合；下行到足背後分向第四趾及大趾。',
    timelines: (lengths) =>
      gbCourseTimelines(lengths as Record<GbCoursePath, number>),
  },
  BL: {
    ...blCourse,
    toggleLabel: '體內經過與頭腰分支',
    focusLabel: '查看頭頂與入腦',
    summary:
      '目內眥 → 額頂，分向耳上角和腦；出項後沿背部兩路下行，腰中另絡腎屬膀胱；兩路在膕窩會合，繼續到小趾外側。',
    timelines: (lengths) =>
      blCourseTimelines(lengths as Record<BlCoursePath, number>),
  },
  LR: {
    ...lrCourse,
    toggleLabel: '體內經過與目唇支路',
    focusLabel: '查看目系與環唇',
    summary:
      '大趾 → 腿內側 → 小腹 → 挾胃屬肝、絡膽 → 貫膈脅肋、喉後、目系 → 額與頭頂；目系分向頰裏、唇內，肝另分支上注肺。',
    timelines: (lengths) =>
      lrCourseTimelines(lengths as Record<LrCoursePath, number>),
  },
  KI: {
    ...kiCourse,
    toggleLabel: '體內經過與足底支路',
    focusLabel: '查看足底起始',
    focusPoint: 'KI1',
    focusView: 'sole',
    summary:
      '小趾下 → 足心 → 內踝、足跟 → 腿內後側 → 貫脊屬腎、絡膀胱；腎上貫肝膈入肺，再分向喉嚨舌本與心胸。',
    timelines: (lengths) =>
      kiCourseTimelines(lengths as Record<KiCoursePath, number>),
  },
  SP: {
    ...spCourse,
    toggleLabel: '體內經過與咽舌支路',
    focusLabel: '查看咽舌支路',
    summary:
      '大趾 → 腿內側 → 入腹屬脾、絡胃 → 上膈、挾咽、連舌本、散舌下；胃另分一支上膈，注心中。',
    timelines: (lengths) =>
      spCourseTimelines(lengths as Record<SpCoursePath, number>),
  },
  TE: {
    ...teCourse,
    toggleLabel: '體內經過與耳目分支',
    focusLabel: '查看耳目分支',
    summary:
      '無名指 → 手臂 → 肩背 → 缺盆 → 膻中，散絡心包、下膈聯繫三焦；胸中支路上出缺盆至耳後，分向耳上角、頰部，以及耳中、耳前到外眼角。',
    timelines: (lengths) =>
      teCourseTimelines(lengths as Record<TeCoursePath, number>),
  },
  PC: {
    ...pcCourse,
    toggleLabel: '體內經過與掌中分支',
    focusLabel: '查看掌中分支',
    focusPoint: 'PC8',
    summary:
      '胸中 → 心包絡，向下膈聯繫三焦；另一支出脅、抵腋下，沿臂入掌中，分向中指與無名指端。',
    timelines: (lengths) =>
      pcCourseTimelines(lengths as Record<PcCoursePath, number>),
  },
  SI: {
    ...siCourse,
    toggleLabel: '體內經過與面耳分支',
    focusLabel: '查看面耳分支',
    summary:
      '小指 → 手臂 → 肩胛 → 缺盆；一支絡心、循嚥下膈、抵胃屬小腸；面部一支至外眼角入耳，另一支經鼻旁到內眼角、斜絡顴部。',
    timelines: (lengths) =>
      siCourseTimelines(lengths as Record<SiCoursePath, number>),
  },
  LI: {
    ...liCourse,
    toggleLabel: '體內經過與頭面分支',
    focusLabel: '查看頭面交叉',
    summary:
      '食指 → 手臂 → 肩背 → 缺盆；一支絡肺、下膈、屬大腸，另一支循頸上頰、入下齒、交人中至對側鼻旁。',
    timelines: (lengths) =>
      liCourseTimelines(lengths as Record<LiCoursePath, number>),
  },
  HT: {
    ...htCourse,
    toggleLabel: '體內經過與咽目分支',
    focusLabel: '查看咽目支路',
    summary:
      '心中 → 心繫；分向下膈絡小腸、上挾咽聯繫目系，以及經肺出腋下，再沿上肢內後側至小指端。',
    timelines: (lengths) =>
      htCourseTimelines(lengths as Record<HtCoursePath, number>),
  },
};
export function hasRegionalCourse(id: string | null) {
  return id === 'LU' || !!(id && courseCatalog[id]);
}

export function courseHasInternalSegments(id: string | null) {
  return (
    id === 'LU' ||
    !!(
      id &&
      courseCatalog[id] &&
      Object.values(courseCatalog[id].paths).some(
        (path) => path.kind === 'internal',
      )
    )
  );
}
