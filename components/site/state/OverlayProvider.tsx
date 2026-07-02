"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Global overlay state, ported from `front.js`'s open/close overlay families. Covers
 * the overlays that can appear on any route — the lead modal, the share sheet,
 * the mobile menu, and the transient toast. (The lightbox is local to the quest
 * listing page, and the My Quests drawer lives in MyQuestsProvider/its own
 * component, so neither is here.) See [[runtime-to-react-migration]] F9.
 *
 * Body scroll is locked whenever any of these overlays is open, matching the
 * runtime's `document.body.style.overflow='hidden'`.
 */

export interface LeadModalPayload {
  icon: string;
  title: string;
  desc: string;
}

interface OverlayContextValue {
  // Lead / quest modal
  leadModal: { open: boolean } & LeadModalPayload;
  openLeadModal: (payload?: Partial<LeadModalPayload>) => void;
  closeLeadModal: () => void;

  // Share sheet
  shareOpen: boolean;
  shareData: { title: string; url: string };
  openShare: (payload?: { title?: string; url?: string }) => void;
  closeShare: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // My Quests drawer (open-state only; saved data lives in MyQuestsProvider)
  myQuestsOpen: boolean;
  openMyQuests: () => void;
  closeMyQuests: () => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

const EMPTY_LEAD: LeadModalPayload = { icon: "", title: "", desc: "" };

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [leadModal, setLeadModal] = useState<{ open: boolean } & LeadModalPayload>({
    open: false,
    ...EMPTY_LEAD,
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string }>({ title: "", url: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [myQuestsOpen, setMyQuestsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openLeadModal = useCallback(
    (payload?: Partial<LeadModalPayload>) =>
      setLeadModal({
        open: true,
        icon: payload?.icon || "🗺️",
        title: payload?.title || "",
        desc: payload?.desc || "",
      }),
    []
  );
  const closeLeadModal = useCallback(() => setLeadModal((m) => ({ ...m, open: false })), []);

  const openShare = useCallback((payload?: { title?: string; url?: string }) => {
    setShareData({
      title: payload?.title || (typeof document !== "undefined" ? document.title : ""),
      url: payload?.url || (typeof window !== "undefined" ? window.location.href : ""),
    });
    setShareOpen(true);
  }, []);
  const closeShare = useCallback(() => setShareOpen(false), []);

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);

  const openMyQuests = useCallback(() => setMyQuestsOpen(true), []);
  const closeMyQuests = useCallback(() => setMyQuestsOpen(false), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200); // matches mqToast
  }, []);

  // Lock body scroll while a blocking overlay is open (mirrors front.js).
  const blocking = leadModal.open || shareOpen || mobileMenuOpen || myQuestsOpen;
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = blocking ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [blocking]);

  // Transition bridge: the vestigial SPA listing save bar (front.js-generated
  // inline HTML) still calls openShareSheet()/closeShareSheet(); route them to
  // React. Removed when front.js goes (F10).
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.openShareSheet = () => openShare();
    w.closeShareSheet = () => closeShare();
    return () => {
      delete w.openShareSheet;
      delete w.closeShareSheet;
    };
  }, [openShare, closeShare]);

  const value = useMemo<OverlayContextValue>(
    () => ({
      leadModal,
      openLeadModal,
      closeLeadModal,
      shareOpen,
      shareData,
      openShare,
      closeShare,
      mobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
      myQuestsOpen,
      openMyQuests,
      closeMyQuests,
      toast,
      showToast,
    }),
    [
      leadModal,
      openLeadModal,
      closeLeadModal,
      shareOpen,
      shareData,
      openShare,
      closeShare,
      mobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
      myQuestsOpen,
      openMyQuests,
      closeMyQuests,
      toast,
      showToast,
    ]
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used within <OverlayProvider>");
  return ctx;
}
