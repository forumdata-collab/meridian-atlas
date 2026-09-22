'use client';
import primaryScans from '@/lib/primary-indication-scan.json';
import { summarizeSourceCoverage } from '@/lib/source-coverage';
import { searchPoints } from '@/lib/point-search';
import { getLocationIllustration } from '@/lib/location-illustrations';
import { getIndicationStudies } from '@/lib/indication-studies';
import { studyChannels as channels } from '@/lib/luo';
import { getLuoStudy, luoMemory, luoSource } from '@/lib/luo-data';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock3,
  Compass,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  Search,
  X,
  Plus,
  Minus,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Combinations from './Combinations';
import Pronunciation from './Pronunciation';
import JingmaiPanel from './JingmaiPanel';
import { LearnPage, CarePage } from './HealthPages';
import yangqiaoSource from '@/lib/yangqiao-source.json';
import daimaiSource from '@/lib/daimai-source.json';
import {
  classicSongs,
  extraordinarySong,
  classicalReferences,
} from '@/lib/classics';
import { useAtlasTools } from '@/lib/useAtlasTools';
import BodyViewer from './BodyViewer';
import { advanceLearningHour, periodProgress } from '@/lib/flow';
import { lungCourse } from '@/lib/lung-course';
import {
  courseCatalog,
  hasRegionalCourse,
  courseHasInternalSegments,
} from '@/lib/course-catalog';
import {
  primaryChannels,
  extraPoints,
  pointById,
  channelAtHour,
  timeLabel,
  canInspectPoint,
  roleNames,
  mnemonic,
  sources,
  type Point,
} from '@/lib/atlas';

const sourceCoverage = summarizeSourceCoverage(
  Object.values(pointById),
  Object.keys(primaryScans.points),
);

