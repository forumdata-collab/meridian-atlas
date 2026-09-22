'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import type { PronunciationResult } from '@/lib/pronunciation';
import { createReadAloudSession } from '@/lib/read-aloud';

type LookupModule = typeof import('@/lib/pronunciation');
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
  const [lookup, setLookup] = useState<LookupModule | null>(null);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const stop = () => {
    playback.current?.stop();
    playback.current = null;
    setSpeaking(false);
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
          .filter((v) => /^zh([_-]|$)|^cmn([_-]|$)/i.test(v.lang)) || [],
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
    import('@/lib/pronunciation')
      .then((module) => {
        if (!active) return;
        setLookup(module);
        setResult(module.lookupPronunciation(query));
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
    setQuery(Array.from(text).slice(0, 500).join(''));
  };
  const speak = () => {
    if (speaking) {
      stop();
      return;
    }
    if (!result || !voices.length) return;
    const speech = new SpeechSynthesisUtterance(result.text);
    speech.voice = voices.find((v) => /^zh[-_]CN$/i.test(v.lang)) || voices[0];
    speech.lang = speech.voice.lang;
    speech.rate = 0.8;
    const session = createReadAloudSession(
      window.speechSynthesis,
      speech,
      (reason) => {
        playback.current = null;
        setSpeaking(false);
        if (reason === 'error')
          setSpeechStatus('系統朗讀未能完成，仍可查看拼音。');
      },
    );
    playback.current = session;
    setSpeechStatus('');
    setSpeaking(true);
    session.start();
  };
  const single = result?.units.length === 1 ? result.units[0] : null;
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
        輸入不認識的字、穴位名或歌訣，即可查看拼音。
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
            <div className="pronunciation-ruby" aria-label="注音結果">
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
          </>
        )}
      </div>
      <div className="pronunciation-actions">
        <button
          type="button"
          onClick={speak}
          disabled={!voices.length || !result?.units.some((u) => u.reading)}
        >
          <Volume2 size={17} />
          {speaking ? '停止朗讀' : '朗讀'}
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
            ? '系統朗讀僅作輔助，多音字可能與標註不同，請以顯示的拼音及來源説明為準。'
            : '當前設備尚未提供中文語音，仍可查看拼音。')}
      </output>
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
        穴名優先採用國標標音（差異見依據）；其餘文字由拼音字庫自動注音，古文和多音詞可結合上下文查字典。查詢在頁面內完成。
      </p>
    </dialog>
  );
}
