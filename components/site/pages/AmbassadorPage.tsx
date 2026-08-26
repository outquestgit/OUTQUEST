"use client";

import { useState, type CSSProperties } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Button } from "../ui/Button";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errStyle: CSSProperties = { color: "#d9303e", fontSize: "12px", marginTop: "4px" };

const cardStyle: CSSProperties = {
  background: "var(--white)",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  padding: "28px 24px",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--text2)",
  marginBottom: "6px",
  letterSpacing: "0.5px",
};

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  background: "var(--bg)",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
  fontFamily: "inherit",
};

const focusProps = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--orange)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  },
};

const WHO: { icon: string; title: string; body: string }[] = [
  { icon: "🧘", title: "A yoga, Pilates or wellness pro", body: "With a community of clients and students." },
  { icon: "✈️", title: "A travel enthusiast", body: "With friends who are always planning their next trip." },
  { icon: "👥", title: "A community leader", body: "Running a group, club, society or online community." },
  { icon: "🎥", title: "A creator", body: "With an audience that trusts your recommendations." },
  { icon: "💼", title: "A professional or entrepreneur", body: "With a strong network of ambitious, curious people." },
  { icon: "🎓", title: "A student or