type Mode = 'atlas' | 'clock' | 'combinations' | 'sources' | 'learn' | 'care';
export default function AtlasApp({
  mode = 'atlas',
  initialPoints = [],
}: {
  mode?: Mode;
  initialPoints?: string[];
}) {
  const [manualSelected, setSelected] = useState<string | null>(
    initialPoints.length ? null : 'LU',
  );
  const [point, setPoint] = useState<Point | null>(null);
  const [query, setQuery] = useState('');
  const [pronunciationText, setPronunciationText] = useState<string | null>(
    null,
  );
  const openPronunciation = (text: string) => {
    setPlaying(false);
    setFlow(false);
    setReciting(false);
    setPronunciationText(text);
  };
  const [category, setCategory] = useState('primary');
  const [role, setRole] = useState('全部');
  const [extraScope, setExtraScope] = useState('all');
  const [showAll, setShowAll] = useState(!initialPoints.length),
    [labels, setLabels] = useState(true),
    [guides, setGuides] = useState(false),
    [internalCourse, setInternalCourse] = useState(false),
    [flow, setFlow] = useState(false),
    [hour, setHour] = useState(3),
    [playing, setPlaying] = useState(false),
    [view, setView] = useState('front:0');
  const [clockLinked, setClockLinked] = useState(mode === 'clock');
  const selected = clockLinked ? channelAtHour(hour).id : manualSelected;
  const clockProgress = clockLinked
    ? periodProgress(hour, channelAtHour(hour).hour!)!
    : undefined;
  const [compared, setCompared] = useState<string[]>(initialPoints);
  const [reciting, setReciting] = useState(false),
    [reciteIndex, setReciteIndex] = useState(0);
  const channel = channels.find((c) => c.id === selected);
  const luo = getLuoStudy(selected);
  const detailed = canInspectPoint(selected, point);
  const locationIllustration = getLocationIllustration(point?.id, detailed);
  const indicationStudies = getIndicationStudies(point, detailed);
  const courseData =
    selected === 'LU'
      ? {
          ...lungCourse,
          toggleLabel: '體內經過與腕後分支',
          focusLabel: '',
          summary:
            '中焦 → 絡大腸 → 胃口 → 膈 → 屬肺 → 肺系 → 出腋下；主段至拇指，腕後另分支至食指。',
        }
      : courseCatalog[selected || ''];
  const routeSource =
    selected === 'YANGQIAO'
      ? yangqiaoSource
      : selected === 'DAI'
        ? { ...daimaiSource, note: daimaiSource.scope }
        : null;
  const selectChannel = (id: string) => {
    setPlaying(false);
    setClockLinked(false);
    setSelected(id);
    setPoint(null);
    setRole('全部');
    setReciting(false);
    setReciteIndex(0);
    setFlow(false);
    if (getLuoStudy(id)) {
      setCategory('luo');
      setShowAll(false);
      setCompared([]);
      setInternalCourse(false);
    } else if (id !== 'EX') {
      setCategory(
        channels.find((c) => c.id === id)?.hour !== undefined
          ? 'primary'
          : 'extra',
      );
    }
  };
  const camera = (v: string) => setView(`${v}:${Date.now()}`);
  const moveHour = (h: number) => {
    setHour(h);
    selectChannel(channelAtHour(h).id);
    setClockLinked(true);
    setFlow(false);
  };
  const inspectPoint = (p: Point) => {
    setPoint(p);
    setPlaying(false);
    setFlow(false);
    setReciting(false);
  };
  useAtlasTools(
    { selected, point, hour },
    { selectChannel, setPoint: inspectPoint, moveHour },
    mode === 'atlas' || mode === 'clock',
  );
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () => setHour((h) => advanceLearningHour(h, 0.02)),
      40,
    );
    return () => clearInterval(t);
  }, [playing]);
  useEffect(() => {
    if (!reciting || !channel) return;
    const t = setInterval(
      () => setReciteIndex((i) => (i + 1) % channel.points.length),
      1300,
    );
    return () => clearInterval(t);
  }, [reciting, channel]);
  const globalPointMatches = useMemo(
    () => searchPoints(Object.values(pointById), query),
    [query],
  );
  const visiblePoints = useMemo(() => {
    const all =
      selected === 'EX'
        ? extraPoints
        : channel?.points ||
          (compared.length
            ? compared.map((id) => pointById[id])
            : Object.values(pointById));
    const q = query.toLowerCase().replace(/\s/g, '');
    return all.filter(
      (p) =>
        (selected !== 'EX' ||
          extraScope === 'all' ||
          p.catalog === extraScope) &&
        (role === '全部' || p.roles.includes(role)) &&
        (!q ||
          p.name.includes(q) ||
          p.aliases?.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)),
    );
  }, [channel, query, role, selected, compared, extraScope]);
  const list = channels.filter(
    (c) =>
      (category === 'primary'
        ? c.hour !== undefined
        : c.polarity === (category === 'luo' ? '十五絡脈' : '奇經八脈')) &&
      (!query ||
        c.name.includes(query) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.points.some(
          (p) =>
            p.name.includes(query) ||
            p.aliases?.toLowerCase().includes(query.toLowerCase()) ||
            p.id.toLowerCase().includes(query.toLowerCase().replace(/\s/g, '')),
        )),
  );
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Activity size={23} />
          </span>
          <span>
            經絡圖譜<small>MERIDIAN ATLAS</small>
          </span>
        </Link>
        <nav aria-label="主導航">
          {(
            [
              ['atlas', '/', '三維圖譜', Layers3],
              ['clock', '/clock', '十二時辰', Clock3],
              ['combinations', '/combinations', '配穴研習', BookOpen],
              ['learn', '/learn', '認識穴位', Sparkles],
              ['care', '/care', '都市保健', HeartPulse],
            ] as const
          ).map(([id, url, label, Icon]) => (
            <Link
              key={id}
              href={url}
              aria-current={mode === id ? 'page' : undefined}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <button
            type="button"
            className="pronunciation-trigger"
            onClick={() =>
              openPronunciation(
                window.getSelection()?.toString().trim() || point?.name || '',
              )
            }
          >
            查讀音
          </button>
          <a
            className="text-link"
            href="https://github.com/forumdata-collab/meridian-atlas"
            target="_blank"
            rel="noreferrer"
          >
            源碼 ↗
          </a>
          <Link href="/sources" className="edition">
            <span />
            研究預覽版 <span className="edition-version">v0.1</span>
          </Link>
        </div>
      </header>
      {pronunciationText !== null && (
        <Pronunciation
          initialText={pronunciationText}
          onClose={() => setPronunciationText(null)}
        />
      )}
      {(mode === 'atlas' || mode === 'clock') && luo && (
        <section
          className="mnemonic-card workspace-mnemonic"
          aria-label="十五絡記憶提要"
        >
          <div>
            <BookOpen size={17} />
            <strong>十五絡穴 · 記憶提要</strong>
            <button type="button" onClick={() => openPronunciation(luoMemory)}>
              提要注音
            </button>
          </div>
          <p>{luoMemory}</p>
          <p className="variant-note">
            按當前目錄編寫，非古籍歌訣原文。十二經各一絡，加任脈絡、督脈絡與脾之大絡，共十五絡。
          </p>
        </section>
      )}
      {(mode === 'atlas' || mode === 'clock') && channel && !luo && (
        <section
          className="mnemonic-card workspace-mnemonic"
          aria-label="經絡歌訣"
        >
          <div>
            <BookOpen size={17} />
            <strong>{channel.name} · 《針灸大成》歌訣</strong>
            <button
              type="button"
              onClick={() => openPronunciation(mnemonic(channel))}
            >
              歌訣注音
            </button>
            <button
              aria-pressed={reciting}
              onClick={() => {
                setPoint(null);
                setPlaying(false);
                setFlow(false);
                setReciting(!reciting);
                setReciteIndex(0);
              }}
            >
              {reciting ? '停止' : '逐穴帶讀'}
            </button>
          </div>
          <p>{mnemonic(channel)}</p>
          <a
            className="text-link"
            href={(classicSongs[channel.id] || extraordinarySong).url}
            target="_blank"
            rel="noreferrer"
          >
            古籍原文 ↗
          </a>
          {(classicSongs[channel.id] || extraordinarySong).note && (
            <p className="variant-note">
              {(classicSongs[channel.id] || extraordinarySong).note}
            </p>
          )}
          {channel.vesselStudy && (
            <p className="variant-note">
              逐穴帶讀按下方相關穴目錄順序進行；奇經歌訣與沿線關聯穴目錄分別供記憶、查閲，目錄不代表完整循行次序。
            </p>
          )}
          {reciting && (
            <output>
              {channel.points[reciteIndex]?.id} ·{' '}
              {channel.points[reciteIndex]?.name}
            </output>
          )}
        </section>
      )}
      {mode === 'sources' ? (
        <section className="document-page">
          <div className="eyebrow">REFERENCE & METHODOLOGY</div>
          <h1>每一層信息，都有邊界。</h1>
          <p>
            這是用於學習傳統經絡理論的交互圖譜。經絡光流表示傳統循行順序，不能解釋為人體血管中的血液流動。
          </p>
          <div className="source-grid">
            {[
              ...sources,
              ...classicalReferences,
              {
                label: luoSource.title,
                url: luoSource.url,
                scope: '十五絡脈循行、絡穴古今名稱與經間聯繫。',
              },
            ].map((s) => (
              <a
                className="source-card"
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
              >
                <BookOpen />
                <h2>{s.label}</h2>
                <p>{s.scope}</p>
                <span>查看來源 ↗</span>
              </a>
            ))}
          </div>
          <h2>逐穴資料核對進度</h2>
          <p>
            當前共 {sourceCoverage.total} 個獨立穴位條目，
            {sourceCoverage.withText} 條已有學習文字， 其中{' '}
            {sourceCoverage.withReference} 條附有逐穴獨立參考資料。
          </p>
          <ul>
            <li>{sourceCoverage.withScan} 條已核對所附古籍掃描條文。</li>
            <li>
              {sourceCoverage.otherReference} 條附有其他逐穴文獻或公開引文。
            </li>
            <li>
              {sourceCoverage.withoutReference}{' '}
              條尚未附獨立逐穴出處，現有彙編摘要仍待核對。
            </li>
          </ul>
          <p className="micro-note">
            此處統計文獻記錄，包含乳中的定位説明；不等同於治療主治數量、現代療效證據或解剖定位校準進度。節選範圍及古今差異見各穴詳情。
          </p>
          <div className="source-grid">
            {Object.values(primaryScans.documents).map((document) => (
              <a
                className="source-card"
                key={document.url}
                href={document.url}
                target="_blank"
                rel="noreferrer"
              >
                <BookOpen />
                <h2>{document.title}掃描本</h2>
                <p>逐穴出處鏈接會定位到對應 PDF 頁；原文與學習摘要分列。</p>
                <span>查看掃描本 ↗</span>
              </a>
            ))}
          </div>
          <h2>當前模型與資料狀態</h2>
          <p>
            默認目錄採用 GB/T 12346-2021 的 362 個經穴，包含督脈印堂 GV24+；WHO
            361 穴體系中的印堂 EX-HN3 可用舊編號檢索。362
            穴均已整理中文基本定位要點，並鏈接對應條款與原文頁碼；特殊體位和條文註釋需查看原文。人體採用
            CC0
            通用網格，已調整學習體位並綁定穴位標記；骨度參考和體表吸附尚未經過全身逐穴解剖校準，不能用於臨牀定位。奇經除任督以外的六脈顯示概念路線與八脈交會穴，不重複製造獨立經穴。
          </p>
          <p>
            五輸穴、原穴和絡穴可同時歸類。例如太淵既是輸穴也是原穴。原絡配穴與五輸穴的應用不侷限於內科疾病，需要結合辨證。
          </p>
          <p>
            十四經顯示《針灸大成》原歌，另列現代標準穴序。肝經、督脈穴數和部分古歌順序差異逐條標註。已錄入
            51 個 GB/T 40997-2021 奇穴條目，另保留 6
            條補充資料。金津玉液合為一組，外膝眼歸併犢鼻；未設英文代碼的條目不編造國標編號。胃脘下俞以胰俞為別名，消渴穴列為教學檢索稱呼。
          </p>
        </section>
      ) : mode === 'combinations' ? (
        <Combinations
          onExplore={(ids) => {
            window.location.href =
              '/?points=' + encodeURIComponent(ids.join(','));
          }}
        />
      ) : mode === 'learn' ? (
        <LearnPage />
      ) : mode === 'care' ? (
        <CarePage />
      ) : (
        <>
          <div className="workspace">
            <aside className="left-panel">
              <div className="panel-heading">
                <span className="eyebrow">CHANNEL LIBRARY</span>
                <span className="count">20 經脈 · 15 絡脈</span>
              </div>
              <h1>{mode === 'clock' ? '循時觀脈' : '探索經絡'}</h1>
              <p className="subtle">從一條經，認識全身的聯繫。</p>
              <label className="search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="查找經絡、穴名或編碼"
                  aria-label="查找經絡、穴位"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="清空搜索">
                    <X size={15} />
                  </button>
                )}
              </label>
              {query.trim() && (
                <section aria-label="全身穴位搜索結果">
                  <div className="section-label" aria-live="polite">
                    全身穴位搜索結果 · {globalPointMatches.length} 個
                  </div>
                  <div className="channel-list">
                    {globalPointMatches.map((p) => (
                      <button
                        key={p.id}
                        className="channel-row"
                        onClick={() => inspectPoint(p)}
                      >
                        <span className="channel-row-text">
                          <b>{p.name}</b>
                          <small>
                            {p.displayCode || p.id} ·{' '}
                            {channels.find((c) => c.id === p.channel)?.name ||
                              '經外奇穴'}
                          </small>
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                    {!globalPointMatches.length && (
                      <p className="empty">
                        沒有匹配的穴位，可嘗試穴名、別名或編碼。
                      </p>
                    )}
                  </div>
                </section>
              )}
              <Tabs
                value={category}
                onValueChange={(v) => setCategory(String(v))}
              >
                <TabsList className="library-tabs">
                  <TabsTrigger value="primary">十二正經</TabsTrigger>
                  <TabsTrigger value="extra">奇經八脈</TabsTrigger>
                  <TabsTrigger value="luo">十五絡脈</TabsTrigger>
                </TabsList>
                <TabsContent value={category}>
                  <div className="channel-list">
                    {list.map((c) => (
                      <button
                        key={c.id}
                        className={`channel-row ${selected === c.id ? 'selected' : ''}`}
                        onClick={() => selectChannel(c.id)}
                        style={
                          { '--channel-color': c.color } as React.CSSProperties
                        }
                      >
                        <span className="channel-symbol">{c.short}</span>
                        <span className="channel-row-text">
                          <b>{c.name}</b>
                          <small>
                            {getLuoStudy(c.id)
                              ? `${c.points[0].name} · ${c.points[0].id}`
                              : c.hour === undefined
                                ? '奇經 · 循行示意'
                                : `${c.branch}時 · ${String(c.hour).padStart(2, '0')}:00–${String((c.hour + 2) % 24).padStart(2, '0')}:00`}
                          </small>
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                    {!list.length && (
                      <p className="empty">
                        {globalPointMatches.length
                          ? '本分類沒有匹配經絡，可點擊上方穴位搜索結果。'
                          : '沒有匹配的經絡。試試“肺”或“LU9”。'}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <button
                className={`extra-link ${selected === 'EX' ? 'selected' : ''}`}
                onClick={() => selectChannel('EX')}
              >
                <Compass size={18} />
                <span>
                  經外奇穴
                  <small>國標 51 條 · 補充 6 條</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <div className="library-foot">
                <span className="status-dot" />
                學習模式<span>局部座標待校準</span>
              </div>
            </aside>
            <section
              id="atlas-viewer"
              className="viewer-panel"
              aria-label="三維圖譜工作區"
            >
              <div className="viewer-top">
                <div>
                  <span className="eyebrow">
                    {mode === 'clock'
                      ? '24-HOUR MERIDIAN CYCLE'
                      : 'INTERACTIVE ANATOMY'}
                  </span>
                  <h2>
                    {mode === 'clock'
                      ? `${timeLabel(hour)} · ${channelAtHour(hour).branch}時`
                      : '三維經絡圖譜'}
                  </h2>
                </div>
                <button
                  className="quiet-button"
                  onClick={() => {
                    setSelected(null);
                    setClockLinked(false);
                    setFlow(false);
                    setPoint(null);
                    setCompared([]);
                    setShowAll(true);
                    setReciting(false);
                    setPlaying(false);
                  }}
                >
                  <Layers3 size={16} />
                  全身總覽
                </button>
              </div>
              <BodyViewer
                selected={selected}
                point={point?.id || null}
                showAll={showAll}
                labels={labels}
                guides={guides}
                internalCourse={internalCourse}
                flow={flow}
                clockProgress={clockProgress}
                view={view}
                extraScope={selected === 'EX' ? extraScope : 'all'}
                onChannel={selectChannel}
                onPoint={inspectPoint}
                onPickStart={() => {
                  setPlaying(false);
                  setFlow(false);
                  setReciting(false);
                }}
                highlights={
                  reciting && channel
                    ? [channel.points[reciteIndex]?.id]
                    : compared
                }
              />
              <div className="body-orientation">
                旋轉人體 · 前 / 背 / 側<span>左右為人體自身方向</span>
              </div>
              <div className="view-tools">
                <button title="正面" onClick={() => camera('front')}>
                  正
                </button>
                <button title="背面" onClick={() => camera('back')}>
                  背
                </button>
                <button title="側面" onClick={() => camera('left')}>
                  側
                </button>
                <span />
                <button
                  title="放大"
                  aria-label="放大"
                  onClick={() => camera('in')}
                >
                  <Plus size={17} />
                </button>
                <button
                  title="縮小"
                  aria-label="縮小"
                  onClick={() => camera('out')}
                >
                  <Minus size={17} />
                </button>
                <button
                  title="復位視角"
                  aria-label="復位視角"
                  onClick={() => camera('front')}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              <div className="model-caption">
                <span className="status-dot" />
                {compared.length
                  ? `正在對照 ${compared.length} 個穴位`
                  : guides
                    ? '參考線：胸部肋間水平 · 腹部骨度分寸'
                    : '穴位位置為三維示意'}
                <span>點擊經絡選中 · 點擊穴位查看</span>
              </div>
              <div className="viewer-options">
                <label htmlFor="show-placement-guides">
                  <Switch
                    id="show-placement-guides"
                    checked={guides}
                    onCheckedChange={setGuides}
                    aria-label="顯示定位參考線"
                  />
                  定位參考
                </label>
                <label htmlFor="show-other-meridians">
                  <Switch
                    id="show-other-meridians"
                    checked={showAll}
                    onCheckedChange={setShowAll}
                    aria-label="顯示其他經絡"
                  />
                  其他經絡
                </label>
                <label htmlFor="show-point-labels">
                  <Switch
                    id="show-point-labels"
                    checked={labels}
                    onCheckedChange={setLabels}
                    aria-label="顯示穴位名稱"
                  />
                  穴位名稱
                </label>
                <button
                  className={flow ? 'active' : ''}
                  onClick={() => {
                    setSelected(selected);
                    setClockLinked(false);
                    setPlaying(false);
                    setFlow(clockLinked || !flow);
                  }}
                  disabled={!channel || !!luo}
                >
                  {flow ? <Pause size={16} /> : <Play size={16} />}
                  {luo ? '絡脈關係示意' : '單經循行'}
                </button>
              </div>
              {courseData && (
                <div className="internal-course-panel">
                  <label htmlFor="show-lung-course">
                    <Switch
                      id="show-lung-course"
                      checked={internalCourse}
                      onCheckedChange={setInternalCourse}
                      aria-label={`顯示${channel?.hour !== undefined ? channel.short + '經' : channel?.name}${courseData.toggleLabel}`}
                    />
                    {courseData.toggleLabel}
                  </label>
                  {internalCourse && (
                    <>
                      <p>{courseData.summary}</p>
                      <p>
                        {courseHasInternalSegments(selected)
                          ? '虛線為體內或不確定區域示意，實線為體表段。'
                          : '實線為體表段，虛線為不確定區域連接。'}
                        開啓「單經循行」可觀看敍述次序；播放速度僅用於學習。
                      </p>
                      {courseData.focusLabel && (
                        <button
                          type="button"
                          className="quiet-button"
                          onClick={() => {
                            camera(
                              'focusPoint' in courseData &&
                                courseData.focusPoint
                                ? `${'focusView' in courseData && courseData.focusView ? courseData.focusView : 'point'}-${courseData.focusPoint}`
                                : 'face',
                            );
                            document
                              .getElementById('atlas-viewer')
                              ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              });
                          }}
                        >
                          {courseData.focusLabel}
                        </button>
                      )}
                      <details>
                        <summary>這段三維循行的依據</summary>
                        <p>{courseData.note}</p>
                        <p>{courseData.passage}</p>
                        <a
                          href={courseData.source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {courseData.source.title} 原文 ↗
                        </a>
                      </details>
                    </>
                  )}
                </div>
              )}
              <div className="timeline">
                <div className="timeline-title">
                  <div>
                    <Clock3 size={16} />
                    <span>子午流注</span>
                    <small>傳統時辰配屬示意</small>
                  </div>
                  <button
                    onClick={() => {
                      if (!playing) {
                        selectChannel(channelAtHour(hour).id);
                        setClockLinked(true);
                        setFlow(false);
                      }
                      setPlaying(!playing);
                    }}
                  >
                    {playing ? <Pause size={15} /> : <Play size={15} />}{' '}
                    {playing ? '暫停' : '播放全天'}
                  </button>
                </div>
                <div className="hour-grid">
                  {primaryChannels.map((c) => (
                    <button
                      key={c.id}
                      className={
                        channelAtHour(hour).id === c.id ? 'current-hour' : ''
                      }
                      onClick={() => moveHour(c.hour!)}
                      title={`${c.hour}:00—${(c.hour! + 2) % 24}:00 ${c.name}`}
                    >
                      <span>{c.branch}</span>
                      <b>{c.short}</b>
                      <small>{String(c.hour).padStart(2, '0')}</small>
                    </button>
                  ))}
                </div>
                {clockLinked && channel && (
                  <div className="clock-progress">
                    <span>
                      {channel.points[0]?.name} → {channel.points.at(-1)?.name}{' '}
                      · 本時辰 {Math.floor(clockProgress! * 100 + 1e-7)}%
                    </span>
                    <progress
                      aria-label="時辰循行進度"
                      max={1}
                      value={clockProgress}
                    />
                    <small>
                      光點按時段比例沿示意路線前進，不代表實際氣血速度。
                    </small>
                  </div>
                )}
                <div className="time-slider">
                  <span>{timeLabel(hour)}</span>
                  <Slider
                    value={[hour]}
                    min={0}
                    max={23.99}
                    step={0.01}
                    onValueChange={(v) => {
                      setPlaying(false);
                      moveHour(Array.isArray(v) ? v[0] : v);
                    }}
                    aria-label="全天時刻"
                  />
                  <span>24 h</span>
                </div>
              </div>
            </section>
            <aside className="right-panel" aria-live="polite">
              {point ? (
                <>
                  <button className="back-link" onClick={() => setPoint(null)}>
                    ← 返回經絡
                  </button>
                  <div className="eyebrow">
                    ACUPOINT · {detailed ? 'DETAIL' : 'OVERVIEW'}
                  </div>
                  <div className="point-title">
                    <h2>{point.name}</h2>
                    <span>{point.displayCode || point.id}</span>
                    <button
                      type="button"
                      className="pronunciation-trigger"
                      onClick={() => openPronunciation(point.name)}
                    >
                      查此穴讀音
                    </button>
                  </div>
                  <p className="subtle">
                    {channels.find((c) => c.id === point.channel)?.name ||
                      '經外奇穴'}
                  </p>
                  {point.aliases && (
                    <p className="micro-note">別名 / 檢索詞：{point.aliases}</p>
                  )}
                  {point.catalogNote && (
                    <p className="micro-note">{point.catalogNote}</p>
                  )}
                  <div className="tags">
                    {point.roles.map((r) => (
                      <span key={r}>{r.endsWith('穴') ? r : r + '穴'}</span>
                    ))}
                  </div>
                  {detailed ? (
                    <>
                      <div className="section-label">
                        {point.locationReference
                          ? '國標定位要點'
                          : '位置與定位'}
                      </div>
                      <p className="detail-copy">
                        {point.location ||
                          '本條定位待補充，請從資料來源查看原文。'}
                      </p>
                      {point.locationReference && (
                        <>
                          <p className="micro-note">
                            定位中的“寸”為人體比例單位。特殊體位及條文註釋見原文，不能按屏幕距離取穴。
                          </p>
                          <a
                            className="text-link"
                            href={point.locationReference.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            核對定位原文：{point.locationReference.label} ↗
                          </a>
                        </>
                      )}
                      {locationIllustration && (
                        <div className="micro-note">
                          <p>{locationIllustration.note}</p>
                          <a
                            className="text-link"
                            href={locationIllustration.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            對照{locationIllustration.label} ↗
                          </a>
                          <p>
                            英文原圖，由 MEDBOX
                            提供文獻副本；本頁定位仍以所列國標為準。
                          </p>
                        </div>
                      )}
                      {point.modelPlacement && (
                        <p className="micro-note">
                          模型定位依據：{point.modelPlacement}
                        </p>
                      )}
                      <div className="section-label">
                        {point.id === 'ST17'
                          ? '定位標誌 · 文獻説明'
                          : '傳統主治 · 學習資料'}
                      </div>
                      <p className="detail-copy">
                        {point.indications ||
                          '逐穴主治資料正在核對，本條不以經絡的通用主治替代具體穴位主治。'}
                      </p>
                      <p className="clinical-note">
                        {point.id === 'ST17'
                          ? '此條用於定位學習，古籍文字與現代定位標準分列。'
                          : '主治是傳統文獻記載，不表示療效已獲現代臨牀證實。此圖不提供針刺操作指導。'}
                      </p>
                      <p className="micro-note">{point.source}</p>
                      {indicationStudies.map((study, studyIndex) => (
                        <section
                          key={`${study.kind}-${studyIndex}`}
                          className="indication-study"
                          aria-label={
                            point.id === 'ST17'
                              ? '定位文獻出處'
                              : '主治文獻出處'
                          }
                        >
                          <div className="section-label">
                            {study.kind === 'classical'
                              ? '古籍記載 · 核對方式見説明'
                              : study.kind === 'standard'
                                ? '國家標準 · 基礎主治'
                                : '補充資料 · 核對範圍見説明'}
                          </div>
                          {studyIndex > 0 && (
                            <p className="detail-copy">{study.summary}</p>
                          )}
                          {study.excerpt && (
                            <blockquote>“{study.excerpt}”</blockquote>
                          )}
                          <p className="micro-note">{study.note}</p>
                          {study.references.map((ref) => (
                            <a
                              className="text-link"
                              key={ref.url}
                              href={ref.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {point.id === 'ST17'
                                ? '核對定位文獻'
                                : '核對主治出處'}
                              ：{ref.label} ↗
                            </a>
                          ))}
                        </section>
                      ))}
                      <Link className="text-link" href="/sources">
                        查看資料來源與模型説明 ↗
                      </Link>
                    </>
                  ) : (
                    <div className="basic-info">
                      <p>
                        當前為穴位簡介。先選中所屬經絡，再查看定位、分類與傳統主治。
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => {
                          setClockLinked(false);
                          setPlaying(false);
                          setSelected(point.channel);
                          setRole('全部');
                        }}
                      >
                        進入
                        {channels.find((c) => c.id === point.channel)?.short ||
                          '奇穴'}
                        學習 <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : channel ? (
                <>
                  <div className="channel-detail-top">
                    <span className="eyebrow">
                      {channel.id} / {channel.polarity}
                    </span>
                    <span
                      className="dot"
                      style={{ background: channel.color }}
                    />
                  </div>
                  <h2 className="detail-name">{channel.name}</h2>
                  <div className="detail-meta">
                    <span>
                      {luo
                        ? '1 個絡穴 · 區域聯繫示意'
                        : channel.id.length <= 2
                          ? `${channel.points.length} 個經穴`
                          : '循行與交會穴'}
                    </span>
                    <span>
                      {luo
                        ? luo.connection
                        : channel.pair
                          ? `表裏 · ${channels.find((c) => c.id === channel.pair)?.short}經`
                          : '奇經體系'}
                    </span>
                  </div>
                  {luo && (
                    <section
                      className="vessel-study"
                      aria-label="十五絡循行資料"
                    >
                      <p>{luo.summary}</p>
                      <button
                        className="vessel-point"
                        onClick={() => {
                          inspectPoint(pointById[luo.pointId]);
                          camera(`point-${luo.pointId}`);
                        }}
                      >
                        查看絡穴 · {pointById[luo.pointId].name}（{luo.pointId}
                        ）
                      </button>
                      <button
                        className="vessel-point"
                        onClick={() => selectChannel(luo.parent)}
                      >
                        查看所屬經脈
                      </button>
                      <details>
                        <summary>《靈樞》絡脈原文與説明</summary>
                        <p>{luo.excerpt}</p>
                        {luo.note && <p>{luo.note}</p>}
                        <p className="micro-note">{luoSource.note}</p>
                        <a
                          className="text-link"
                          href={luoSource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {luoSource.title} ↗
                        </a>
                      </details>
                    </section>
                  )}
                  {channel.hour !== undefined && (
                    <div className="time-card">
                      <Clock3 size={21} />
                      <div>
                        <strong>{channel.branch}時</strong>
                        <span>
                          {String(channel.hour).padStart(2, '0')}:00 —{' '}
                          {String((channel.hour + 2) % 24).padStart(2, '0')}:00
                        </span>
                      </div>
                      <small>傳統流注時段</small>
                    </div>
                  )}
                  {channel.id.length <= 2 ? (
                    <div className="route-summary">
                      <span>{channel.points[0]?.name}</span>
                      <div>
                        <span />→<span />
                      </div>
                      <span>{channel.points.at(-1)?.name}</span>
                    </div>
                  ) : null}
                  {channel.confluentPointIds && (
                    <section className="vessel-study" aria-label="八脈交會穴">
                      <div className="section-label">八脈交會穴 · 肘膝以下</div>
                      {channel.confluentPointIds.map((id) => (
                        <button
                          className="vessel-point"
                          key={id}
                          onClick={() => inspectPoint(pointById[id])}
                        >
                          {pointById[id].name} <small>{id}</small>
                        </button>
                      ))}
                      <p className="micro-note">
                        這是與該奇經相通的八個特定穴之一，和沿線交會穴分開學習。
                      </p>
                    </section>
                  )}
                  {channel.vesselStudy && (
                    <section
                      className="vessel-study"
                      aria-label="奇經文獻關聯穴"
                    >
                      <div className="section-label">
                        《奇經八脈考》沿線關聯穴
                      </div>
                      <div className="vessel-points">
                        {channel.vesselStudy.members.map((member) => (
                          <button
                            className="vessel-point"
                            key={member.id}
                            onClick={() => inspectPoint(pointById[member.id])}
                          >
                            {pointById[member.id].name}{' '}
                            <small>
                              {member.id}
                              {member.landmark ? ' · 起點參照' : ''}
                            </small>
                          </button>
                        ))}
                      </div>
                      <p className="micro-note">{channel.vesselStudy.note}</p>
                      <p className="micro-note">
                        這是本書條文的關聯索引，穴名、代碼、定位仍取現行國標；模型使用現有穴點連接，解剖定位與完整體內分支仍待校準。
                      </p>
                      {channel.vesselStudy.references.map((ref) => (
                        <a
                          className="text-link"
                          href={ref.url}
                          key={ref.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          核對本篇：{ref.label} ↗
                        </a>
                      ))}
                    </section>
                  )}
                  {channel.routePresentation &&
                  !(hasRegionalCourse(channel.id) && internalCourse) ? (
                    <section className="vessel-study" aria-label="當前路線説明">
                      <div className="section-label">當前三維路線</div>
                      <p className="micro-note">
                        {channel.routePresentation.note}
                      </p>
                      <p className="micro-note">
                        {luo
                          ? '本圖展示絡脈的分佈與聯繫，不設置獨立時辰或播放速度；上下走向見循行提要與原文。'
                          : '實線：有穴點約束的體表示意；虛線：區域關係或體內段的體表投影。分段播放僅演示本段的敍述次序，不表示實測氣血速度。'}
                      </p>
                      {routeSource && (
                        <details>
                          <summary>{channel.name}循行原文與校訂説明</summary>
                          <p className="micro-note">{routeSource.passage}</p>
                          <p className="micro-note">{routeSource.note}</p>
                          {channel.id === 'DAI' && (
                            <>
                              <p className="micro-note">
                                腎經經別聯繫（與帶脈主線分開）：
                                {daimaiSource.kidneyDivergent}
                              </p>
                              <p className="micro-note">
                                {daimaiSource.relationNote}
                              </p>
                            </>
                          )}
                          <a
                            href={routeSource.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {routeSource.title} 原文 ↗
                          </a>
                        </details>
                      )}
                      {channel.routePresentation.paths.map((path, i) => (
                        <p className="micro-note" key={i}>
                          {path.label}
                          {path.animate === false ? ' · 無方向演示' : ''}
                        </p>
                      ))}
                    </section>
                  ) : (
                    <p className="micro-note">
                      {hasRegionalCourse(channel.id) && internalCourse
                        ? channel.id === 'LU'
                          ? '已顯示肺經體內區域與腕後分支示意；中府至少商仍為體表穴序參照，三維位置待校準。'
                          : `已顯示${channel.name}${courseHasInternalSegments(channel.id) ? '體內區域與分支' : '區域循行'}示意，三維位置待校準。`
                        : channel.note}
                    </p>
                  )}
                  {channel.hour !== undefined && (
                    <>
                      <div className="section-label">
                        五輸 · 原 · 絡 <span>肘膝以下及肘膝部</span>
                      </div>
                      <div className="special-grid">
                        {roleNames.map((r) => {
                          const p = channel.points.find((p) =>
                            p.roles.includes(r),
                          );
                          return (
                            <button
                              key={r}
                              onClick={() => {
                                setRole(r);
                                if (p) inspectPoint(p);
                              }}
                            >
                              <span>{r}</span>
                              <b>{p?.name || '—'}</b>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <JingmaiPanel
                    channel={channel}
                    onPoint={inspectPoint}
                    onChannel={selectChannel}
                    onPronounce={openPronunciation}
                  />
                </>
              ) : (
                <>
                  <span className="eyebrow">
                    {selected === 'EX' ? 'EXTRA ACUPOINTS' : 'EXPLORE'}
                  </span>
                  <h2 className="detail-name">
                    {selected === 'EX'
                      ? '經外奇穴'
                      : compared.length
                        ? '跨經配穴對照'
                        : '全身經絡'}
                  </h2>
                  <p className="detail-copy">
                    {selected === 'EX'
                      ? '國標收錄 51 個奇穴條目，另有 6 條補充資料。金津玉液合為一組，標準未設代碼的條目以名稱學習。可用“消渴”“鼻通”“落枕”等舊稱檢索。'
                      : '選擇左側經絡，或直接點擊人體上的線條。經絡選中後會發亮，並顯示穴序與特定穴分類。'}
                  </p>
                </>
              )}
              {!point && (
                <div className="points-section">
                  <div className="section-label">
                    {compared.length && !channel
                      ? '配穴目錄'
                      : luo
                        ? '本絡絡穴'
                        : channel?.id.length && channel.id.length > 2
                          ? '奇經相關穴目錄'
                          : '穴位目錄'}{' '}
                    <span>{visiblePoints.length} 個</span>
                  </div>
                  <div className="point-filter">
                    {selected === 'EX'
                      ? [
                          ['all', '全部 57'],
                          ['standard-extra', '國標 51'],
                          ['supplement-extra', '補充 6'],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            aria-pressed={extraScope === value}
                            className={extraScope === value ? 'chosen' : ''}
                            onClick={() => setExtraScope(value)}
                          >
                            {label}
                          </button>
                        ))
                      : (luo ? ['全部'] : ['全部', ...roleNames]).map((r) => (
                          <button
                            key={r}
                            className={role === r ? 'chosen' : ''}
                            onClick={() => setRole(r)}
                          >
                            {r}
                          </button>
                        ))}
                  </div>
                  <div className="point-list">
                    {visiblePoints.map((p) => (
                      <button key={p.id} onClick={() => inspectPoint(p)}>
                        <span>{p.displayCode || p.id}</span>
                        <b>{p.name}</b>
                        <small>
                          {p.catalog === 'supplement-extra'
                            ? '補充資料'
                            : p.roles.join(' / ')}
                        </small>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                    {!visiblePoints.length && (
                      <p className="empty">此分類下沒有匹配穴位。</p>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
          <footer>
            用於傳統中醫理論學習與研究 · 人體及循行均為示意，不能用於臨牀取穴。
            <Link href="/sources">資料來源與校訂狀態 ↗</Link>
          </footer>
        </>
      )}
    </div>
  );
}
