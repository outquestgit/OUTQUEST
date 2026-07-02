"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useOverlay } from "./OverlayProvider";

/**
 * Saved-quests state, ported from `front.js`'s `mq*` family. The single source
 * of truth is `localStorage["sq_my_quests"]` (key preserved for back-compat),
 * shaped exactly as the runtime wrote it: `{ [slug]: { status, savedAt } }`.
 *
 * This provider owns only the saved map + mutations. Quest *metadata* (title,
 * meta, art, gradient) for rendering the drawer/cards comes from the DB-loaded
 * quest list at the page level, not from here — replacing front.js's hardcoded
 * `MQ_META`. See [[runtime-to-react-migration]] phase F7.
 */

export type MqStatus = "exploring" | "committed" | "done";
export interface MqEntry {
  status: MqStatus;
  savedAt: number;
}
export type MqMap = Record<string, MqEntry>;

const STORAGE_KEY = "sq_my_quests";

function readStore(): MqMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as MqMap;
  } catch {
    return {};
  }
}

function writeStore(d: MqMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    /* quota / private mode — ignore, mirrors front.js */
  }
}

interface MyQuestsContextValue {
  /** The saved map. Empty until hydrated on the client (avoids SSR mismatch). */
  saved: MqMap;
  /** Saved slugs, newest-first (mirrors mqRenderDrawer's sort by savedAt desc). */
  savedIds: string[];
  count: number;
  isSaved: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  /** Toggle save; returns the new saved state (true = now saved). */
  toggle: (id: string) => boolean;
  setStatus: (id: string, status: MqStatus) => void;
  /** Save every slug in the list that isn't already saved (quiz "save all"). */
  saveAll: (ids: string[]) => void;
}

const MyQuestsContext = createContext<MyQuestsContextValue | null>(null);

export function MyQuestsProvider({ children }: { children: ReactNode }) {
  const { showToast, openMyQuests, closeMyQuests } = useOverlay();

  // Start empty on the server and first client render; hydrate from storage in
  // an effect so server and client markup match.
  const [saved, setSaved] = useState<MqMap>({});

  const refresh = useCallback(() => setSaved(readStore()), []);

  useEffect(() => {
    refresh();
    // Keep multiple tabs / components in sync, and re-read on focus to catch any
    // same-tab writes from not-yet-ported front.js surfaces during migration.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  // Persist + update state together so every consumer re-renders (this replaces
  // front.js's manual mqUpdateNavBadge/mqSyncButtons DOM pokes).
  const commit = useCallback((next: MqMap) => {
    writeStore(next);
    setSaved(next);
  }, []);

  const add = useCallback(
    (id: string) =>
      commit({
        ...readStore(),
        ...(readStore()[id] ? {} : { [id]: { status: "exploring", savedAt: Date.now() } }),
      }),
    [commit]
  );

  const remove = useCallback(
    (id: string) => {
      const d = { ...readStore() };
      delete d[id];
      commit(d);
    },
    [commit]
  );

  const toggle = useCallback(
    (id: string) => {
      const d = readStore();
      if (d[id]) {
        const next = { ...d };
        delete next[id];
        commit(next);
        return false;
      }
      commit({ ...d, [id]: { status: "exploring", savedAt: Date.now() } });
      return true;
    },
    [commit]
  );

  const setStatus = useCallback(
    (id: string, status: MqStatus) => {
      const d = readStore();
      if (!d[id]) return;
      commit({ ...d, [id]: { ...d[id], status } });
    },
    [commit]
  );

  const saveAll = useCallback(
    (ids: string[]) => {
      const d = { ...readStore() };
      const now = Date.now();
      ids.forEach((id) => {
        if (!d[id]) d[id] = { status: "exploring", savedAt: now };
      });
      commit(d);
    },
    [commit]
  );

  // Transition bridge: reclaim the global functions that front.js-generated
  // inline `onclick` HTML still calls (the vestigial SPA listing save bar, the
  // quiz "save all" button) so those writes flow through React state — instant
  // and in-sync. front.js's own *lexical* calls are untouched; they just read
  // the same localStorage. All of this disappears when front.js is deleted (F10).
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.openMQDrawer = () => openMyQuests();
    w.closeMQDrawer = () => closeMyQuests();
    w.mqToggleSaveFromListing = (id: string) => {
      if (toggle(id)) showToast("🔖 Saved to My Quests");
    };
    w.mqSaveAllQuizPaths = () => {
      const ids: string[] = ((window as unknown as { _lastQuizPaths?: string[] })._lastQuizPaths) || [];
      saveAll(ids);
    };
    return () => {
      delete w.openMQDrawer;
      delete w.closeMQDrawer;
      delete w.mqToggleSaveFromListing;
      delete w.mqSaveAllQuizPaths;
    };
  }, [openMyQuests, closeMyQuests, toggle, saveAll, showToast]);

  const savedIds = useMemo(
    () => Object.keys(saved).sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0)),
    [saved]
  );

  const value = useMemo<MyQuestsContextValue>(
    () => ({
      saved,
      savedIds,
      count: savedIds.length,
      isSaved: (id) => !!saved[id],
      add,
      remove,
      toggle,
      setStatus,
      saveAll,
    }),
    [saved, savedIds, add, remove, toggle, setStatus, saveAll]
  );

  return <MyQuestsContext.Provider value={value}>{children}</MyQuestsContext.Provider>;
}

export function useMyQuests(): MyQuestsContextValue {
  const ctx = useContext(MyQuestsContext);
  if (!ctx) throw new Error("useMyQuests must be used within <MyQuestsProvider>");
  return ctx;
}
