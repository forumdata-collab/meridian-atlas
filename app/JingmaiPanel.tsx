'use client';
import {
  channels,
  primaryChannels,
  pointById,
  type Channel,
  type Point,
} from '@/lib/atlas';
import { jingmaiStudies, jingmaiSource } from '@/lib/jingmai';
import { hasRegionalCourse } from '@/lib/course-catalog';

export default function JingmaiPanel({
  channel,
  onPoint,
  onChannel,
  onPronounce,
}: {
  channel: Channel;
  onPoint: (point: Point) => void;
  onChannel: (id: string) => void;
  onPronounce: (text: string) => void;
}) {
  const study = jingmaiStudies[channel.id];
  if (!study) return null;
  const index = primaryChannels.findIndex((c) => c.id === channel.id);
  const previous = primaryChannels[(index + 11) % 12];
  const next = channels.find((c) => c.id === study.next)!;
  const passage =
    jingmaiSource.passages[channel.id as keyof typeof jingmaiSource.passages];
  return (
    <section className="jingmai-study" aria-label="十二正經循行研習">
      <div className="section-label">經脈循行 · 《靈樞》</div>
      <p className="jingmai-origin">
        起於<strong>{study.origin}</strong>
      </p>
      <div className="jingmai-organ">
        <span>屬 · {study.belonging}</span>
        <span>絡 · {study.connection}</span>
      </div>
      <details className="jingmai-sections">
        <summary>查看體內經過與分支</summary>
        <p className="micro-note">
          以下按《經脈第十》整理；參照穴便於聯繫體表位置，並非把體內經過改成穴位連線。
          {hasRegionalCourse(channel.id)
            ? '本經可打開圖譜下方“體內經過”開關查看三維區域與分支示意。'
            : '當前三維光流仍為體表穴序示意。'}
        </p>
        <ol>
          {study.sections.map((section) => (
            <li key={section.label}>
              <h3>{section.label}</h3>
              <p>{section.summary}</p>
              {section.pointIds.length > 0 && (
                <div className="jingmai-landmarks">
                  <small>體表參照穴</small>
                  {section.pointIds.map((id) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => onPoint(pointById[id])}
                    >
                      {pointById[id].name}
                      <span>{id}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
        {study.note && <p className="jingmai-editorial">{study.note}</p>}
        <div className="jingmai-junction">
          <strong>與下一經的聯繫</strong>
          <p>{study.junction}</p>
          <small>
            按相鄰經脈的末段、支脈和起段作學習比照；不表示按鐘點才發生器官之間的生理血流交接。
          </small>
        </div>
        <details className="jingmai-original">
          <summary>對照循行原文</summary>
          <p>{passage}</p>
          <button
            type="button"
            className="pronunciation-trigger"
            onClick={() => onPronounce(passage)}
          >
            循行原文注音
          </button>
          <p className="micro-note">{jingmaiSource.scope}</p>
        </details>
        <a
          className="text-link"
          href={jingmaiSource.url}
          target="_blank"
          rel="noreferrer"
        >
          《靈樞·經脈第十》固定版本 ↗
        </a>
      </details>
      <div className="jingmai-neighbours">
        <button type="button" onClick={() => onChannel(previous.id)}>
          ← 前一經 · {previous.short}
        </button>
        <button type="button" onClick={() => onChannel(next.id)}>
          下一經 · {next.short} →
        </button>
      </div>
    </section>
  );
}
