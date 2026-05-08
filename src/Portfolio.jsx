import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   SVG ICON COMPONENTS  (no lucide-react needed — zero dependencies)
───────────────────────────────────────────────────────────────── */
const IconLinkedin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   GLOBAL CSS - FULLY RESPONSIVE
───────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F5F0E8;
    --obsidian: #0A0A0F;
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: rgba(201,168,76,0.15);
    --warm-gray: #8B8680;
    --charcoal: #1A1A24;
    --border: rgba(201,168,76,0.22);
    --font-display: 'Cormorant Garamond', serif;
    --font-mono: 'DM Mono', monospace;
    --font-sans: 'Syne', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--obsidian);
    color: var(--cream);
    font-family: var(--font-sans);
    cursor: none !important;
    overflow-x: hidden;
    line-height: 1.6;
  }
  * { cursor: none !important; }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--obsidian); }
  ::-webkit-scrollbar-thumb { background: var(--gold); }

  /* ── LOADER ── */
  .loader {
    position: fixed; inset: 0;
    background: var(--obsidian);
    z-index: 9999;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 2rem;
  }
  .loader-name {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 8vw, 3.5rem);
    font-weight: 300;
    letter-spacing: 0.3em;
    color: var(--cream);
    display: flex; gap: 0.4em;
    flex-wrap: wrap;
    justify-content: center;
  }
  .loader-name span {
    display: inline-block;
    transform: translateY(110%);
    opacity: 0;
    animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .loader-name span:nth-child(1) { animation-delay: 0.05s; }
  .loader-name span:nth-child(2) { animation-delay: 0.2s;  color: var(--gold); }
  .loader-name span:nth-child(3) { animation-delay: 0.35s; }
  .loader-bar-wrap {
    width: min(400px, 80vw); height: 1px;
    background: rgba(255,255,255,0.08);
    position: relative; overflow: hidden;
  }
  .loader-bar {
    position: absolute; left: 0; top: 0; height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    animation: loadBar 2.2s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  .loader-pct {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--gold);
    letter-spacing: 0.12em;
  }
  @keyframes loadBar { from { width: 0 } to { width: 100% } }
  @keyframes slideUp  { to { transform: translateY(0); opacity: 1; } }

  /* ── CURSOR ── */
  .cursor-dot {
    position: fixed; top: 0; left: 0;
    width: 8px; height: 8px;
    background: var(--gold);
    border-radius: 50%;
    pointer-events: none; z-index: 10000;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1px solid rgba(201,168,76,0.6);
    border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, border-color 0.3s;
  }
  .cursor-dot.hovered { width: 12px; height: 12px; background: var(--gold-light); }
  .cursor-ring.hovered { width: 56px; height: 56px; border-color: var(--gold-light); }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 5vw, 4rem);
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid transparent;
    transition: border-color 0.4s, background 0.4s;
    backdrop-filter: blur(10px);
  }
  .nav.scrolled {
    border-color: var(--border);
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(20px);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 2.5vw, 1.3rem); font-weight: 600;
    color: var(--gold); letter-spacing: 0.05em;
    text-decoration: none;
  }
  .nav-links { 
    display: flex; gap: clamp(1.5rem, 3vw, 2.5rem); 
    list-style: none; 
  }
  .nav-links a {
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1vw, 0.68rem); 
    letter-spacing: 0.15em;
    color: var(--warm-gray); text-decoration: none;
    text-transform: uppercase; 
    transition: color 0.3s;
    position: relative;
    white-space: nowrap;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: var(--gold); transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--cream); }
  .nav-links a:hover::after { width: 100%; }
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    padding: 4px;
  }
  .nav-hamburger span {
    width: 24px; height: 2px;
    background: var(--gold);
    transition: 0.3s;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 8vw, 4rem) clamp(2rem, 5vw, 4rem);
    gap: clamp(2rem, 6vw, 4rem);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; top: -50%; left: -20%;
    width: 80%; height: 80%;
    background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-text { position: relative; z-index: 1; }
  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1vw, 0.68rem); 
    letter-spacing: 0.25em;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 2rem; overflow: hidden;
  }
  .hero-eyebrow span { display: block; }
  .hero-name {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 7vw, 6.5rem);
    font-weight: 300; line-height: 1;
    color: var(--cream); margin-bottom: 1.5rem;
  }
  .hero-name em { font-style: italic; color: var(--gold); }
  .line-wrap { overflow: hidden; }
  .line-inner { display: block; }
  .hero-sub {
    font-size: clamp(0.85rem, 1.5vw, 0.95rem); 
    color: var(--warm-gray);
    line-height: 1.8; max-width: 42ch;
    margin-bottom: 2.5rem; overflow: hidden;
  }
  .hero-cta-row { 
    display: flex; gap: 1rem; align-items: center; 
    flex-wrap: wrap; 
  }

  .btn-primary {
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1vw, 0.68rem); 
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.9rem 2rem;
    background: var(--gold); color: var(--obsidian);
    border: 1px solid var(--gold); text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: all 0.3s; font-weight: 500;
  }
  .btn-primary:hover { 
    background: transparent; color: var(--gold);
    transform: translateY(-2px);
  }

  .btn-ghost {
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1vw, 0.68rem);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.9rem 2rem;
    background: transparent; color: var(--warm-gray);
    border: 1px solid var(--border); text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: all 0.3s;
  }
  .btn-ghost:hover { 
    border-color: var(--gold); color: var(--cream);
    transform: translateY(-2px);
  }

  /* ── PHOTO & FLOATING CARD ── */
  .hero-photo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .photo-container {
    position: relative;
    width: min(320px, 35vw);
    aspect-ratio: 4/7;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  }
  .photo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s;
  }
  .photo-container:hover img {
    transform: scale(1.05);
  }
  .photo-frame {
    position: absolute;
    inset: 0;
    border: 2px solid var(--border);
    border-radius: 8px;
    z-index: 1;
    transition: border-color 0.4s;
  }
  .photo-container:hover .photo-frame {
    border-color: var(--gold);
    box-shadow: 0 0 40px rgba(201,168,76,0.2);
  }
  .floating-card {
    background: var(--charcoal);
    border: 1px solid var(--border);
    padding: clamp(1.5rem, 4vw, 2.5rem);
    position: relative;
    animation: floatCard 4s ease-in-out infinite;
    box-shadow: 0 0 60px rgba(201,168,76,0.08), 0 30px 60px rgba(0,0,0,0.4);
    max-width: 320px;
  }
  .floating-card::before {
    content: '';
    position: absolute; inset: -1px;
    background: linear-gradient(135deg, rgba(201,168,76,0.3), transparent 60%);
    z-index: -1;
    border-radius: inherit;
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-16px); }
  }
  .fc-label {
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1vw, 0.58rem); 
    letter-spacing: 0.2em;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .fc-name {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 3vw, 2rem); 
    font-weight: 300; margin-bottom: 0.5rem;
  }
  .fc-role {
    font-size: clamp(0.7rem, 1.2vw, 0.78rem); 
    color: var(--warm-gray);
    margin-bottom: 2rem; line-height: 1.6;
  }
  .fc-contacts { 
    display: flex; flex-direction: column; gap: 0.6rem; 
    margin-bottom: 2rem; 
  }
  .fc-contact-item {
    font-family: var(--font-mono);
    font-size: clamp(0.55rem, 1vw, 0.63rem); 
    color: var(--warm-gray);
    display: flex; align-items: center; gap: 0.6rem;
    letter-spacing: 0.04em;
  }
  .fc-contact-item .dot {
    width: 4px; height: 4px;
    border-radius: 50%; background: var(--gold); flex-shrink: 0;
  }
  .discipline-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--gold-dim); border: 1px solid var(--border);
    padding: 0.5rem 1rem;
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1vw, 0.58rem); 
    letter-spacing: 0.1em;
    color: var(--gold); text-transform: uppercase;
  }
  .fc-socials { 
    display: flex; gap: 0.6rem; margin-top: 1.5rem; 
  }
  .social-btn {
    width: clamp(34px, 6vw, 38px); 
    height: clamp(34px, 6vw, 38px);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--warm-gray); text-decoration: none;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .social-btn:hover { 
    border-color: var(--gold); color: var(--gold); 
    background: var(--gold-dim);
    transform: translateY(-2px);
  }

  /* ── TICKER ── */
  .ticker-wrap {
    overflow: hidden;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: clamp(1rem, 2vw, 1.2rem) 0;
    background: linear-gradient(90deg, var(--charcoal), var(--obsidian));
  }
  .ticker-track {
    display: flex; width: max-content;
    animation: ticker 32s linear infinite;
  }
  .ticker-item {
    display: flex; align-items: center; gap: 2rem;
    padding: 0 clamp(1rem, 3vw, 2rem); white-space: nowrap;
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1vw, 0.68rem); 
    letter-spacing: 0.15em;
    color: var(--warm-gray); text-transform: uppercase;
  }
  .ticker-sep { color: var(--gold); font-size: 0.8em; }
  @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }

  /* ── SECTION COMMON ── */
  .section { 
    padding: clamp(4rem, 8vw, 6rem) clamp(2rem, 8vw, 4rem); 
  }
  .section-header { margin-bottom: clamp(2rem, 5vw, 4rem); text-align: center; }
  .section-index {
    font-family: var(--font-mono);
    font-size: clamp(0.55rem, 1vw, 0.62rem); 
    color: var(--gold);
    letter-spacing: 0.22em; text-transform: uppercase; 
    margin-bottom: 0.75rem;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 300; line-height: 1.1; color: var(--cream);
    max-width: 800px;
    margin: 0 auto;
  }
  .section-title em { font-style: italic; color: var(--gold); }
  .divider {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin: 1.5rem auto 0;
  }

  /* ── SKILLS ── */
  .skills-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: clamp(2rem, 5vw, 3rem); 
  }
  .skill-group-title {
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1vw, 0.58rem); 
    letter-spacing: 0.22em;
    color: var(--gold); text-transform: uppercase; 
    margin-bottom: 1.5rem;
  }
  .skill-row { margin-bottom: 1.5rem; }
  .skill-label-row {
    display: flex; justify-content: space-between;
    font-size: clamp(0.65rem, 1.2vw, 0.74rem); 
    color: var(--cream);
    margin-bottom: 0.5rem; font-family: var(--font-mono);
  }
  .skill-pct { color: var(--gold); }
  .skill-track {
    height: 2px; background: rgba(255,255,255,0.07);
    position: relative; overflow: hidden;
  }
  .skill-fill {
    position: absolute; left: 0; top: 0; height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    width: 0; transition: width 1.3s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── METRICS ── */
  .metrics-row {
    display: grid; 
    grid-template-columns: repeat(3,1fr);
    gap: 2px; 
    margin-top: clamp(3rem, 6vw, 4rem); 
    border: 1px solid var(--border);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .metric-box {
    padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2rem);
    border-right: 1px solid var(--border);
    background: var(--charcoal); text-align: center;
    transition: all 0.3s;
  }
  .metric-box:hover {
    background: rgba(201,168,76,0.05);
  }
  .metric-box:last-child { border-right: none; }
  .metric-num {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 3.5rem); 
    font-weight: 300;
    color: var(--gold); line-height: 1; display: block;
  }
  .metric-label {
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1vw, 0.58rem); 
    color: var(--warm-gray);
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-top: 0.5rem; display: block;
  }

  /* ── PROJECT CARD ── */
  .project-card {
    background: var(--charcoal);
    border: 1px solid var(--border);
    overflow: hidden;
    opacity: 0; transform: translateY(32px);
    transition: all 0.4s;
    max-width: 1000px;
    margin: 0 auto;
  }
  .project-card.visible {
    opacity: 1; transform: translateY(0);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1),
                border-color 0.4s, box-shadow 0.4s;
  }
  .project-card:hover {
    border-color: var(--gold);
    box-shadow: 0 0 40px rgba(201,168,76,0.12), 0 20px 40px rgba(0,0,0,0.3);
  }
  .project-header { padding: clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem) 0; }
  .project-tag {
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1vw, 0.58rem); 
    letter-spacing: 0.15em;
    color: var(--gold); text-transform: uppercase;
    background: var(--gold-dim); border: 1px solid var(--border);
    padding: 0.25rem 0.6rem; display: inline-block; margin-bottom: 1rem;
  }
  .project-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.2rem); 
    font-weight: 300;
    color: var(--cream); margin-bottom: 0.75rem; line-height: 1.1;
  }
  .project-sub {
    font-size: clamp(0.75rem, 1.3vw, 0.8rem); 
    color: var(--warm-gray);
    line-height: 1.75; margin-bottom: 1.5rem;
  }

  /* ── VIDEO ── */
  .video-wrap {
    margin: 0 clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem);
    border: 1px solid var(--border);
    overflow: hidden;
    background: #000;
    border-radius: 8px;
  }
  .video-wrap video { 
    width: 100%; 
    display: block; 
    border-radius: 6px;
  }

  /* ── ARCH GRID ── */
  .arch-grid {
    display: grid; 
    grid-template-columns: repeat(2,1fr);
    gap: 1px; 
    background: var(--border);
    margin: 0 clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem); 
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .arch-item { 
    background: var(--obsidian); 
    padding: clamp(1rem, 2vw, 1.25rem); 
  }
  .arch-layer {
    font-family: var(--font-mono);
    font-size: clamp(0.48rem, 0.9vw, 0.54rem); 
    letter-spacing: 0.2em;
    color: var(--gold); text-transform: uppercase; 
    margin-bottom: 0.4rem;
  }
  .arch-tech { 
    font-size: clamp(0.7rem, 1.2vw, 0.8rem); 
    color: var(--cream); line-height: 1.5; 
  }

  /* ── CHALLENGES ── */
  .challenge-list { 
    padding: 0 clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem); 
  }
  .challenge-item {
    border-left: 2px solid var(--border);
    padding-left: 1.5rem; margin-bottom: 1.5rem;
    transition: border-color 0.3s;
  }
  .challenge-item:hover { border-color: var(--gold); }
  .ch-title {
    font-family: var(--font-sans);
    font-size: clamp(0.75rem, 1.2vw, 0.82rem); 
    font-weight: 600;
    color: var(--cream); margin-bottom: 0.4rem; 
    letter-spacing: 0.04em;
  }
  .ch-desc { 
    font-size: clamp(0.7rem, 1.1vw, 0.76rem); 
    color: var(--warm-gray); line-height: 1.75; 
  }

  /* ── OUTCOMES ── */
  .outcome-list {
    padding: clamp(1rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem);
    display: flex; flex-wrap: wrap; gap: 0.6rem;
  }
  .outcome-tag {
    font-family: var(--font-mono);
    font-size: clamp(0.55rem, 0.9vw, 0.6rem); 
    letter-spacing: 0.1em;
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--border);
    color: var(--warm-gray); text-transform: uppercase;
    transition: all 0.3s;
    white-space: nowrap;
  }
  .outcome-tag:hover { 
    border-color: var(--gold); color: var(--gold);
    transform: translateY(-2px);
  }

  /* ── TIMELINE ── */
  .timeline { 
    position: relative; 
    padding-left: clamp(2rem, 4vw, 2rem); 
    max-width: 600px;
    margin: 0 auto;
  }
  .timeline::before {
    content: ''; 
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 1px; background: linear-gradient(180deg, var(--gold), transparent);
  }
  .timeline-item {
    position: relative; padding: 0 0 3rem 2rem;
    opacity: 0; transform: translateX(-18px);
  }
  .timeline-item.visible {
    opacity: 1; transform: translateX(0);
  }
  .timeline-dot {
    position: absolute; left: -2.38rem; top: 0.35rem;
    width: 8px; height: 8px;
    border: 1px solid var(--gold); border-radius: 50%;
    background: var(--obsidian);
  }
  .tl-date {
    font-family: var(--font-mono);
    font-size: clamp(0.52rem, 0.9vw, 0.58rem); 
    letter-spacing: 0.15em;
    color: var(--gold); text-transform: uppercase; 
    margin-bottom: 0.5rem;
  }
  .tl-title {
    font-family: var(--font-display);
    font-size: clamp(1.2rem, 2vw, 1.45rem); 
    font-weight: 300;
    color: var(--cream); margin-bottom: 0.25rem;
  }
  .tl-org {
    font-size: clamp(0.68rem, 1.1vw, 0.74rem); 
    color: var(--warm-gray);
    margin-bottom: 0.75rem; font-family: var(--font-mono);
    letter-spacing: 0.03em;
  }
  .tl-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tl-badge {
    font-family: var(--font-mono);
    font-size: clamp(0.48rem, 0.85vw, 0.54rem); 
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--border);
    color: var(--warm-gray); letter-spacing: 0.1em; 
    text-transform: uppercase;
  }
  .tl-badge.gold { 
    border-color: var(--gold); color: var(--gold); 
    background: var(--gold-dim); 
  }

  /* ── FOOTER ── */
  .footer {
    padding: clamp(2.5rem, 6vw, 3.5rem) clamp(2rem, 8vw, 4rem);
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1.5rem;
  }
  .footer-copy {
    font-family: var(--font-mono);
    font-size: clamp(0.55rem, 1vw, 0.6rem); 
    color: var(--warm-gray); letter-spacing: 0.1em;
  }
  .footer-email {
    font-family: var(--font-display);
    font-size: clamp(1rem, 1.8vw, 1.1rem); 
    color: var(--gold);
    text-decoration: none; font-weight: 300;
    letter-spacing: 0.04em; transition: all 0.3s;
  }
  .footer-email:hover { 
    color: var(--gold-light);
    transform: translateY(-2px);
  }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (max-width: 1100px) {
    .hero { grid-template-columns: 1fr; text-align: center; }
    .hero-photo { order: -1; }
    .hero-text { order: 1; }
  }

  @media (max-width: 900px) {
    .skills-grid { grid-template-columns: 1fr; }
    .metrics-row { grid-template-columns: 1fr 1fr; }
    .section { padding: clamp(3rem, 6vw, 4rem) clamp(1.5rem, 6vw, 2rem); }
    .nav { padding: clamp(1rem, 3vw, 1.25rem) clamp(1.5rem, 5vw, 2rem); }
    .footer { padding: clamp(2rem, 5vw, 2.5rem) clamp(1.5rem, 6vw, 2rem); flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
    .nav-links { display: none; }
    .nav-hamburger { display: flex; }
    .arch-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 600px) {
    .metrics-row { grid-template-columns: 1fr; }
    .metric-box { 
      border-right: none; 
      border-bottom: 1px solid var(--border); 
    }
    .metric-box:last-child { border-bottom: none; }
    .hero-cta-row { justify-content: center; }
    .hero-name { font-size: clamp(2rem, 8vw, 4rem); }
    .photo-container { width: min(280px, 85vw); }
  }

  @media (max-width: 480px) {
    .ticker-item { gap: 1rem; padding: 0 1rem; }
    .project-header { padding: 1.5rem 1.5rem 0; }
    .challenge-list, .outcome-list, .video-wrap, .arch-grid { 
      margin-left: 0; margin-right: 0; 
    }
    .timeline { padding-left: 1.5rem; }
  }

  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .cursor-dot { width: 10px; height: 10px; }
    .cursor-ring { width: 44px; height: 44px; }
  }
