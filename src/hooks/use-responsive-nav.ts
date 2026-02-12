import { useEffect, useMemo, useState, useCallback } from "react";

export type NavMode = "expanded" | "collapsed" | "hidden";
export type LayoutMode = "mobilePortrait" | "sideNav";

const STORAGE_KEY = "tecq_nav_mode_v1";

function getStoredMode(): NavMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "expanded" || v === "collapsed" || v === "hidden") return v;
  } catch {}
  return "expanded";
}

function detectEnv() {
  if (typeof window === "undefined") return { mobile: false, portrait: true, landscape: false };
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  return { mobile, portrait, landscape: !portrait };
}

export function useResponsiveNav() {
  const [navMode, setNavMode] = useState<NavMode>(getStoredMode);
  const [env, setEnv] = useState(detectEnv);

  useEffect(() => {
    const update = () => setEnv(detectEnv());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      mq.removeEventListener?.("change", update);
    };
  }, []);

  const layoutMode = useMemo<LayoutMode>(() => {
    if (env.mobile && env.portrait) return "mobilePortrait";
    return "sideNav";
  }, [env.mobile, env.portrait]);

  // Default to collapsed in mobile landscape
  useEffect(() => {
    if (env.mobile && env.landscape && navMode === "expanded") {
      setNavMode("collapsed");
    }
  }, [env.mobile, env.landscape]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, navMode); } catch {}
  }, [navMode]);

  const toggleCollapsed = useCallback(() =>
    setNavMode((m) => (m === "collapsed" ? "expanded" : "collapsed")), []);

  const toggleHidden = useCallback(() =>
    setNavMode((m) => (m === "hidden" ? "collapsed" : "hidden")), []);

  // B shortcut for desktop/landscape
  useEffect(() => {
    if (layoutMode !== "sideNav") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "b" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setNavMode((m) => (m === "hidden" ? "collapsed" : "hidden"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [layoutMode]);

  return { layoutMode, navMode, setNavMode, toggleCollapsed, toggleHidden };
}
