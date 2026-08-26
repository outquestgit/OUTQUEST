"use client";

import { useState, type CSSProperties } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Button } from "../ui/Button";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errStyle: CSSProperties = { color: "#d9303e", fontSize: "12px", marginTop: "4px" };

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
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--orange)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  },
};

const sectionHeading: CSSProperties = {
  fontFamily: "var(--serif)",
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.1,
  fontSize: "clamp(30px, 4vw, 46px)",
  marginBottom: "16px",
};

const STRIP: { emoji: string; tag: string; title: string; desc: string }[] = [
  { emoji: "✈️", tag: "WORK ABROAD", title: "Work Abroad", desc: "Jobs, seasonal work & international opportunities." },
  { emoji: "🌍", tag: "MOVE ABROAD", title: "Move Abroad", desc: "Cities, relocation & life overseas." },
  { emoji: "🎓", tag: "GET CERTIFIED", title: "Get Certified", desc: "Credentials, courses & career-changing skills." },
  { emoji: "🚀", tag: "BUILD SOMETHING", title: "Build Something", desc: "Business ideas, income streams & entrepreneurship." },
];

const WHO: { photo: string; label: string; rotate: number; title: string; hook: string; body: string }[] = [
  {
    photo: "/ambassador/who%20community.jpg",
    label: "Community",
    rotate: -3,
    title: "Community Leaders",
    hook: "You bring people together.",
    body: "You run a community, club, membership, group, event series or online space — and people actually listen when you share something.",
  },
  {
    photo: "/ambassador/who%20wellness.jpg",
    label: "Wellness",
    rotate: 2,
    title: "Wellness & Fitness Pros",
    hook: "Your clients already trust your recommendations.",
    body: "You're a yoga teacher, Pilates instructor, trainer, coach, wellness practitioner or fitness professional with a community around you.",
  },
  {
    photo: "/ambassador/who%20travel.jpg",
    label: "Travel",
    rotate: -2,
    title: "Travel Connectors",
    hook: "You're the person people ask where to go.",
    body: "You travel often, organise trips, know interesting places or naturally become the person friends turn to for ideas.",
  },
  {
    photo: "/ambassador/who%20creators.jpg",
    label: "Creators",
    rotate: 3,
    title: "Creators & Curators",
    hook: "You know what's worth discovering.",
    body: "You create content, run a newsletter, curate recommendations or have built an audience around interesting places, people, ideas or experiences.",
  },
  {
    photo: "/ambassador/who%20coaches.jpg",
    label: "Coaches",
    rotate: -2,
    title: "Coaches & Mentors",
    hook: "People come to you when they're figuring out what's next.",
    body: "You help people make decisions, change direction, build confidence or navigate their next chapter.",
  },
  {
    photo: "/ambassador/who%20students.jpg",
    label: "Students",
    rotate: 2,
    title: "Students & Campus Leaders",
    hook: "You're already at the center of a campus network.",
    body: "You lead a club, society, student org or peer group — and your recommendations carry weight with people figuring out what's next.",
  },
];

const WHY: { icon: string; title: string; body: string }[] = [
  {
    icon: "💸",
    title: "Earn US$500 per successful referral",
    body: "Recommend an OutQuest experience to the right person. When they join and qualify, you
