import source from './jingmai-source.json';
export const jingmaiSource = source;
export type CourseSection = {
  label: string;
  summary: string;
  pointIds: string[];
};
export type JingmaiStudy = {
  origin: string;
  belonging: string;
  connection: string;
  sections: CourseSection[];
  next: string;
  junction: string;
  note?: string;
};
// Authored summaries of the pinned route passages; modern point IDs are
// optional surface landmarks, never fabricated internal-organ acupoints.
export const jingmaiStudies: Record<string, JingmaiStudy> = {
  LU: {
    origin: '中焦',
    belonging: '肺',
    connection: '大腸',
    next: 'LI',
    junction: '食指端：肺經腕後支脈至食指，大腸經由食指端起。',
    sections: [
      {
        label: '體內起段',
        summary:
          '從中焦向下聯繫大腸，返回沿胃口，上行通過膈，歸屬於肺；再從肺系橫向出腋下。',
        pointIds: [],
      },
      {
        label: '上肢主段',
        summary:
          '沿上臂內側前部，經肘中、前臂、寸口和魚際，至拇指端。圖譜中中府至少商表示體表經穴順序。',
        pointIds: ['LU1', 'LU5', 'LU9', 'LU10', 'LU11'],
      },
      {
        label: '腕後分支',
        summary:
          '從腕後分出，直向食指內側，出食指端；這段不是少商到商陽之間的一條直連線。',
        pointIds: [],
      },
    ],
  },
  LI: {
    origin: '食指端',
    belonging: '大腸',
    connection: '肺',
    next: 'ST',
    junction: '鼻旁：大腸經上挾鼻孔，胃經從鼻部起。',
    sections: [
      {
        label: '手臂至肩',
        summary:
          '從食指端沿手指上緣，經合谷兩骨之間、腕部兩筋之間，上行前臂、肘外側、上臂外前側至肩。',
        pointIds: ['LI1', 'LI4', 'LI5', 'LI11', 'LI15'],
      },
      {
        label: '缺盆向內',
        summary:
          '從肩部上至頸後柱骨交會處，再下入缺盆，聯繫肺，經膈向下，歸屬於大腸。',
        pointIds: [],
      },
      {
        label: '頭面分支',
        summary:
          '從缺盆沿頸上頰，進入下齒，再繞出口旁，交會於人中；左右交叉後上行至鼻孔旁。',
        pointIds: ['LI20'],
      },
    ],
    note: '頭面支脈記有“左之右，右之左”。默認穴序連線沿同側；打開“體內經過與頭面分支”可查看交叉和口內區域示意，精確解剖仍待校準。',
  },
  ST: {
    origin: '鼻部、鼻根相交處',
    belonging: '胃',
    connection: '脾',
    next: 'SP',
    junction: '足大趾：胃經足背分支至大趾端，脾經由大趾端起。',
    sections: [
      {
        label: '頭面段',
        summary:
          '從鼻部沿鼻外下行，入上齒，繞口唇，下交承漿，再沿下頜、大迎、頰車、耳前和髮際上至額部。',
        pointIds: ['ST5', 'ST6', 'ST8'],
      },
      {
        label: '頸胸與體內分支',
        summary:
          '從大迎前下至人迎，沿喉入缺盆，經膈歸胃、聯繫脾；另一分支從胃口沿腹內下至氣街，與下行段會合。',
        pointIds: ['ST9', 'ST12', 'ST30'],
      },
      {
        label: '胸腹與下肢主段',
        summary:
          '從缺盆沿胸腹、臍旁下至氣街；會合後經髀關、伏兔、膝前、小腿外前側，至足背、足趾。',
        pointIds: [
          'ST21',
          'ST25',
          'ST30',
          'ST31',
          'ST32',
          'ST35',
          'ST36',
          'ST41',
          'ST45',
        ],
      },
      {
        label: '小腿與足背分支',
        summary: '小腿分支向足趾外側下行；足背另分支進入大趾間，並出大趾端。',
        pointIds: [],
      },
    ],
    note: '本轉錄對足趾終點保留“中指內間 / 次指外間”等異文。提要保留分支關係，不能用古文一處趾名改掉國標厲兑的定位。',
  },
  SP: {
    origin: '足大趾端',
    belonging: '脾',
    connection: '胃',
    next: 'HT',
    junction: '心中：脾經從胃上膈的分支注心，心經起於心中。',
    sections: [
      {
        label: '足至腹',
        summary:
          '沿大趾內側赤白肉際，經第一蹠趾關節後方、內踝前緣，沿小腿內側上行；交出肝經之前，經膝股內前側入腹。',
        pointIds: ['SP1', 'SP3', 'SP5', 'SP6', 'SP9', 'SP12'],
      },
      {
        label: '屬絡與舌部',
        summary: '入腹後歸脾、聯繫胃，向上過膈，沿咽兩側，連舌根並散佈舌下。',
        pointIds: [],
      },
      {
        label: '向心分支',
        summary: '再從胃分出，上行通過膈，注入心中。',
        pointIds: [],
      },
    ],
  },
  HT: {
    origin: '心中',
    belonging: '心（心繫）',
    connection: '小腸',
    next: 'SI',
    junction: '手小指：心經至小指內側端，小腸經由小指端起。',
    sections: [
      {
        label: '體內起段',
        summary: '從心中出屬心繫，向下經過膈，聯繫小腸。',
        pointIds: [],
      },
      {
        label: '咽、目分支',
        summary: '從心繫向上沿咽部兩側，聯繫目系。',
        pointIds: [],
      },
      {
        label: '腋至小指',
        summary:
          '從心繫向上經肺，下出腋下，沿上臂和前臂內側後緣，經肘內、腕部和手掌，沿小指內側出其端。',
        pointIds: ['HT1', 'HT3', 'HT7', 'HT9'],
      },
    ],
  },
  SI: {
    origin: '手小指端',
    belonging: '小腸',
    connection: '心',
    next: 'BL',
    junction: '目內眥：小腸經面部分支至內眼角，膀胱經由內眼角起。',
    sections: [
      {
        label: '手臂與肩胛',
        summary:
          '沿手外側上腕，經前臂、肘和上臂外後緣，出肩關節，繞肩胛並交肩上，進入缺盆。',
        pointIds: ['SI1', 'SI4', 'SI8', 'SI9', 'SI11'],
      },
      {
        label: '體內段',
        summary: '從缺盆聯繫心，沿嚥下行過膈，抵達胃，歸屬於小腸。',
        pointIds: [],
      },
      {
        label: '面耳分支',
        summary:
          '從缺盆循頸上頰，到外眼角，再入耳中；另一支從頰部分出，經顴鼻一帶到內眼角，斜向聯繫顴部。',
        pointIds: ['SI18', 'SI19'],
      },
    ],
    note: '公開轉錄在顴部字樣保留“䪼 䪼”的重複，原文欄照錄；提要用“顴鼻一帶”，未把網頁重複字當作兩個解剖節點。',
  },
  BL: {
    origin: '目內眥',
    belonging: '膀胱',
    connection: '腎',
    next: 'KI',
    junction: '足小趾：膀胱經至小趾外側，腎經從小趾下起。',
    sections: [
      {
        label: '頭項與腦部',
        summary:
          '從內眼角上額至頭頂；分支到耳上角，直行段入絡腦，再出而下至頸項。',
        pointIds: ['BL1', 'BL7', 'BL10'],
      },
      {
        label: '背腰與體內段',
        summary: '從肩背內側沿脊柱兩旁抵腰，進入脊旁深部，聯繫腎，歸屬於膀胱。',
        pointIds: ['BL13', 'BL23', 'BL28'],
      },
      {
        label: '背腿分支會合',
        summary:
          '一支由腰部經臀入膕窩；另一支從肩胛內側沿背、髖、股後外側下行，也在膕窩會合，再經小腿後側、外踝後與足外側至小趾。',
        pointIds: ['BL36', 'BL40', 'BL60', 'BL64', 'BL67'],
      },
    ],
  },
  KI: {
    origin: '足小趾之下',
    belonging: '腎',
    connection: '膀胱',
    next: 'PC',
    junction: '胸中：腎經從肺絡心、注胸中，心包經起於胸中。',
    sections: [
      {
        label: '足底至脊',
        summary:
          '從小趾下斜向足心，出然谷下，沿內踝後入足跟；經小腿、膕窩內側和大腿內後側上行，貫入脊部。',
        pointIds: ['KI1', 'KI2', 'KI3', 'KI10'],
      },
      {
        label: '屬絡與咽舌',
        summary: '歸腎、聯繫膀胱；從腎向上貫肝和膈，入肺，沿喉嚨並夾舌根。',
        pointIds: [],
      },
      {
        label: '胸中分支',
        summary: '從肺分出，聯繫心，注入胸中。',
        pointIds: [],
      },
    ],
    note: '本篇內行敍述與腹胸部經穴編號是兩層資料；不能把湧泉至俞府的體表連線視為全部經脈。',
  },
  PC: {
    origin: '胸中',
    belonging: '心包絡',
    connection: '三焦',
    next: 'TE',
    junction: '無名指：心包經掌中分支至無名指端，三焦經由無名指端起。',
    sections: [
      {
        label: '體內起段',
        summary: '從胸中出屬心包絡，下過膈，依次聯繫三焦。',
        pointIds: [],
      },
      {
        label: '胸脅至中指',
        summary:
          '支脈循胸出脅，至腋下，沿上臂內側兩陰經之間入肘，再循前臂兩筋之間入掌，沿中指出其端。',
        pointIds: ['PC1', 'PC3', 'PC6', 'PC8', 'PC9'],
      },
      {
        label: '掌中分支',
        summary: '從掌中分出，沿無名指出指端。',
        pointIds: [],
      },
    ],
  },
  TE: {
    origin: '手無名指端',
    belonging: '三焦',
    connection: '心包',
    next: 'GB',
    junction: '目外眥：三焦經頭面分支至外眼角，膽經由外眼角起。',
    sections: [
      {
        label: '手臂至胸腹',
        summary:
          '由無名指上手背、腕和前臂兩骨之間，經肘、上臂至肩，進入缺盆，布膻中、散絡心包，再下膈歸三焦。',
        pointIds: ['TE1', 'TE4', 'TE5', 'TE10', 'TE14'],
      },
      {
        label: '膻中上行支脈',
        summary: '從膻中向上出缺盆，經頸項、耳後、耳上角，轉折向下面頰、顴部。',
        pointIds: ['TE17', 'TE20'],
      },
      {
        label: '耳內與目外眥',
        summary: '另一支從耳後入耳中，再出耳前，經客主人前、面頰，至外眼角。',
        pointIds: ['TE21', 'TE23'],
      },
    ],
  },
  GB: {
    origin: '目外眥',
    belonging: '膽',
    connection: '肝',
    next: 'LR',
    junction: '足大趾：膽經足背分支至大趾、繞趾甲至叢毛，肝經由大趾叢毛處起。',
    sections: [
      {
        label: '頭頸與耳部分支',
        summary:
          '由外眼角上頭角、下耳後，經頸至肩入缺盆；耳後分支入耳，再出耳前，到外眼角後。',
        pointIds: ['GB1', 'GB2', 'GB20', 'GB21'],
      },
      {
        label: '頭面向內分支',
        summary:
          '從外眼角分出，下行面頰、頜部和頸，在缺盆會合；入胸過膈，聯繫肝、歸膽，循脅內，經腹股溝和陰毛際，到髖部。',
        pointIds: [],
      },
      {
        label: '胸脅至足',
        summary:
          '直行段從缺盆下腋，沿胸、季脅下合髖部，再經大腿外側、膝外側、小腿與外踝前，至足背和第四趾。',
        pointIds: ['GB22', 'GB24', 'GB30', 'GB34', 'GB40', 'GB44'],
      },
      {
        label: '足大趾分支',
        summary: '從足背另分出，入大趾間，沿大趾內側到端部，再繞趾甲至叢毛處。',
        pointIds: [],
      },
    ],
  },
  LR: {
    origin: '足大趾叢毛處',
    belonging: '肝',
    connection: '膽',
    next: 'LU',
    junction: '肺：肝經從肝分出、貫膈注肺，與肺經聯繫，十二經次序循環回肺。',
    sections: [
      {
        label: '足至小腹',
        summary:
          '從大趾經足背、內踝附近上行，在踝上八寸交出脾經之後，經膝內、大腿內側，進入陰毛部、繞陰器，抵小腹。',
        pointIds: ['LR1', 'LR3', 'LR4', 'LR8', 'LR12'],
      },
      {
        label: '屬絡至巔頂',
        summary:
          '夾胃而上，歸肝、聯繫膽，經膈、脅肋、喉後至鼻咽，連目系，上出額部，在頭頂與督脈相會。',
        pointIds: ['LR13', 'LR14'],
      },
      {
        label: '面部分支',
        summary: '由目系向下進入頰內，環繞口唇內側。',
        pointIds: [],
      },
      {
        label: '向肺分支',
        summary: '再從肝分出，上行經過膈，注入肺。',
        pointIds: [],
      },
    ],
  },
};
