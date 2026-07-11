"use client";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export function ClarityProvider() {
  useEffect(() => {
    // Don't track localhost or admin routes
    const isLocal = window.location.hostname === "localhost" ||
                    window.location.hostname === "127.0.0.1";
    const isAdmin = window.location.pathname.startsWith("/admin");

    if (isLocal || isAdmin) return;

    Clarity.init("xjt81c9trl");
  }, []);
  return null;
}