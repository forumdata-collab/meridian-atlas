'use client';
import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  channels,
  primaryChannels,
  pointById,
  diabetesHealthSource,
} from '@/lib/atlas';
import { extraordinarySong } from '@/lib/classics';
import {
  diabetesSource,
  diabetesCore,
  diabetesPatterns,
  classicalDiabetes,
  confluentPairs,
} from '@/lib/combinations';
export default function Combinations({
  onExplore,
}: {
  onExplore: (ids: string[]) => void;
}) {
  const [topic, setTopic] = useState('diabetes'),
    [edition, setEdition] = useState('modern'),
    [pattern, setPattern] = useState('core');
  const selectedPattern = diabetesPatterns.find((p) => p.id === pattern)!;
  const ids =
    edition === 'modern'
      ? [...diabetesCore, ...selectedPattern.points]
      : classicalDiabetes.points;
  const [baseChannel, setBaseChannel] = useState('LU');
  const base = channels.find((c) => c.id === baseChannel)!;
  const paired = channels.find((c) => c.id === base.pair)!;
  const yuan = base.points.find((p) => p.roles.includes('原'))!,
    luo = paired.points.find((p) => p.roles.includes('絡'))!;
  const pointCards = (items: string[]) => (
    <div className="association-points">
      {items.map((id) => (
        <a key={id} href={'/?points=' + encodeURIComponent(items.join(','))}>
          <span>{pointById[id].name}</span>
          <small>
            {pointById[id].displayCode || id} ·{' '}
            {channels.find((c) => c.id === pointById[id].channel)?.short ||
              '經外奇穴'}
          </small>
        </a>
      ))}
    </div>
  );
  return (
    <section className="document-page">
      <div className="eyebrow">CLINICAL READING ROOM</div>
      <h1>從一穴，到經絡之間。</h1>
      <p>
        配伍、辨證與文獻放在一起閲讀。這裏記錄學習資料，不生成個體治療處方。
      </p>
      <div className="combination-layout">
        <aside>
          {[
            ['diabetes', '消渴 / 糖尿病'],
            ['yuanluo', '原絡配穴'],
            ['confluent', '八脈交會'],
          ].map(([id, name]) => (
            <button
              key={id}
              className={topic === id ? 'selected' : ''}
              onClick={() => setTopic(id)}
            >
              {name}
              <ChevronRight size={16} />
            </button>
          ))}
          <p className="micro-note">
            中醫“消渴”與現代醫學糖尿病並非完全等同。疾病治療須結合辨證和現代規範診療。
          </p>
        </aside>
        <article className="study-card">
          {topic === 'diabetes' ? (
            <>
              <div className="tags">
                <span>有出處的學習記錄</span>
                <span>非療效保證</span>
              </div>
              <h2>消渴相關配穴</h2>
              <Tabs
                value={edition}
                onValueChange={(v) => setEdition(String(v))}
              >
                <TabsList>
                  <TabsTrigger value="modern">公開方案</TabsTrigger>
                  <TabsTrigger value="classic">古籍對照</TabsTrigger>
                </TabsList>
                <TabsContent value={edition}>
                  {edition === 'modern' ? (
                    <>
                      <p className="micro-note">
                        {diabetesSource.date} · {diabetesSource.section}
                      </p>
                      <div className="pattern-buttons">
                        {diabetesPatterns.map((p) => (
                          <button
                            key={p.id}
                            className={p.id === pattern ? 'selected' : ''}
                            onClick={() => setPattern(p.id)}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                      <p>{selectedPattern.explanation}</p>
                      <div className="section-label">文獻基礎穴組</div>
                      {pointCards(diabetesCore)}
                      {selectedPattern.points.length > 0 && (
                        <>
                          <div className="section-label">證型配穴</div>
                          {pointCards(selectedPattern.points)}
                        </>
                      )}
                      <p className="micro-note">
                        胃脘下俞在該方案中稱為胰俞。這裏摘錄穴組與辨證配穴關係，未評定該方案的臨牀證據等級，也不照錄操作方法。
                      </p>
                      <a
                        className="text-link"
                        href={diabetesSource.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {diabetesSource.title} ↗
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="section-label">
                        《針灸大成》鼻口門 · 消渴條用穴
                      </div>
                      {pointCards(ids)}
                      <p className="micro-note">{classicalDiabetes.note}</p>
                      <a
                        className="text-link"
                        href={classicalDiabetes.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        閲讀古籍原條文 ↗
                      </a>
                    </>
                  )}
                </TabsContent>
              </Tabs>
              <button className="primary-button" onClick={() => onExplore(ids)}>
                在三維圖譜中對照 <ArrowRight size={16} />
              </button>
              <div className="pending-note">
                <h3>胃脘下俞 · 胰俞 · “消渴穴”</h3>
                <p>
                  本圖以胃脘下俞 EX-B3 收錄，位於第八胸椎棘突下旁開 1.5
                  寸；“消渴穴”作為部分教學資料中的檢索稱呼，不另增一個重疊穴位。
                </p>
              </div>
              <p className="clinical-note">
                糖尿病需要規範監測和治療，針灸學習及古籍記載不能替代降糖治療。
              </p>
              <a
                className="text-link"
                href={diabetesHealthSource.url}
                target="_blank"
                rel="noreferrer"
              >
                NCCIH 健康資料 ↗
              </a>
            </>
          ) : topic === 'yuanluo' ? (
            <>
              <span className="eyebrow">YUAN–LUO PAIRING</span>
              <h2>主經原穴 · 表裏經絡穴</h2>
              <p>
                原絡配穴的一種學習框架：主病經取原穴，表裏經取絡穴。主客關係改變，配對也隨之改變；它並不只用於內科病。
              </p>
              <div className="pattern-buttons">
                {primaryChannels.map((c) => (
                  <button
                    key={c.id}
                    className={baseChannel === c.id ? 'selected' : ''}
                    onClick={() => setBaseChannel(c.id)}
                  >
                    {c.short}
                  </button>
                ))}
              </div>
              <div className="section-label">
                {base.short}經為主 · {paired.short}經為客
              </div>
              {pointCards([yuan.id, luo.id])}
              <p className="micro-note">
                {yuan.name}是{base.short}經原穴，{luo.name}是{paired.short}
                經絡穴。這是原絡關係演示，尚須根據實際病證選用。
              </p>
              <button
                className="primary-button"
                onClick={() => onExplore([yuan.id, luo.id])}
              >
                對照這組原絡穴 <ArrowRight size={16} />
              </button>
              <div className="section-label">經典閲讀</div>
              <a
                className="text-link"
                href="https://zh.wikisource.org/wiki/八十一難經#六十六難"
                target="_blank"
                rel="noreferrer"
              >
                《難經》六十六難 · 原穴理論 ↗
              </a>
            </>
          ) : (
            <>
              <span className="eyebrow">EIGHT CONFLUENT POINTS</span>
              <h2>八脈交會 · 四組相配</h2>
              <p>
                八個交會穴屬於十二正經，分別通於奇經八脈；並非在奇經上另建八個穴。
              </p>
              {confluentPairs.map((pair) => (
                <div className="pair-card" key={pair.name}>
                  <div className="section-label">
                    {pair.name}
                    <span>{pair.vessels}</span>
                  </div>
                  {pointCards(pair.points)}
                  <button
                    className="text-link"
                    onClick={() => onExplore(pair.points)}
                  >
                    在模型中對照 →
                  </button>
                </div>
              ))}
              <a
                className="text-link"
                href={extraordinarySong.url}
                target="_blank"
                rel="noreferrer"
              >
                《針灸大成》奇經八脈歌 ↗
              </a>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
