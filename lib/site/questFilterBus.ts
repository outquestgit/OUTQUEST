"use client";

/**
 * Tiny event bus for the "jump to All Quests with a preset filter" shortcuts
 * (hero goal pills, destination/goal reels). Replaces front.js's
 * filterByOutcome / filterByDestination, which poked the quests grid's DOM — now
 * that QuestsPage filters in React, the section dispatches an event and
 * QuestsPage applies it. The caller still navigates to the quests view itself.
 */
export const QUEST_FILTER_EVENT = "sq:questFilter";

export interface QuestFilterDetail {
  filter: string;
  value: string;
}

export function dispatchQuestFilter(filter: string, value: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<QuestFilterDetail>(QUEST_FILTER_EVENT, { detail: { filter, value } }));
}
