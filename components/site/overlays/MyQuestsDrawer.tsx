"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMyQuests, type MqStatus } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import {
  MQ_NEXT_MAP,
  FALLBACK_QUEST_META,
  type QuestMeta,
} from "@/lib/site/data/myQuestsNext";
import { DEFAULT_SITE_CONFIG, type GlobalCopy } from "@/lib/site/data/siteConfig";

/**
 * "My Quests" slide-over — React-owned (ported from front.js `mqRenderDrawer` +
 * the open/close/share helpers). Saved state comes from `useMyQuests`; quest
 * metadata (title/meta/art/gradient) comes from the DB-built `catalog` prop,
 * replacing front.js's hardcoded `MQ_META`. Empty/footer copy is Global Copy.
 */

const STATUSES: MqStatus[] = ["exploring", "committed", "done"];
const STATUS_LABEL: Record<MqStatus, string> = {
  exploring: "Exploring",
  committed: "Committed",
  done: "Done ✓",
};

export function MyQuestsDrawer({
  copy,
  catalog = {},
}: {
  copy?: GlobalCopy;
  catalog?: Record<string, QuestMeta>;
}) {
  const c = copy ?? DEFAULT_SITE_CONFIG.globalCopy;
  const router = useRouter();
  const { myQuestsOpen, closeMyQuests } = useOverlay();
  const { saved, savedIds, setStatus, remove, isSaved } = useMyQuests();
  const [copied, setCopied] = useState(false);

  const metaFor = (id: string): QuestMeta => catalog[id] ?? { ...FALLBACK_QUEST_META, title: id };

  const count = savedIds.length;
  const headSub = count ? `${count} quest${count === 1 ? "" : "s"} saved` : "Your saved adventures";

  const goListing = (id: string) => {
    closeMyQuests();
    router.push(`/quests/${id}`);
  };

  // "Do this next": suggestion for the most-recently-saved quest, if it isn't
  // already saved and we have metadata for it (mirrors front.js).
  const next = count ? MQ_NEXT_MAP[savedIds[0]] : undefined;
  const showNext = !!next && !isSaved(next.id) && !!catalog[next.id];
  const nextMeta = next ? metaFor(next.id) : null;

  const shareWhatsApp = () => {
    if (!count) return;
    const lines = savedIds.map((id) => {
      const m = metaFor(id);
      return m.title ? `• ${m.title} (${m.meta})` : id;
    });
    const msg = encodeURIComponent(
      `My OutQuest quest list \u{1F5FA}️\n\n${lines.join("\n")}\n\noutquest.com`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <>
      <div
        className={myQuestsOpen ? "mq-overlay open" : "mq-overlay"}
        onClick={() => closeMyQuests()}
      ></div>
      <div className={myQuestsOpen ? "mq-drawer open" : "mq-drawer"}>
        <div className="mq-head">
          <div>
            <h3>My Quests</h3>
            <div className="mq-head-sub">{headSub}</div>
          </div>
          <button className="mq-close" onClick={() => closeMyQuests()}>
            ✕
          </button>
        </div>
        <div className="mq-body">
          <div className={count ? "mq-empty" : "mq-empty show"}>
            <span className="mq-empty-icon">🗺️</span>
            <h4>{c.mqEmptyHeading}</h4>
            <p>{c.mqEmptyBody}</p>
            <button
              className="btn-orange"
              style={{ fontSize: "13px", padding: "10px 22px" }}
              onClick={() => {
                closeMyQuests();
                router.push("/quests");
              }}
            >
              {c.mqEmptyCta}
            </button>
          </div>

          {savedIds.map((id) => {
            const m = metaFor(id);
            const status = saved[id]?.status || "exploring";
            return (
              <div className="mq-item" key={id}>
                <div className="mq-item-art" style={{ background: m.gradient }}>
                  {m.art}
                </div>
                <div className="mq-item-body">
                  <div className="mq-item-title" onClick={() => goListing(id)}>
                    {m.title}
                  </div>
                  <div className="mq-item-meta">{m.meta}</div>
                  <div className="mq-item-row">
                    <div className="mq-status">
                      {STATUSES.map((s) => (
                        <button
                          className={`mq-status-btn${status === s ? ` active-${s}` : ""}`}
                          onClick={() => setStatus(id, s)}
                          key={s}
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                    <button className="mq-remove" onClick={() => remove(id)}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {showNext && nextMeta && (
            <div className="mq-next-section">
              <div className="mq-next-label">Do this next</div>
              <div className="mq-next-card" onClick={() => next && goListing(next.id)}>
                <div className="mq-next-art">{nextMeta.art}</div>
                <div className="mq-next-body">
                  <strong>{nextMeta.title}</strong>
                  <span>{next?.why}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mq-foot">
          {count > 0 && (
            <div className="mq-share-row" style={{ display: "flex" }}>
              <button className="mq-share-btn mq-share-wa" onClick={shareWhatsApp}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Share via WhatsApp
              </button>
              <button className="mq-share-btn mq-share-copy" onClick={copyLink}>
                {copied ? "Copied ✓" : "📋 Copy link"}
              </button>
            </div>
          )}
          <div className="mq-foot-cta">
            <span style={{ color: "var(--text3)", fontSize: "12px" }}>{c.mqFooter} </span>
            <button
              onClick={() => {
                closeMyQuests();
                router.push("/quests");
              }}
            >
              Browse more
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