`;

/* ─────────────────────────────────────────────────────────────────
   DATA (unchanged)
───────────────────────────────────────────────────────────────── */
const SKILLS = {
  "Languages & Frameworks": [
    { name: "Python",                   pct: 88 },
    { name: "JavaScript / HTML / CSS",  pct: 85 },
    { name: "Flask & SQLAlchemy",       pct: 80 },
    { name: "Bootstrap 5",              pct: 82 },
  ],
  "AI, Data & Tools": [
    { name: "Google Gemini AI / LLMs",  pct: 78 },
    { name: "Tesseract OCR",            pct: 75 },
    { name: "Selenium WebDriver",       pct: 80 },
    { name: "Git & GitHub",             pct: 85 },
  ],
};

const TICKER_ITEMS = [
  "Python","Flask","JavaScript","React","Bootstrap 5","SQLAlchemy",
  "Selenium","Tesseract OCR","Google Gemini AI","Git","HTML5","CSS3",
  "SQLite","REST APIs","Web Scraping","LLMs","Data Analysis","UI/UX",
];

const TIMELINE = [
  {
    date: "2024 – Present",
    title: "B.Sc. Information Technology",
    org: "Thakur College of Science & Commerce, Mumbai",
    badges: [{ label: "TYBSc IT", gold: true }],
  },
  {
    date: "2025",
    title: "Infosys Springboard Virtual Internship 6.0",
    org: "Infosys | Web Application Development",
    badges: [
      { label: "Compario — AI Price Comparison", gold: true },
      { label: "Full-Stack", gold: true },
    ],
  },
  {
    date: "2025",
    title: "IIT Bombay Techfest",
    org: "LLM using Python & GPT Certification",
    badges: [{ label: "LLM · Python · GPT", gold: true }],
  },
  {
    date: "2025",
    title: "ISRO (IIRS) Certification",
    org: "Recent Trends in Ecological Modelling & Simulation",
    badges: [
      { label: "Grade: A+", gold: true },
      { label: "100% Attendance", gold: false },
    ],
  },
  {
    date: "2026",
    title: "Gita Diploma",
    org: "Completed under Madhusudana Visnu Das",
    badges: [{ label: "Philosophy & Discipline", gold: true }],
  },
];

/* ─────────────────────────────────────────────────────────────────
   HOOKS (unchanged)
───────────────────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, active, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────────
   SUB-COMPONENTS (unchanged except hamburger menu)
───────────────────────────────────────────────────────────────── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };
    const onOver = (e) => {
      const over = e.target.closest("a,button,[data-hover]");
      dotRef.current?.classList.toggle("hovered", !!over);
      ringRef.current?.classList.toggle("hovered", !!over);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top  = ring.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur   = 2200;
    const id = setInterval(() => {
      const p = Math.min(Math.floor(((Date.now() - start) / dur) * 100), 100);
      setPct(p);
      if (p >= 100) { clearInterval(id); setTimeout(onDone, 300); }
    }, 18);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="loader">
      <div className="loader-name">
        <span>Shreya</span>
        <span>Singh</span>
      </div>
      <div className="loader-bar-wrap"><div className="loader-bar" /></div>
      <div className="loader-pct">{String(pct).padStart(3, "0")} %</div>
    </div>
  );
}

function Nav({ scrolled }) {
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a className="nav-logo" href="#hero">SS</a>
      <ul className="nav-links">
        {[["#about","Profile"],["#project","Work"],["#skills","Skills"],["#education","Education"]].map(([href, label]) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
      <div className="nav-hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

function SkillBar({ name, pct, visible }) {
  return (
    <div className="skill-row">
      <div className="skill-label-row">
        <span>{name}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: visible ? `${pct}%` : "0%" }} />
      </div>
    </div>
  );
}

function MetricCounter({ target, suffix = "", label }) {
  const [ref, visible] = useScrollReveal(0.2);
  const count = useCounter(target, visible);
  return (
    <div className="metric-box" ref={ref}>
      <span className="metric-num">{count}{suffix}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

function TimelineItem({ item, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div
      className={`timeline-item${visible ? " visible" : ""}`}
      ref={ref}
      style={visible
        ? { transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s cubic-bezier(0.16,1,0.3,1)` }
        : {}}
    >
      <div className="timeline-dot" />
      <div className="tl-date">{item.date}</div>
      <div className="tl-title">{item.title}</div>
      <div className="tl-org">{item.org}</div>
      <div className="tl-badges">
        {item.badges.map((b, i) => (
          <span key={i} className={`tl-badge${b.gold ? " gold" : ""}`}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT - UPGRADED WITH PHOTO
───────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [loaded,      setLoaded]      = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [skillsRef,   skillsVisible]  = useScrollReveal(0.2);
  const [projRef,     projVisible]    = useScrollReveal(0.1);

  const handleDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (loaded) setTimeout(() => setHeroVisible(true), 80);
  }, [loaded]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* staggered hero line animation */
  const ls = (i) =>
    heroVisible
      ? { transform: "translateY(0)", opacity: 1,
          transition: `transform 0.9s ${0.08 + i * 0.12}s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ${0.08 + i * 0.12}s` }
      : { transform: "translateY(110%)", opacity: 0 };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ── LOADER ── */}
      {!loaded && <Loader onDone={handleDone} />}

      {/* ── CURSOR ── */}
      <Cursor />

      {/* ── NAV ── */}
      <Nav scrolled={scrolled} />

      {/* ════════════════════════════════════════
          HERO WITH PHOTO
      ════════════════════════════════════════ */}
      <section className="hero" id="hero">

        {/* Left: text */}
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span style={ls(0)}>Portfolio · 2026</span>
          </div>
          <h1 className="hero-name">
            <div className="line-wrap"><div className="line-inner" style={ls(1)}>Shreya</div></div>
            <div className="line-wrap"><div className="line-inner" style={ls(3)}>Singh</div></div>
          </h1>
          <div className="hero-sub">
            <span style={ls(4)}>
              Third Year BSc IT Student at Thakur College of Science &amp; Commerce, Mumbai.
              Building intelligent systems at the intersection of AI, full-stack engineering, and purposeful design.
            </span>
          </div>
          <div className="hero-cta-row" style={ls(5)}>
            <a className="btn-primary" href="#project" data-hover>View Work ↓</a>
            <a className="btn-ghost"   href="mailto:shreyasinghxvii@gmail.com" data-hover>Get in Touch</a>
          </div>
        </div>

        {/* Right: Photo + Identity Card */}
        <div className="hero-photo">
          {/* Professional Photo */}
          <div className="photo-container">
            <div className="photo-frame"></div>
            <img 
              src="/profile.jpg" 
              alt="Shreya Singh - Professional Portrait"
              loading="eager"
              title="Shreya Singh"
            />
          </div>
          
          {/* Identity Card below photo on mobile */}
          <div className="floating-card" id="about">
            <div className="fc-label">// identity</div>
            <div className="fc-name">Shreya M. Singh</div>
            <div className="fc-role">
              BSc IT · Mumbai, Maharashtra<br />
              AI Enthusiast · Full-Stack Developer
            </div>

            <div className="fc-contacts">
              <div className="fc-contact-item">
                <span className="dot" />Nallasopara East, Maharashtra
              </div>
              <div className="fc-contact-item">
                <span className="dot" />shreyasinghxvii@gmail.com
              </div>
            </div>

            <div className="discipline-badge">
              <span>✦</span>
              <span>155 Days Digital Discipline</span>
            </div>

            <div className="fc-socials">
              <a
                className="social-btn"
                href="https://www.linkedin.com/in/shreya-singh-935239361/"
                target="_blank" rel="noreferrer"
                data-hover title="LinkedIn"
              >
                <IconLinkedin />
              </a>
              <a
                className="social-btn"
                href="https://github.com/shreyasinghxvii-creator"
                target="_blank" rel="noreferrer"
                data-hover title="GitHub"
              >
                <IconGithub />
              </a>
              <a
                className="social-btn"
                href="mailto:shreyasinghxvii@gmail.com"
                data-hover title="Email Shreya"
              >
                <IconMail />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain exactly the same... */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <div className="ticker-item" key={i}>
              {t}&nbsp;<span className="ticker-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section" id="project">
        <div className="section-header">
          <div className="section-index">01 / Featured Work</div>
          <h2 className="section-title">Compario —<br /><em>AI Price Comparison</em></h2>
          <div className="divider" />
        </div>

        <div ref={projRef}>
          <div className={`project-card${projVisible ? " visible" : ""}`}>
            <div className="project-header">
              <span className="project-tag">Infosys Springboard 6.0</span>
              <div className="project-title">Compario</div>
              <div className="project-sub">
                An enterprise-grade AI-powered price comparison platform. Snap a product image —
                Compario scans Amazon, Flipkart, Croma &amp; Snapdeal in real-time using OCR and
                Google Gemini AI to surface the lowest price instantly. No manual searching. No wasted time.
              </div>
            </div>

            <div className="video-wrap">
                <video controls preload="metadata" className="w-full rounded-lg">
                <source src="/compario-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div style={{ padding: "0 clamp(1.5rem, 4vw, 2rem) 1rem" }}>
              <div className="skill-group-title">Technical Architecture</div>
            </div>
            <div className="arch-grid">
              {[
                ["Frontend",  "Bootstrap 5 · HTML5 · JavaScript"],
                ["Backend",   "Flask (Python) · SQLAlchemy · SQLite"],
                ["AI / OCR",  "Tesseract OCR + Google Gemini AI"],
                ["Scraping",  "Selenium WebDriver · Anti-bot bypass · Intelligent throttling"],
              ].map(([layer, tech]) => (
                <div className="arch-item" key={layer}>
                  <div className="arch-layer">{layer}</div>
                  <div className="arch-tech">{tech}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0.5rem clamp(1.5rem, 4vw, 2rem) 0.5rem" }}>
              <div className="skill-group-title">Engineering Challenges Solved</div>
            </div>
            <div className="challenge-list">
              <div className="challenge-item">
                <div className="ch-title">Dynamic DOM Structures</div>
                <div className="ch-desc">
                  E-commerce platforms frequently restructure their HTML without notice. We built an adaptive
                  scraping layer with fallback selector strategies and DOM fingerprinting, ensuring full
                  resilience against layout changes across all four target platforms.
                </div>
              </div>
              <div className="challenge-item">
                <div className="ch-title">Image Quality Variance</div>
                <div className="ch-desc">
                  Low-quality or skewed product images degraded OCR accuracy significantly. A dual-layer AI
                  system combines Tesseract for raw text extraction with Google Gemini AI to intelligently
                  refine and normalise product names — delivering reliable search queries even from poor inputs.
                </div>
              </div>
            </div>

            <div style={{ padding: "0 clamp(1.5rem, 4vw, 2rem) 0.25rem" }}>
              <div className="skill-group-title">Outcomes &amp; Features</div>
            </div>
            <div className="outcome-list">
              {["Snap, Upload & Compare","Secure Authentication","Wishlist Management",
                "Real-time Price Fetching","4-Platform Coverage","Anti-bot Bypass",
                "Intelligent OCR Pipeline","Enterprise-Grade UX"].map(o => (
                <span className="outcome-tag" key={o}>{o}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills" ref={skillsRef}>
        <div className="section-header">
          <div className="section-index">02 / Technical Skills</div>
          <h2 className="section-title">Core <em>Competencies</em></h2>
          <div className="divider" />
        </div>

        <div className="skills-grid">
          {Object.entries(SKILLS).map(([group, items]) => (
            <div key={group}>
              <div className="skill-group-title">{group}</div>
              {items.map(s => (
                <SkillBar key={s.name} name={s.name} pct={s.pct} visible={skillsVisible} />
              ))}
            </div>
          ))}
        </div>

        <div className="metrics-row">
          <MetricCounter target={155} suffix="" label="Days of Digital Discipline" />
          <MetricCounter target={4}   suffix="" label="Certifications Earned" />
          <MetricCounter target={100} suffix="%" label="ISRO Course Attendance"/>
        </div>
      </section>

      <section className="section" id="education">
        <div className="section-header">
          <div className="section-index">03 / Education &amp; Certifications</div>
          <h2 className="section-title">Learning <em>Trajectory</em></h2>
          <div className="divider" />
        </div>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} delay={i * 0.1} />
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-copy">© 2026 Shreya Singh · BSc IT · Mumbai</div>
        <a className="footer-email" href="mailto:shreyasinghxvii@gmail.com" data-hover>
          shreyasinghxvii@gmail.com
        </a>
      </footer>
    </>
  );
}