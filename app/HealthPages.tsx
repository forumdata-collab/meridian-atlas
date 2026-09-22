'use client';
import {
  BookOpen,
  ChevronRight,
  HeartPulse,
  Leaf,
  MapPin,
  Moon,
  Ruler,
  Sparkles,
  Sun,
  Waves,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

type PointCard = {
  id: string;
  name: string;
  location: string;
  use: string;
  tip: string;
};

type Topic = {
  id: string;
  icon: typeof HeartPulse;
  title: string;
  subtitle: string;
  intro: string;
  points: PointCard[];
  dailyTip: string;
  color: string;
};

const topics: Topic[] = [
  {
    id: 'stress',
    icon: Sun,
    title: '壓力大・紓壓安神',
    subtitle: '都市人高壓日常',
    intro:
      '長期壓力、久坐盯屏容易令肝氣鬱結、氣機不暢。按揉以下穴位有助疏肝理氣、安定心神，讓繃緊的肩頸與情緒慢慢放鬆。',
    color: '#e49a72',
    dailyTip:
      '紓壓小貼士：每天下午或睡前，用拇指按揉太沖、合谷各 2–3 分鐘，感到痠脹即可；配合深呼吸（鼻吸 4 秒、口呼 6 秒）效果更佳。',
    points: [
      {
        id: 'LR3',
        name: '太沖',
        location: '足背，第 1、2 蹠骨間，蹠骨底結合部前方凹陷中（可觸及動脈搏動處）。',
        use: '肝經原穴，疏肝解鬱、平肝息風，是紓解壓力與煩躁的「消氣穴」。',
        tip: '用拇指從太沖向腳趾方向推按 2–3 分鐘，痠脹感明顯時效果最好。',
      },
      {
        id: 'LI4',
        name: '合谷',
        location: '手背，第 1、2 掌骨之間，約平第 2 掌骨橈側中點。',
        use: '大腸經原穴，鎮靜止痛、疏風解表，四總穴「面口合谷收」，亦為全身止痛要穴。',
        tip: '拇指與食指併攏時肌肉最高點附近即是；每次按揉 2 分鐘，兩手交替。',
      },
      {
        id: 'PC6',
        name: '內關',
        location: '前臂掌側，腕掌側遠端橫紋上 2 寸，掌長肌腱與橈側腕屈肌腱之間。',
        use: '心包經絡穴、八脈交會穴，寬胸理氣、寧心安神，對心悸、胸悶、噁心尤其常用。',
        tip: '腕橫紋上約三指寬（同身寸 2 寸）兩筋之間；按揉 2 分鐘可緩解暈車與緊張。',
      },
      {
        id: 'GV20',
        name: '百會',
        location: '頭頂正中，前髮際正中直上 5 寸（兩耳尖連線與頭正中線交點）。',
        use: '督脈穴，升陽舉陷、安神醒腦，被稱為「諸陽之會」，對頭暈、失眠、精神不振均有幫助。',
        tip: '用指腹輕輕打圈按揉 1–2 分鐘即可，不宜過重；頭皮有傷口時暫緩。',
      },
    ],
  },
  {
    id: 'sleep',
    icon: Moon,
    title: '失眠・助眠安神',
    subtitle: '瞓得靚先有精神',
    intro:
      '中醫認為「心主神明」，心神不寧則難以入睡。睡前按揉安神要穴，有助心腎相交、陰陽調和，讓身體自然進入休息狀態。',
    color: '#83a6f1',
    dailyTip:
      '助眠小貼士：睡前 1 小時放下手機，泡腳後按揉湧泉、三陰交各 3 分鐘，再輕揉安眠穴 2 分鐘；連續一週可見改善。',
    points: [
      {
        id: 'HT7',
        name: '神門',
        location: '腕掌側遠端橫紋尺側端，尺側腕屈肌腱橈側緣。',
        use: '心經原穴，養心安神，是失眠、心悸、健忘的首選穴，故名「神門」。',
        tip: '小指側腕橫紋凹陷處；睡前雙手各按揉 2–3 分鐘，配合緩慢呼吸。',
      },
      {
        id: 'N-HN54',
        name: '安眠',
        location: '頸部，翳風與風池連線的中點（耳後乳突後下方凹陷）。',
        use: '經外奇穴，顧名思義專治失眠，亦緩解頭痛、眩暈、心悸。',
        tip: '耳垂後方凹陷與髮際凹陷之間；用中指輕揉 2 分鐘，力度宜輕柔。',
      },
      {
        id: 'SP6',
        name: '三陰交',
        location: '小腿內側，內踝尖上 3 寸，脛骨內側緣後際。',
        use: '脾經穴，肝、脾、腎三經交會，調和臟腑、養血安神，是婦科與助眠雙效要穴。',
        tip: '內踝尖上約四指寬（3 寸）脛骨後緣；孕婦忌按！按揉 2–3 分鐘。',
      },
      {
        id: 'KI1',
        name: '湧泉',
        location: '足底，屈足捲趾時足心最凹陷中（約足底前 1/3 處）。',
        use: '腎經井穴，滋陰降火、引火歸元，對心煩失眠、手足心熱特別適合，俗稱「長壽穴」。',
        tip: '睡前以拇指用力按揉或搓熱雙足底各 50 次，可配合泡腳。',
      },
      {
        id: 'EX-HN3',
        name: '印堂',
        location: '額部，兩眉頭連線的中點。',
        use: '經外奇穴，寧心安神、醒腦開竅，對失眠、頭痛、緊張焦慮均有幫助。',
        tip: '用中指指腹從眉心向上輕推 1–2 分鐘，力度極輕，似觸非觸。',
      },
    ],
  },
  {
    id: 'edema',
    icon: Waves,
    title: '水腫・利水消腫',
    subtitle: '去水腫・輕盈啲',
    intro:
      '久坐少動、飲食偏鹹、熬夜都會令脾腎運化水濕失常，出現面部或下肢浮腫。健脾利濕、通調水道的穴位能幫助身體排出多餘水分。',
    color: '#63c9ac',
    dailyTip:
      '消腫小貼士：久坐族每小時起身活動 5 分鐘；每日按揉足三里、陰陵泉各 3 分鐘，並減少鹽分攝取，水腫改善更明顯。',
    points: [
      {
        id: 'CV9',
        name: '水分',
        location: '上腹部，臍中上 1 寸，前正中線上。',
        use: '任脈穴，通調水道、利水消腫，顧名思義專治水液代謝問題。',
        tip: '肚臍上方約一指寬處；手掌輕揉或以中指按壓 2 分鐘。',
      },
      {
        id: 'SP9',
        name: '陰陵泉',
        location: '小腿內側，脛骨內側髁下緣與脛骨內側緣之間的凹陷中。',
        use: '脾經合穴，健脾利濕、通利小便，是祛除體內濕氣水腫的第一要穴。',
        tip: '沿脛骨內側緣從膝蓋向下摸到凹陷處即是；用力按揉 3 分鐘至痠脹。',
      },
      {
        id: 'ST36',
        name: '足三里',
        location: '小腿外側，犢鼻（外膝眼）下 3 寸，犢鼻與解溪連線上。',
        use: '胃經合穴、強壯要穴，健脾和胃、扶正培元，脾胃健運則水濕自化，號稱「長壽穴」。',
        tip: '外膝眼下約四指寬處，脛骨外一橫指；每日按揉 3 分鐘，強身又消腫。',
      },
      {
        id: 'SP6',
        name: '三陰交',
        location: '小腿內側，內踝尖上 3 寸，脛骨內側緣後際。',
        use: '肝脾腎三經交會，健脾利濕、調理水液代謝，下肢水腫尤其常用。',
        tip: '同助眠篇定位；孕婦忌按。按揉 2–3 分鐘，可配合陰陵泉一併使用。',
      },
    ],
  },
  {
    id: 'height',
    icon: Leaf,
    title: '小孩增高・強身助長',
    subtitle: '長高黃金期調理',
    intro:
      '中醫認為小兒生長發育與「脾、腎」關係最密切——腎主骨生髓，脾為後天之本。脾胃好則營養吸收佳，腎氣足則骨骼生長旺。日常温和按揉有助強身助長。',
    color: '#91c97a',
    dailyTip:
      '助長小貼士：配合充足睡眠（晚上 9–11 點深睡）、跳繩籃球等縱向運動、均衡飲食；每日輕揉身柱、足三里 1–2 分鐘，長期堅持。',
    points: [
      {
        id: 'GV12',
        name: '身柱',
        location: '背部，第 3 胸椎棘突下凹陷中，後正中線上。',
        use: '督脈穴，被譽為小兒「強壯第一穴」，扶正祛邪、強身健體，傳統常用於小兒保健。',
        tip: '低頭時頸後最高骨（第 7 頸椎）往下數 4 個棘突即是；用掌心輕揉 1–2 分鐘。',
      },
      {
        id: 'ST36',
        name: '足三里',
        location: '小腿外側，犢鼻下 3 寸，犢鼻與解溪連線上。',
        use: '健脾和胃、增進食慾與吸收，脾胃強則氣血生化有源，生長發育自然旺盛。',
        tip: '小兒力度宜輕，用拇指輕揉 1–2 分鐘即可，每日一次。',
      },
      {
        id: 'BL20',
        name: '脾俞',
        location: '背部，第 11 胸椎棘突下，後正中線旁開 1.5 寸。',
        use: '膀胱經背俞穴，健脾益氣、助運化，改善小兒食慾不振、消化不良。',
        tip: '背部穴位建議由家長輕揉或熱敷，每次 1–2 分鐘；位置拿不準時可用掌心在背部中段輕撫。',
      },
      {
        id: 'BL23',
        name: '腎俞',
        location: '腰部，第 2 腰椎棘突下，後正中線旁開 1.5 寸。',
        use: '膀胱經背俞穴，補腎益精、強壯腰膝；腎主骨，腎氣充足有助骨骼生長。',
        tip: '肚臍正對後腰的棘突旁開兩指寬；掌心搓熱後輕揉 1–2 分鐘。',
      },
      {
        id: 'KI1',
        name: '湧泉',
        location: '足底，屈足捲趾時足心最凹陷中。',
        use: '腎經井穴，補腎益髓、強健體魄，常按有助小兒腎氣充盈、發育良好。',
        tip: '睡前輕揉雙足湧泉各 50 次，既補腎又有助入睡。',
      },
    ],
  },
];

const massageGuide = [
  { title: '力度', text: '以感到輕微痠、脹、麻為宜，不要按到疼痛。小兒與長者力度減半。' },
  { title: '頻率', text: '每個穴位每次 1–3 分鐘，每天 1–2 次；長期堅持比單次用力更有效。' },
  { title: '時機', text: '飯後 1 小時、洗澡後或睡前最適宜；飢餓、過飽、酒後不宜。' },
  { title: '工具', text: '徒手按揉最安全；亦可用拇指、指關節或按摩棒輔助，保持力度穩定。' },
];

const cautions = [
  '孕婦：合谷、三陰交、肩井等穴傳統列為慎用/禁用，孕期請勿自行按揉。',
  '皮膚破損、感染、濕疹處及關節腫痛處不宜按揉。',
  '發燒、急性腹痛、劇烈不適應先求醫，勿以穴位按摩代替診治。',
  '小兒皮膚嬌嫩，用指腹輕揉即可，避免長時間大力按壓。',
  '按揉期間若出現暈眩、心悸不適，立即停止並休息。',
  '本網站內容屬傳統中醫理論學習與保健參考，不構成醫療建議；如症狀持續，請諮詢註冊中醫師或醫生。',
];

const learnSections = [
  {
    icon: MapPin,
    title: '什麼是穴位？',
    text: '穴位（腧穴）是臟腑經絡之氣輸注、出入於體表的特定部位，是經絡系統上的「驛站」。中醫認為人體有一股維持生命的「氣」，沿著經絡這張網絡在全身運行；穴位就是這張網絡上氣血匯聚、可以施治的關鍵點。刺激穴位，便能調節對應臟腑的氣血，達到防治疾病、強身保健的作用。',
  },
  {
    icon: Activity,
    title: '穴位能做些什麼？',
    text: '① 反映病候：臟腑有病時，對應穴位常出現壓痛、痠脹或結節，是中醫診斷的依據之一。② 輸注氣血：穴位是經絡氣血運行的樞紐，聯繫表裡內外。③ 防治疾病：透過針刺、艾灸或按揉刺激穴位，可調整臟腑功能——「通則不痛，痛則不通」，按開瘀堵、調和陰陽，身體自然恢復平衡。',
  },
  {
    icon: Ruler,
    title: '如何準確找到穴位？',
    text: '中醫以「同身寸」量度——用每個人自己的手指比例取穴，胖瘦高矮皆適用。拇指同身寸：拇指指關節寬度為 1 寸。橫指同身寸：食指、中指、無名指、小指四指併攏，以中指中節橫紋為準的寬度為 3 寸。另外，許多穴位以體表標誌定位，如兩乳頭連線中點、外膝眼、內踝尖等，參照骨骼與肌肉凹陷處最準確。',
  },
  {
    icon: HeartPulse,
    title: '日常保健按揉方法',
    text: '最簡單有效的是「指壓按揉」：以拇指或中指指腹按在穴位上，先輕壓至出現痠脹感，再順時針慢慢揉動。每個穴位 1–3 分鐘，每日 1–2 次。也可用艾條温灸（距皮膚 2–3 釐米，以温熱不燙為度）5–10 分鐘，適合虛寒體質。兒童與體弱者宜用更輕柔的撫按。',
  },
];

export function LearnPage() {
  return (
    <section className="document-page guide-page">
      <div className="eyebrow">BEGINNER&apos;S GUIDE</div>
      <h1>認識穴位</h1>
      <p className="guide-lead">
        從「穴位是什麼」開始，學會找穴、按穴，把傳統養生智慧融入都市日常。
      </p>
      <div className="learn-grid">
        {learnSections.map((s) => (
          <article className="learn-card" key={s.title}>
            <s.icon size={22} />
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
      <h2 className="guide-h2">按揉四大原則</h2>
      <div className="massage-grid">
        {massageGuide.map((m) => (
          <div className="massage-item" key={m.title}>
            <strong>{m.title}</strong>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <h2 className="guide-h2">注意事項與禁忌</h2>
      <ul className="caution-list">
        {cautions.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div className="guide-cta">
        <BookOpen size={20} />
        <div>
          <h3>想認識全身經絡與穴位？</h3>
          <p>到 3D 人體圖譜旋轉、縮放，親手探索 419 個穴位的立體位置。</p>
        </div>
        <Link className="guide-btn" href="/">
          開啟 3D 圖譜 <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function CarePage() {
  return (
    <section className="document-page guide-page">
      <div className="eyebrow">CITY WELLNESS</div>
      <h1>都市人保健專區</h1>
      <p className="guide-lead">
        針對現代都市生活四大困擾——壓力、失眠、水腫、發育——精選常用穴位，按揉即養生。
      </p>
      <div className="topic-list">
        {topics.map((t) => (
          <article className="topic-card" key={t.id} style={{ borderTopColor: t.color }}>
            <header>
              <span className="topic-icon" style={{ background: `${t.color}22`, color: t.color }}>
                <t.icon size={20} />
              </span>
              <div>
                <h2>{t.title}</h2>
                <small>{t.subtitle}</small>
              </div>
              <Link
                className="topic-view3d"
                href={'/?points=' + encodeURIComponent(t.points.map((p) => p.id).join(','))}
              >
                3D 查看全部
              </Link>
            </header>
            <p className="topic-intro">{t.intro}</p>
            <div className="point-grid">
              {t.points.map((p) => (
                <div className="point-card" key={p.id}>
                  <div className="point-head">
                    <span className="point-code">{p.id}</span>
                    <b>{p.name}</b>
                    <Link
                      className="point-inspect"
                      href={'/?points=' + encodeURIComponent(p.id)}
                      aria-label={`在3D人體查看${p.name}`}
                    >
                      <Sparkles size={13} /> 3D
                    </Link>
                  </div>
                  <p className="point-location">
                    <MapPin size={12} /> {p.location}
                  </p>
                  <p className="point-use">
                    <strong>功用：</strong>
                    {p.use}
                  </p>
                  <p className="point-tip">
                    <strong>按法：</strong>
                    {p.tip}
                  </p>
                </div>
              ))}
            </div>
            <p className="topic-tip" style={{ borderLeftColor: t.color }}>
              {t.dailyTip}
            </p>
          </article>
        ))}
      </div>
      <h2 className="guide-h2">保健通用提醒</h2>
      <ul className="caution-list">
        {cautions.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div className="guide-cta">
        <BookOpen size={20} />
        <div>
          <h3>想親手在 3D 人體上找這些穴位？</h3>
          <p>點擊每個穴位的「3D」按鈕，即可在立體人體上高亮對應位置。</p>
        </div>
        <Link className="guide-btn" href="/">
          開啟 3D 圖譜 <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
