/**
 * "Do this next" suggestions for the My Quests drawer, ported verbatim from
 * front.js's `MQ_NEXT_MAP`. Keyed by quest slug → the suggested next quest's
 * slug + the reason copy. Editorial data with no DB equivalent, so it stays a
 * static map (only the original eight quest slugs have a suggestion; others
 * simply show no "next" card, exactly as before).
 */
export interface MqNext {
  id: string;
  why: string;
}

export const MQ_NEXT_MAP: Record<string, MqNext> = {
  japan: { id: "freelance", why: "A ski season proves you can live anywhere." },
  bali: { id: "bangkok", why: "Bangkok is the natural next base after Bali." },
  bangkok: { id: "lisbon", why: "Bangkok is the gateway. Lisbon is the upgrade." },
  lisbon: { id: "freelance", why: "Lisbon is best when income follows you." },
  france: { id: "japan", why: "France in autumn, Japan in winter." },
  moto: { id: "france", why: "After Europe by bike, the harvest is next." },
  housesit: { id: "bali", why: "House sitting proves the lifestyle. Bali is next." },
  freelance: { id: "bangkok", why: "Once freelance, Bangkok becomes obvious." },
};

/** Metadata a saved quest needs to render in the drawer / next card. */
export interface QuestMeta {
  title: string;
  meta: string;
  art: string;
  gradient: string;
}

/** Fallback when a saved slug isn't in the published catalog (mirrors front.js). */
export const FALLBACK_QUEST_META: QuestMeta = {
  title: "",
  meta: "",
  art: "🌍",
  gradient: "linear-gradient(135deg,#1A1A2A,#2A2A4A)",
};
