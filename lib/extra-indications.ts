export type IndicationStudy = {
  kind: 'classical' | 'secondary' | 'standard';
  summary: string;
  references: { label: string; url: string }[];
  excerpt?: string;
  note: string;
};

const dacheng = {
  label: '《針灸大成》卷九 · 經外奇穴（維基文庫轉錄）',
  url: 'https://zh.wikisource.org/wiki/針灸大成/卷九',
};
const classical = (
  summary: string,
  excerpt: string,
  note: string,
): IndicationStudy => ({
  kind: 'classical',
  summary,
  excerpt,
  references: [dacheng],
  note,
});

// Historical disease terms and modern reference digests are independent of
// GB/T 40997's location facts. These records do not rate clinical efficacy.
export const extraIndicationStudies: Record<string, IndicationStudy> = {
  'EX-HN7': {
    kind: 'secondary',
    summary:
      '視神經炎、視神經萎縮、視網膜色素變性、青光眼、早期白內障、近視等眼病，見在線教材列舉。',
    references: [
      {
        label: '中醫世家《針灸學》· 頭頸部奇穴“球後”',
        url: 'https://www.zysj.com.cn/lilunshuji/zhenjiuxue/93-5-23_group.html',
      },
    ],
    note: '按眶下緣外1/4與內3/4交界處的球後條核對，不取前一上明條的主治。在線教材原版信息與原頁待校；本列表不證明能恢復視力，三維眼部標記不提供針刺路徑。',
  },
  'M-HN18': {
    kind: 'secondary',
    summary: '齒齦腫痛、口歪。',
    references: [
      {
        label: '中醫世家《針灸學》· 夾承漿',
        url: 'https://www.zysj.com.cn/lilunshuji/zhenjiuxue/3155.html',
      },
    ],
    note: '網頁為承漿兩側的夾承漿獨立條目，不借用承漿 CV24 的主治。僅據在線整理核對，教材原版信息和頁碼仍待校。',
  },
  'M-UE30': {
    kind: 'secondary',
    summary: '前臂疼痛、上肢麻痹或痙攣、胸脅疼痛等，見百科資料列舉。',
    references: [
      {
        label: 'A+醫學百科 · 臂中穴',
        url: 'https://www.a-hospital.com/w/臂中穴',
      },
    ],
    note: '僅核對到百科二次資料：前臂內側腕肘橫紋中點、掌長肌與橈側腕屈肌之間，與本條對應；不混同上臂臂臑 LI14。網頁轉引《備急千金要方》手逆注及《新醫療法手冊》未核原書，摘要只選錄部分病候。',
  },
  'EX-B9': {
    kind: 'secondary',
    summary: '癲癇、頭痛、失眠、便秘，見在線針灸資料列舉。',
    references: [
      {
        label: '醫砭《中華針灸》· 腰奇',
        url: 'https://yibian.hopto.org/shu/?lc=tw&sid=7455',
      },
    ],
    note: '依據尾骨端直上2寸的腰奇條核對。網頁寫 EX-B8，與本應用十七椎編號衝突，因此僅按名稱和位置對應，不導入其編號。該頁僅列《中醫雜誌》而無年卷頁，原刊待校。',
  },
  'M-HN21': {
    kind: 'secondary',
    summary: '舌強、失語、流涎、咽喉疼痛、口腔潰瘍。',
    references: [
      {
        label: '醫砭針灸庫 · 上廉泉',
        url: 'https://yibian.hopto.org/db/?ano=381',
      },
    ],
    note: '頁面指下頜下緣與廉泉之間的上廉泉，不合並廉泉 CV23 或廉泉三穴組合。其 EX-HN21 是資料編號，未用作現行國標代碼；原始教材版本待核。',
  },
  'M-BW34': {
    kind: 'secondary',
    summary: '坐骨神經痛、腰痛、腿痛。',
    references: [
      {
        label: '中醫世家《針灸學》· 奇穴下肢穴“環中”',
        url: 'https://www.zysj.com.cn/lilunshuji/zhenjiuxue/93-5-27_group.html',
      },
    ],
    note: '在線教材整理，原版出版信息與原頁待核。定位為環跳與腰俞連線中點，按環中獨立條目摘錄，不混入相鄰環跳 GB30 的主治；未收入現行國標奇穴目錄的狀態保留。',
  },
  'EX-LE4': {
    kind: 'secondary',
    summary: '腿疼、膝關節炎及鶴膝風等傳統病候。',
    references: [
      {
        label: '醫砭《中華針灸》· 內膝眼',
        url: 'https://yibian.hopto.org/cn/shu/?sid=7518',
      },
    ],
    note: '網頁明確髕韌帶內側凹陷，與內膝眼單穴對應；所引《備急千金要方》原頁待校，不把外膝眼犢鼻 ST35 的條文直接移入。鶴膝風保留為傳統病名。',
  },
  'EX-LE5': {
    kind: 'secondary',
    summary: '膝關節疼痛，見醫院膝眼穴組科普。',
    references: [
      {
        label: '河北省中醫院 · 骨關節疼痛穴位科普（2023-11-15）',
        url: 'https://www.hbszyy.cn/html/news/2023-11-15/7330.html',
      },
    ],
    note: '來源明確膝眼為雙膝髕韌帶內外側共四穴，外膝眼又名犢鼻。這裏保留穴組補充條目，不增計國標獨立穴；僅採用主治症狀，不採用科普中的療法效果或操作承諾。',
  },
  'EX-UE9': {
    kind: 'secondary',
    summary: '手臂紅腫、手指麻木、頭項強痛、咽痛、齒痛及目痛等傳統主治列舉。',
    references: [
      {
        label: '醫砭《中華針灸》· 八邪',
        url: 'https://yibian.hopto.org/shu/?lc=tw&sid=7482',
      },
    ],
    note: '按手背指蹼緣後方、左右共八穴的穴組核對。本摘要保留網頁所列病候，與另列的《針灸大成》原頁分開閲讀；未把網頁蛇傷列舉展開為急救方案，也不將腳部八風混入本組。',
  },
  'M-UE48': {
    kind: 'secondary',
    summary: '肩內側痛、肩關節周圍炎、偏癱、麻痹，見在線針灸資料列舉。',
    references: [
      {
        label: '醫砭《中華針灸》· 肩前',
        url: 'https://yibian.hopto.org/shu/?lc=cn&sid=7479',
      },
    ],
    note: '網頁肩前又名肩內陵，採用腋前皺襞頭與肩鎖關節連線中點的舊定位；現行國標為腋前皺襞盡端直上1.5寸，兩者分開閲讀。網頁 EX-UE12 編號不替代當前目錄；其《中醫臨牀新編》原書待校。',
  },
  'EX-UE3': {
    kind: 'classical',
    summary: '心痛、腹中諸氣痛等古代病候。',
    excerpt: '治心痛，及腹中諸氣痛不可忍者',
    references: [
      {
        label: '《奇效良方》卷五十五 · 中泉（在線轉錄）',
        url: 'https://www.theqi.com/simplified/cmed/oldbook/book105/b105_55.html',
      },
    ],
    note: '轉錄中泉條位於手背腕中、陽溪陽池之間，與腕部中泉對應；不借用足底湧泉 KI1 的主治。此為在線古籍轉錄，掃描版本仍待校。心痛保留為古代病候，不直接等同現代心臟病診斷。',
  },
  'EX-UE8': {
    kind: 'secondary',
    summary: '掌指麻痹、屈伸不利、消化不良、落枕，見在線針灸資料列舉。',
    references: [
      {
        label: '醫砭針灸庫 · 外勞宮',
        url: 'https://yibian.hopto.org/tw/db/?ano=429',
      },
    ],
    note: '網頁第2、3掌骨間的外勞宮與本條對應，項強、落枕保留為舊別名；不合並掌側勞宮 PC8 或其他小兒推拿位置。原始教材出處尚待核對。',
  },
  'EX-LE3': {
    kind: 'secondary',
    summary: '皮膚瘙癢、風疹塊、下部生瘡、蛔蟲病及腎臟風瘡等傳統主治列舉。',
    references: [
      {
        label: '醫砭針灸庫 · 百蟲窩',
        url: 'https://yibian.hopto.org/db/?ano=449',
      },
    ],
    note: '網頁定位在血海上1寸，並註明從血海分出；不能把古籍“百蟲窠即血海”的條文直接當成本穴現行定位。腎臟風瘡保留為古代病證，不直接改寫為現代腎病；原始文獻待校。',
  },
  'EX-HN8': {
    kind: 'secondary',
    summary: '鼻塞、鼻炎、鼻淵及頭痛等，見現代術語資料列舉。',
    references: [
      {
        label: '中國醫藥信息查詢平台 · 鼻通穴（上迎香）',
        url: 'https://m.dayi.org.cn/acupuncture/1000566.html',
      },
    ],
    note: '網頁明確鼻通又名上迎香，但並列不同定位説法；僅摘取部分主治，現行位置仍按國標，不混同鼻穿、內迎香。轉引的《常用新醫療法手冊》原書待校。',
  },
  'N-HN54': {
    kind: 'secondary',
    summary: '失眠、眩暈、頭痛、心悸，見中醫藥科普列舉。',
    references: [
      {
        label: '北京市中醫藥管理局 · 失眠科普（2025-04-16）',
        url: 'https://zyj.beijing.gov.cn/sy/whkp/202504/t20250416_4066814.html',
      },
    ],
    note: '網頁安眠定位為翳風與風池連線中點，與本條範圍對應；不合並其他資料的安眠1、安眠2或安眠四針。科普記載不等於療效試驗。',
  },
  'N-HN20': {
    kind: 'secondary',
    summary: '口歪、口瘡。',
    references: [
      {
        label: '醫學教育網 · 牽正穴定位和主治',
        url: 'https://www.med66.com/new/201402/sq201402118808.shtml',
      },
    ],
    note: '核對考試教育網站整理資料，未附原書頁碼；僅收錄其主治欄，不擴充為所有面神經疾病的適應症。',
  },
  'EX-HN14': {
    kind: 'secondary',
    summary:
      '近視、遠視、夜盲、早期白內障，以及耳鳴、眩暈、頭痛、失眠等，見在線針灸資料列舉。',
    references: [
      {
        label: '醫砭《中華針灸》· 翳明',
        url: 'https://yibian.hopto.org/tw/shu/?sid=7429',
      },
    ],
    note: '網頁指明翳風後1寸，與翳明條對應；不移入翳風 TE17 的主治。所列《中華醫學雜誌》1965年出處尚未核對原刊，本摘要不表示眼病療效已獲證實。',
  },
  'EX-HN1': {
    kind: 'secondary',
    summary: '失眠、頭暈、頭痛等，見醫院針灸推拿科科普列舉。',
    references: [
      {
        label: '玉溪市人民醫院 · 四神聰穴（2021-07-08）',
        url: 'https://www.yxhospital.com/c/2021/07/08/18454.shtml',
      },
    ],
    note: '醫院科普資料，非原始臨牀研究。網頁未附其療效與機制論述所依據的研究全文，本摘要只選錄症狀，不採用提高學習效率等效果承諾。四神聰為百會周圍四穴，現代定位獨立按國標展示。',
  },
  'EX-B1': {
    kind: 'secondary',
    summary: '哮喘、慢性支氣管炎、百日咳，以及落枕、肩背痛等，見醫院科普列舉。',
    references: [
      {
        label:
          '煙台市蓬萊中醫醫院 · 定喘穴科普（煙台市政府公開頁，2023-10-07）',
        url: 'https://www.yantai.gov.cn/art/2023/10/7/art_81036_3150045.html',
      },
    ],
    note: '這是採訪醫院推拿科醫生的健康科普，非古籍原頁或療效試驗。僅整理其列舉的相關病症，不把按摩描述改寫為哮喘急性發作的自救方案；現代國標定位與主治資料分列。',
  },
  'EX-HN4': classical(
    '眼生垂簾翳膜等古代眼病記載。',
    '治眼生垂廉翳膜',
    '魚腰條；“垂廉”按垂簾理解，翳膜不直接替換成單一現代眼病診斷。',
  ),
  'EX-HN5': classical(
    '眼部紅腫（古籍記載）。',
    '治眼紅腫',
    '太陽條轉錄後接“及頭”而缺少完整病候，本摘要不據缺文補寫頭痛；版本原頁仍待校。',
  ),
  'EX-HN6': classical(
    '眼生翳膜（古代眼病表述）。',
    '治眼生翳膜',
    '耳尖條；只摘錄明確病候，不擴充為現代眼科適應症。',
  ),
  'EX-HN12': classical(
    '重舌腫痛、喉閉等古代病候。',
    '治重舌腫痛，喉閉',
    '原文“左金津右玉液二穴”為一組，與現代合併條目對應；不把前一聚泉條的咳嗽、舌強移入本條。',
  ),
  'EX-CA1': classical(
    '婦人久無子嗣（古代病候記載）。',
    '治婦人久無子嗣',
    '子宮穴條；此為古代用穴記載，不表示已證實改善現代不孕症結局。',
  ),
  'EX-UE2': classical(
    '痔、脱肛（古籍記載）。',
    '治痔脱肛',
    '二白條；轉錄別名處有缺字，僅摘錄清楚的病候，不自行補寫別名。',
  ),
  'EX-UE4': classical(
    '五噎、反胃吐食等古代病候。',
    '治五噎，反胃吐食',
    '本條取中指第二節骨尖所述中魁；隨後“陽谿亦名中魁”為古籍同名提示，不把陽溪 LI5 的現代定位合並進來。',
  ),
  'EX-UE10': classical(
    '小兒猢猻勞等古代病候。',
    '治小兒猢猻勞等症',
    '四縫條；保留古代病名，不直接改寫為現代營養不良診斷，現代穴組數量與定位另以國標為準。',
  ),
  'EX-UE11': classical(
    '乳蛾（古代咽喉病證）。',
    '治乳蛾',
    '十宣條；不將其他資料常見的昏厥、急救病候加入此段摘要。',
  ),
  'EX-LE10': classical(
    '腳背紅腫（古籍記載）。',
    '治腳背紅腫',
    '八風條；足趾間穴組，與手部八邪分開。',
  ),
  'EX-HN2': {
    kind: 'classical',
    summary: '眼部急痛、不能遠視（古籍症狀記載）。',
    excerpt: '眼急痛不可遠視',
    references: [
      {
        label: '《備急千金要方》第六 · 目病第一（維基文庫轉錄）',
        url: 'https://zh.wikisource.org/wiki/備急千金要方/第六',
      },
    ],
    note: '本條同段載“穴名當陽”。這裏只摘取該段明確列出的症狀；“不可遠視”不直接換算成現代屈光診斷。',
  },
  'EX-HN9': classical(
    '目熱暴痛（眼部發熱感、突發疼痛的古籍表述）。',
    '治目熱暴痛',
    '所引為內迎香條，不與鼻翼外側的迎香、上迎香混同。',
  ),
  'EX-HN10': classical(
    '哮喘、咳嗽、久嗽，以及舌苔、舌強相關病候。',
    '哮喘咳嗽，及久嗽不愈',
    '原轉錄另載“舌胎舌強”；摘要將“胎”作苔解釋，舌強指古籍所述舌部活動不利，不據此給出現代病因診斷。',
  ),
  'EX-HN11': classical(
    '消渴（古代病證名稱）。',
    '治消渴',
    '古籍消渴與現代糖尿病並非完全對應；這一記載不能作為降糖療效的證明。',
  ),
  'EXTRA-XINSHE': {
    kind: 'secondary',
    summary: '頸項強痛、後頭痛、項部肌肉痙攣及扭傷、肩胛部疼痛。',
    references: [
      {
        label: 'A+醫學百科 · 新設穴（主治疾病欄）',
        url: 'https://www.a-hospital.com/w/新设穴',
      },
    ],
    note: '僅核對到網友整理的二次資料；頁面所列《新針灸學》及上海中醫學院《針灸學》原書尚待校核。其新設、新識定位並列，現行定位仍單獨以國標為準；本摘要不標為古籍原文或已完成教材審校。',
  },
  'EXTRA-XUEYADIAN': {
    kind: 'secondary',
    summary: '高血壓、低血壓、落枕，見現代穴位術語資料的主治列舉。',
    references: [
      {
        label: '中國醫藥信息查詢平台 · 血壓點穴',
        url: 'https://www.dayi.org.cn/acupuncture/1000419',
      },
    ],
    note: '頁面轉引《常用新醫療法手冊》，本輪核對網頁，原書待校。網頁另有“頭像強痛”文字疑點，未納入摘要；列舉血壓病名不表示已證實可雙向調節血壓。',
  },
  'EXTRA-TITUO': {
    kind: 'secondary',
    summary: '子宮脱垂、腎下垂、腹脹、腹痛、痛經、疝痛。',
    references: [
      {
        label: '中國醫藥信息查詢平台 · 提託穴（詳細主治）',
        url: 'https://www.dayi.org.cn/acupuncture/1000283.html',
      },
    ],
    note: '按現代術語網頁整理。頁面轉引《常用新醫療法手冊》《紅醫針療法》，原書尚待校核，不將轉引寫成已核原書。',
  },
  'EXTRA-JIEJI': {
    kind: 'classical',
    summary: '小兒痢下赤白、脱肛、如廁時腹痛（古籍記載）。',
    excerpt: '小兒痢下赤白秋末脱肛每厠腹痛不可忍',
    references: [
      {
        label: '《針灸資生經》四庫全書本 · 卷三“痢”（維基文庫轉錄）',
        url: 'https://zh.wikisource.org/wiki/鍼灸資生經_(四庫全書本)/卷3',
      },
    ],
    note: '本條依據實際核對到的《針灸資生經》轉錄；國標附錄所列較早出處《太平聖惠方》原版尚待校勘。古代痢證不直接等同於某一現代感染病診斷。',
  },
  'EX-B6': {
    kind: 'secondary',
    summary: '腰痛、脊柱周圍肌肉痙攣，以及婦人血崩的傳統主治記載。',
    references: [
      {
        label: '醫砭《中華針灸》· 腰宜（主治欄）',
        url: 'https://yibian.hopto.org/shu/?lc=tw&sid=7459',
      },
    ],
    note: '僅核對在線二次資料。其出處標為《針灸孔穴及其療法便覽》，該書原頁待校；婦人血崩保留為傳統病證用語。',
  },
  'EX-UE5': classical(
    '目久痛、翳膜、內障等古代眼病記載。',
    '治目久痛，及生翳膜內障',
    '古籍寫“大指中節”，與現行國標修訂後的掌指關節定位需分開閲讀；不由古文覆蓋現代位置。“內障”不直接替換為單一現代眼病名稱。',
  ),
  'EX-UE6': classical(
    '手指關節疼痛、目痛。',
    '治手節疼，目痛',
    '此為小骨空條的症狀摘要，未合併同名或相鄰穴的主治。',
  ),
  'EX-LE1': {
    kind: 'classical',
    summary: '腳腿疼痛、膝部紅腫疼痛（古歌記載）。',
    excerpt: '髖骨能治腳腿疼，膝頭紅腫痛難禁',
    references: [
      {
        label: 'GB/T 40997-2021 附錄 A 所引《玉龍歌》· PDF 第13頁',
        url: 'https://www.ntcamsac.ac.cn/upload/std_info/202306192147233032.pdf#page=13',
      },
    ],
    note: '這是標準資料性附錄引用的古歌，不能視為該定位標準制定了現代主治或確認了療效。',
  },
  'EX-LE8': classical(
    '下牙疼痛、足內側轉筋（抽筋的古籍表述）。',
    '治下爿牙疼，及腳內廉轉筋',
    '摘要保留內側方向，區分外踝尖條。',
  ),
  'EX-LE9': classical(
    '足外側轉筋、寒熱腳氣（古代病證）。',
    '治腳外廉轉筋，及治寒熱腳氣',
    '此處腳氣為古代病證名稱，不等同於今天俗稱腳氣的足癬。',
  ),
  'EXTRA-LINEITING': {
    kind: 'secondary',
    summary: '足趾疼痛、癲癇、小兒搐搦，見在線針灸資料列舉。',
    references: [
      {
        label: '醫砭針灸庫 · 裏內庭（功效欄）',
        url: 'https://yibian.hopto.org/db/?ano=467&lc=cn',
      },
    ],
    note: '這是二次資料摘要，原始教材出處尚待核定。網頁的 EX-LE21 屬另一資料編號體系，未用作本應用國標代碼；不混入足背內庭 ST44 的主治。',
  },
  'EX-LE11': classical(
    '小腸疝氣、乾噦、經血不調等古代病證記載。',
    '治小腸疝氣',
    '這裏只列本條部分主治；乾噦為乾嘔類古代症狀用語。未將原書產科急症記載展開為操作或自用方案。',
  ),
  'EX-LE12': {
    kind: 'classical',
    summary: '風毒腳氣、腳弱相關病候（古籍篇章語境）。',
    references: [
      {
        label: '《備急千金要方》第七 · 風毒腳氣方（維基文庫轉錄）',
        url: 'https://zh.wikisource.org/wiki/備急千金要方/第七',
      },
    ],
    note: '本卷腳弱灸法段明確提到“其足十趾端名曰氣端”；摘要依據該段病證語境，不擴充為現代急救適應症。古代腳氣不等同足癬。',
  },
};
