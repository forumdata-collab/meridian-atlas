'use client';
import { useEffect, useRef, useState } from 'react';
import { Dices, Volume2, X } from 'lucide-react';
import type { PronunciationResult } from '@/lib/pronunciation';
import { createReadAloudSession } from '@/lib/read-aloud';

type LookupModule = typeof import('@/lib/pronunciation');
type CantoneseModule = typeof import('@/lib/cantonese');
type CantoneseResult = ReturnType<CantoneseModule['lookupJyutping']>;
type DicePicks = ReturnType<LookupModule['randomPointPicks']>;

const isCantoneseVoice = (lang: string) =>
  /^yue([-_]|$)/i.test(lang) || /^zh[-_]?(HK|MO)$/i.test(lang);

export default function Pronunciation({
  initialText,
  onClose,
}: {
  initialText: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const playback = useRef<ReturnType<typeof createReadAloudSession> | null>(
    null,
  );
  const [query, setQuery] = useState(
    Array.from(initialText).slice(0, 500).join(''),
  );
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [jyutping, setJyutping] = useState<CantoneseResult | null>(null);
  const [lookup, setLookup] = useState<LookupModule | null>(null);
  const [cantonese, setCantonese] = useState<CantoneseModule | null>(null);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<'cmn' | 'yue' | null>(null);
  const [speechStatus, setSpeechStatus] = useState('');
  const [dice, setDice] = useState<DicePicks>([]);
  const [rolling, setRolling] = useState(false);
  const stop = () => {
    playback.current?.stop();
    playback.current = null;
    setSpeaking(null);
  };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = dialog.current!;
    node.showModal();
    input.current?.focus();
    const synth = window.speechSynthesis;
    const update = () =>
      setVoices(
        synth
          ?.getVoices()
          .filter((v) => /^zh([_-]|$)|^cmn([_-]|$)|^yue([_-]|$)/i.test(v.lang)) ||
          [],
      );
    update();
    synth?.addEventListener('voiceschanged', update);
    return () => {
      synth?.removeEventListener('voiceschanged', update);
      playback.current?.stop();
      playback.current = null;
      node.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    let active = true;
    Promise.all([import('@/lib/pronunciation'), import('@/lib/cantonese')])
      .then(([mandarin, yue]) => {
        if (!active) return;
        const mandarinResult = mandarin.lookupPronunciation(query);
        const chars = Array.from(mandarinResult.text);
        // Only use Mandarin readings for Cantonese disambiguation when the unit
        // arrays align 1:1 with the characters (they normally do).
        const align =
          mandarinResult.units.length === chars.length
            ? mandarinResult.units.map((u) => u.reading)
            : undefined;
        setLookup(mandarin);
        setResult(mandarinResult);
        setCantonese(yue);
        setJyutping(yue.lookupJyutping(query, align));
        setError('');
      })
      .catch(() => {
        if (active) setError('讀音字庫暫未加載成功，請關閉後重試。');
      });
    return () => {
      active = false;
    };
  }, [query]);
  const change = (text: string) => {
    stop();
    setSpeechStatus('');
    setResult(null);
    setJyutping(null);
    setQuery(Array.from(text).slice(0, 500).join(''));
  };
  const rollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (rollTimer.current) clearInterval(rollTimer.current);
    },
    [],
  );
  /** 魔法骰：shuffle a few times so it feels like a roll, then settle. */
  const roll = () => {
    if (!lookup) return;
    const previous = dice.map((d) => d.id);
    if (rollTimer.current) clearInterval(rollTimer.current);
    setRolling(true);
    let ticks = 0;
    rollTimer.current = setInterval(() => {
      ticks += 1;
      const last = ticks >= 6;
      setDice(lookup.randomPointPicks(4, last ? previous : []));
      if (last) {
        if (rollTimer.current) clearInterval(rollTimer.current);
        rollTimer.current = null;
        setRolling(false);
      }
    }, 85);
  };
  const cantoneseVoices = voices.filter((v) => isCantoneseVoice(v.lang));
  const mandarinVoices = voices.filter((v) => !isCantoneseVoice(v.lang));
  const speak = (target: 'cmn' | 'yue') => {
    if (speaking) {
      stop();
      return;
    }
    const pool = target === 'yue' ? cantoneseVoices : mandarinVoices;
    if (!result?.text || !pool.length) return;
    const speech = new SpeechSynthesisUtterance(result.text);
    speech.voice = pool[0];
    speech.lang = speech.voice.lang;
    speech.rate = target === 'yue' ? 0.75 : 0.8;
    const session = createReadAloudSession(
      window.speechSynthesis,
      speech,
      (reason) => {
        playback.current = null;
        setSpeaking(null);
        if (reason === 'error')
          setSpeechStatus('系統朗讀未能完成，仍可查看拼音。');
      },
    );
    playback.current = session;
    setSpeechStatus('');
    setSpeaking(target);
    session.start();
  };
  const single = result?.units.length === 1 ? result.units[0] : null;
  const canReadCmn =
    !!result?.units.some((u) => u.reading) && mandarinVoices.length > 0;
  const canReadYue =
    !!jyutping?.units.some((u) => u.reading) && cantoneseVoices.length > 0;
  return (
    <dialog
      ref={dialog}
      className="pronunciation-dialog"
      aria-labelledby="pronunciation-title"
      aria-describedby="pronunciation-help"
      onCancel={onClose}
    >
      <div className="pronunciation-heading">
        <div>
          <div className="eyebrow">READ & LEARN</div>
          <h2 id="pronunciation-title">查讀音</h2>
        </div>
        <button
          type="button"
          className="pronunciation-close"
          onClick={onClose}
          aria-label="關閉查讀音"
        >
          <X size={20} />
        </button>
      </div>
      <p id="pronunciation-help">
        輸入不認識的字、穴位名或歌訣，即可查看普通話拼音與粵語粵拼（Jyutping）。
      </p>
      <label htmlFor="pronunciation-input">要查詢的文字</label>
      <textarea
        ref={input}
        id="pronunciation-input"
        rows={2}
        value={query}
        onChange={(e) => change(e.target.value)}
        placeholder="例如：膻中、郄門、肩髎"
      />
      <div className="pronunciation-examples">
        <span>{Array.from(query).length} / 500 字</span>
        {['膻中', '郄門', '肩髎', '俞'].map((text) => (
          <button type="button" key={text} onClick={() => change(text)}>
            {text}
          </button>
        ))}
      </div>
      <div className="pronunciation-dice">
        <button
          type="button"
          className="dice-roll"
          onClick={roll}
          disabled={!lookup || rolling}
          aria-live="polite"
        >
          <Dices size={17} className={rolling ? 'dice-icon rolling' : 'dice-icon'} />
          {dice.length ? '再擲' : '魔法骰'}
        </button>
        {dice.length > 0 ? (
          <div className="dice-picks">
            <span className="dice-hint">抽中以下穴位，點一個查讀音：</span>
            {dice.map((p) => (
              <span className="dice-pick" key={p.id}>
                <button type="button" onClick={() => change(p.name)}>
                  <b>{p.name}</b>
                  <small>{p.id}</small>
                </button>
                <a
                  href={`/?points=${encodeURIComponent(p.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`在 3D 人體查看${p.name}`}
                  aria-label={`在 3D 人體查看${p.name}`}
                >
                  3D
                </a>
              </span>
            ))}
          </div>
        ) : (
          <p className="dice-hint">
            唔知查邊個好？擲吓骰，隨機抽幾個穴位試讀（抽中後可跳去 3D 人體睇位置）。
          </p>
        )}
      </div>
      <div
        className="pronunciation-result"
        aria-live="polite"
        aria-busy={!result && !error}
      >
        {error ? (
          <p role="alert">{error}</p>
        ) : !result ? (
          <p>正在查詢…</p>
        ) : !result.text ? (
          <p>輸入文字，或點擊上面的示例試一試。</p>
        ) : (
          <>
            <div className="pronunciation-lines">
              <div className="pronunciation-line">
                <span className="pronunciation-line-tag">普通話</span>
                <div className="pronunciation-ruby" aria-label="普通話注音">
                  {result.units.map((unit, i) =>
                    unit.reading ? (
                      <ruby key={i}>
                        {unit.text}
                        <rp>（</rp>
                        <rt>{unit.reading}</rt>
                        <rp>）</rp>
                      </ruby>
                    ) : (
                      <span key={i}>
                        {unit.text}
                        {unit.unknown && <small>（讀音待查）</small>}
                      </span>
                    ),
                  )}
                </div>
              </div>
              {jyutping?.text && (
                <div className="pronunciation-line">
                  <span className="pronunciation-line-tag yue">粵語</span>
                  <div
                    className="pronunciation-ruby jyutping"
                    aria-label="粵語注音（粵拼）"
                  >
                    {jyutping.units.map((unit, i) =>
                      unit.reading ? (
                        <ruby key={i}>
                          {unit.text}
                          <rp>（</rp>
                          <rt>{unit.reading}</rt>
                          <rp>）</rp>
                        </ruby>
                      ) : (
                        <span key={i}>
                          {unit.text}
                          {unit.unknown && <small>（粵拼待查）</small>}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
            {single && single.readings.length > 1 && (
              <p className="pronunciation-note">
                這是多音字：{single.readings.join(' / ')}
                。輸入完整穴位名，可按穴名查看讀音。
              </p>
            )}
            {result.units.some((u) => u.unknown) && (
              <p className="pronunciation-note">
                部分生僻字尚未收錄，可通過下方字典繼續查找。
              </p>
            )}
            {!result.units.some((u) => u.reading || u.unknown) && (
              <p className="pronunciation-note">未檢測到可注音的漢字。</p>
            )}
            {jyutping?.jyutping && (
              <p className="pronunciation-note pronunciation-jyutping-string">
                粵拼：<b>{jyutping.jyutping}</b>
              </p>
            )}
            {cantonese && cantonese.otherReadings(jyutping).length > 0 && (
              <p className="pronunciation-note">
                粵語多讀：{jyutping!.units[0].reading} /{' '}
                {cantonese.otherReadings(jyutping).join(' / ')}
                。輸入完整穴位名，可按國標普通話讀音定音。
              </p>
            )}
            {!!jyutping?.corrected && (
              <p className="pronunciation-note">
                已依 GB/T 12346-2021 普通話讀音校正 {jyutping.corrected}{' '}
                字的粵讀——字典最常見讀音未必適用於穴位名稱。
              </p>
            )}
          </>
        )}
      </div>
      <div className="pronunciation-actions">
        <button
          type="button"
          onClick={() => speak('cmn')}
          disabled={!canReadCmn && speaking !== 'cmn'}
        >
          <Volume2 size={17} />
          {speaking === 'cmn' ? '停止朗讀' : '普通話朗讀'}
        </button>
        <button
          type="button"
          className="yue"
          onClick={() => speak('yue')}
          disabled={!canReadYue && speaking !== 'yue'}
        >
          <Volume2 size={17} />
          {speaking === 'yue' ? '停止粵讀' : '粵語朗讀'}
        </button>
        {result?.text && (
          <a
            href={`https://www.zdic.net/hans/${encodeURIComponent(result.text)}`}
            target="_blank"
            rel="noreferrer"
          >
            到漢典查字 ↗
          </a>
        )}
      </div>
      <output className="pronunciation-note pronunciation-voice-status">
        {speechStatus ||
          (voices.length
            ? mandarinVoices.length && cantoneseVoices.length
              ? '系統朗讀僅作輔助，多音字可能與標註不同，請以顯示的拼音及來源説明為準。'
              : cantoneseVoices.length
                ? '本機提供粵語語音，未提供普通話語音；仍可查看兩種注音。'
                : mandarinVoices.length
                  ? '本機未提供粵語語音，粵拼仍可顯示；如系統「設定 → 語言」加入粵語／香港中文語音即可朗讀。'
                  : '當前設備尚未提供中文語音，仍可查看拼音。'
            : '當前設備尚未提供中文語音，仍可查看拼音。')}
      </output>
      {cantonese && (
        <p className="pronunciation-note">
          粵拼依據：{cantonese.jyutpingAttribution.primary}；
          {cantonese.jyutpingAttribution.alternates}；{cantonese.jyutpingAttribution.overrides}。
          <a
            href={cantonese.jyutpingAttribution.url}
            target="_blank"
            rel="noreferrer"
          >
            字庫來源 ↗
          </a>
          GB/T 12346-2021 只規定普通話讀音；粵語讀音屬參考，個別穴位讀法或有不同。
        </p>
      )}
      {result && lookup && result.sources.length > 0 && (
        <details className="pronunciation-sources">
          <summary>穴名讀音依據 · {result.sources.length} 項</summary>
          <ul>
            {result.sources.map((source) => (
              <li key={source.id}>
                <a
                  href={lookup.pronunciationSourceUrl(
                    source.standard,
                    source.pdfPage,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.name} · {source.standard} · {source.clause} · PDF 第{' '}
                  {source.pdfPage} 頁 ↗
                </a>
                <p>原標註：{source.sourcePinyin}</p>
                {source.note && (
                  <p>
                    {source.note}
                    {source.name === '頸百勞' && (
                      <>
                        {' '}
                        <a
                          href="https://www.zdic.net/hans/颈"
                          target="_blank"
                          rel="noreferrer"
                        >
                          字典“頸” ↗
                        </a>
                      </>
                    )}
                    {source.name.includes('俞') && (
                      <>
                        {' '}
                        <a
                          href="https://www.zdic.net/hans/俞"
                          target="_blank"
                          rel="noreferrer"
                        >
                          字典“俞” ↗
                        </a>
                      </>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
      <p className="pronunciation-note">
        穴名優先採用國標標音（差異見依據）；其餘文字由拼音字庫自動注音，粵拼則按字／穴名查表。古文和多音詞可結合上下文查字典。查詢在頁面內完成。
      </p>
    </dialog>
  );
}
