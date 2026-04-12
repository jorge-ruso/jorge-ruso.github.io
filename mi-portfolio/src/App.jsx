/**
 * JORGE CAMPOS — CYBER-OPS PORTFOLIO
 * Stack: React + Tailwind CSS + Framer Motion
 *
 * Google Fonts — add to index.html <head>:
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
 *
 * tailwind.config.js extend:
 * fontFamily: {
 *   grotesk: ['Space Grotesk', 'sans-serif'],
 *   mono: ['JetBrains Mono', 'monospace'],
 * }
 *
 * npm install framer-motion
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  bg:      "#0d1117",
  surface: "#161b22",
  surfaceAlt: "#1c2128",
  border:  "#30363d",
  borderHi:"#3d4450",
  green:   "#3fb950",
  greenDim:"#2ea043",
  cyan:    "#58e6d9",
  cyanDim: "#39d0c4",
  amber:   "#d29922",
  amberDim:"#bb8009",
  text:    "#e6edf3",
  textMid: "#8b949e",
  textLow: "#484f58",
};

// ─── NOISE TEXTURE ────────────────────────────────────────────────────────────
function StaticNoise() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.018]"
      style={{ width: "100%", height: "100%" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

// ─── SCAN LINE ────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
      style={{
        background:
          "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,1) 3px,rgba(255,255,255,1) 4px)",
      }}
    />
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusDot({ color = T.green, pulse = true }) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 8, height: 8 }}>
      {pulse && (
        <span
          className="absolute inline-flex w-full h-full rounded-full opacity-60"
          style={{ background: color, animation: "ping 2.5s cubic-bezier(0,0,.2,1) infinite" }}
        />
      )}
      <span className="relative inline-flex rounded-full" style={{ width: 7, height: 7, background: color }} />
      <style>{`@keyframes ping{75%,100%{transform:scale(1.8);opacity:0}}`}</style>
    </span>
  );
}

// ─── CORNER BRACKET ───────────────────────────────────────────────────────────
function Brackets({ color = T.green, size = 10 }) {
  const s = `${size}px`;
  const st = { width: s, height: s, borderColor: color };
  return (
    <>
      <span className="absolute top-0 left-0 border-t border-l" style={st} />
      <span className="absolute top-0 right-0 border-t border-r" style={st} />
      <span className="absolute bottom-0 left-0 border-b border-l" style={st} />
      <span className="absolute bottom-0 right-0 border-b border-r" style={st} />
    </>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionLabel({ tag, title, accent = T.cyan }) {
  return (
    <div className="mb-10">
      <p
        className="font-mono text-xs tracking-[0.35em] mb-2"
        style={{ color: accent }}
      >
        ▸ {tag}
      </p>
      <h2 className="font-grotesk text-2xl md:text-3xl font-semibold" style={{ color: T.text }}>
        {title}
      </h2>
      <div className="mt-3 h-px w-16" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    </div>
  );
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function Typewriter({ text, speed = 45, delay = 0, color = T.green }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setOut(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return (
    <span style={{ color }}>
      {out}
      {!done && <span className="animate-pulse" style={{ color }}>▌</span>}
    </span>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["ABOUT", "EXPERIENCE", "CERTIFICATIONS", "SKILLS", "CONTACT"];

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-14 h-14"
      style={{
        background: scrolled ? `${T.bg}f2` : "transparent",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <StatusDot color={T.green} />
        <span className="font-mono text-xs tracking-[0.25em]" style={{ color: T.textMid }}>
          JC<span style={{ color: T.green }}>::</span>SEC
        </span>
      </div>

      {/* Links */}
      <nav className="hidden md:flex items-center gap-7">
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="font-mono text-[10px] tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: T.textLow }}
          >
            {l}
          </a>
        ))}
      </nav>

      {/* Encrypted badge */}
      <div
        className="hidden md:flex items-center gap-2 font-mono text-[10px] px-3 py-1 rounded"
        style={{ border: `1px solid ${T.greenDim}55`, color: T.greenDim, background: `${T.green}0a` }}
      >
        <span>⚿</span>
        <span>ENCRYPTED</span>
      </div>
    </motion.header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-24 pt-20 relative overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${T.cyan} 1px, transparent 1px), linear-gradient(90deg, ${T.cyan} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial accent */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${T.cyan}, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-3xl">
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-6 font-mono text-xs"
          style={{ color: T.textMid }}
        >
          <StatusDot color={T.green} />
          <span>[&nbsp;STATUS:&nbsp;<span style={{ color: T.green }}>ACTIVE</span>
          &nbsp;//&nbsp;<span style={{ color: T.cyan }}>ENCRYPTED CONNECTION</span>&nbsp;]</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-grotesk text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          style={{ color: T.text }}
        >
          Jorge<br />
          <span style={{ color: T.cyan }}>Campos</span>
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="font-grotesk text-xl md:text-2xl font-medium mb-3"
          style={{ color: T.textMid }}
        >
          <Typewriter text="Cyber Security Analyst & Penetration Tester" speed={50} delay={1100} color={T.text} />
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8 }}
          className="font-grotesk text-base mb-10"
          style={{ color: T.textMid }}
        >
          De liderar infraestructuras físicas a proteger infraestructuras digitales.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2 }}
          className="flex flex-wrap gap-4"
        >
          <TacticalButton href="#experience" accent="cyan">VIEW_MISSIONS</TacticalButton>
          <TacticalButton href="#contact" accent="amber" outline>OPEN_CHANNEL</TacticalButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-8"
          style={{ background: `linear-gradient(to bottom, ${T.cyan}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}

function TacticalButton({ children, href = "#", accent = "cyan", outline = false }) {
  const col = accent === "cyan" ? T.cyan : accent === "amber" ? T.amber : T.green;
  return (
    <a
      href={href}
      className="relative inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-widest transition-all duration-200"
      style={{
        color: outline ? col : T.bg,
        background: outline ? "transparent" : col,
        border: `1px solid ${col}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px ${col}44`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </a>
  );
}

// ─── ABOUT TERMINAL ───────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const lines = [
    { prompt: "whoami", out: "jorge_campos@sec-ops", color: T.green },
    { prompt: "cat profile.txt", out: null },
    { out: "Former construction Foreman (JJensen A/S, Denmark) → Cybersecurity.", color: T.text },
    { out: "Expert in risk management, high-pressure leadership & team operations.", color: T.text },
    { out: "eJPTv2 certified. Active learner. Threat hunter in progress.", color: T.text },
    { prompt: "cat languages.conf", out: null },
    { out: "SPANISH  [██████████] NATIVE", color: T.cyan },
    { out: "ENGLISH  [████████░░] FLUENT", color: T.cyan },
    { out: "DANISH   [██████░░░░] WORKING PROFICIENCY", color: T.cyan },
    { prompt: "echo $STATUS", out: "AVAILABLE_FOR_OPPORTUNITIES", color: T.amber },
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-14 lg:px-24">
      <SectionLabel tag="SYS.PROFILE" title="About Me" accent={T.green} />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-2xl relative"
        style={{ border: `1px solid ${T.border}`, background: T.surface }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-b"
          style={{ borderColor: T.border }}
        >
          <div className="flex gap-1.5">
            {["#ff5f57","#febc2e","#28c840"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: T.textLow }}>
            jorge@kali:~$
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-5 space-y-1 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div key={i}>
              {line.prompt && (
                <div style={{ color: T.textMid }}>
                  <span style={{ color: T.green }}>jorge@kali</span>
                  <span style={{ color: T.textLow }}>:~$</span>{" "}
                  <span style={{ color: T.text }}>{line.prompt}</span>
                </div>
              )}
              {line.out && (
                <div style={{ color: line.color || T.textMid, paddingLeft: line.prompt ? 0 : "1rem" }}>
                  {line.out}
                </div>
              )}
            </div>
          ))}
          <div style={{ color: T.textMid }}>
            <span style={{ color: T.green }}>jorge@kali</span>
            <span style={{ color: T.textLow }}>:~$</span>{" "}
            <span className="animate-pulse">▌</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: "OPS-001",
    role: "Physical Risk Management & Team Operations",
    org: "JJensen A/S — Denmark",
    period: "2022 – 2025",
    classification: "FIELD_OPS",
    color: T.amber,
    bullets: [
      "Supervised 8–12 personnel in high-stakes physical infrastructure deployments",
      "Identified, assessed and mitigated on-site hazards — zero incidents under watch",
      "Rapid promotion from operator to Foreman: evidence of High Adaptability rating",
      "Enforced strict compliance with ISO safety protocols and Danish regulation",
    ],
    tags: ["Risk Assessment", "Team Leadership", "Compliance", "Incident Prevention"],
    badge: "PROMOTED",
  },
  {
    id: "OPS-000",
    role: "Technical Operations Lead",
    org: "Field Infrastructure — Spain / EU",
    period: "2018 – 2022",
    classification: "PRIOR_OPS",
    color: T.cyan,
    bullets: [
      "Managed cross-functional teams in critical infrastructure projects",
      "Developed incident response protocols adapted to site-specific threat models",
      "Coordinated logistics under tight deadlines with multi-stakeholder environments",
    ],
    tags: ["Operations", "Protocol Design", "Cross-team Coordination"],
    badge: null,
  },
];

function MissionCard({ mission, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 transition-all duration-300 cursor-default"
      style={{
        border: `1px solid ${hovered ? mission.color : T.border}`,
        background: hovered ? `${mission.color}08` : T.surface,
        boxShadow: hovered ? `0 0 24px ${mission.color}22` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Brackets color={mission.color} size={9} />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px]" style={{ color: mission.color }}>
              [{mission.id}]
            </span>
            <span
              className="font-mono text-[9px] px-2 py-0.5"
              style={{
                color: mission.color,
                border: `1px solid ${mission.color}44`,
                background: `${mission.color}0d`,
              }}
            >
              {mission.classification}
            </span>
            {mission.badge && (
              <span
                className="font-mono text-[9px] px-2 py-0.5"
                style={{ color: T.amber, border: `1px solid ${T.amber}55`, background: `${T.amber}0d` }}
              >
                ★ {mission.badge}
              </span>
            )}
          </div>
          <h3 className="font-grotesk text-base font-semibold" style={{ color: T.text }}>
            {mission.role}
          </h3>
          <p className="font-mono text-xs mt-0.5" style={{ color: T.textMid }}>
            {mission.org}
          </p>
        </div>
        <span className="font-mono text-xs" style={{ color: T.textLow }}>
          {mission.period}
        </span>
      </div>

      {/* Bullets — scan effect on hover */}
      <ul className="space-y-1.5 mb-4">
        {mission.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-2 font-mono text-xs transition-colors duration-200"
            style={{ color: hovered ? T.textMid : T.textLow }}
          >
            <span style={{ color: mission.color, flexShrink: 0 }}>›</span>
            {b}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {mission.tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[9px] px-2 py-0.5"
            style={{ color: T.textLow, border: `1px solid ${T.border}` }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Scan line on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5"
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.4 }}
        style={{ background: mission.color, boxShadow: `0 0 6px ${mission.color}` }}
      />
    </motion.div>
  );
}

function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-14 lg:px-24">
      <SectionLabel tag="MISSION.LOG" title="Experience & Missions" accent={T.amber} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        {MISSIONS.map((m, i) => (
          <MissionCard key={m.id} mission={m} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
const CERTS = [
  {
    code: "eJPTv2",
    name: "Junior Penetration Tester",
    issuer: "INE Security",
    year: "2024",
    status: "ACTIVE",
    color: T.green,
    icon: "⬡",
    desc: "Hands-on penetration testing certification covering network attacks, web app exploitation and reporting.",
  },
  {
    code: "GCC",
    name: "Cybersecurity Professional",
    issuer: "Google / Coursera",
    year: "2024",
    status: "ACTIVE",
    color: T.cyan,
    icon: "◈",
    desc: "8-course professional program: SIEM, incident response, network security, Python automation & more.",
  },
];

const TOOLS = [
  { name: "Kali Linux", icon: "◈", color: T.green },
  { name: "Python", icon: "⬡", color: T.cyan },
  { name: "Nmap", icon: "◉", color: T.amber },
  { name: "Metasploit", icon: "◈", color: T.green },
  { name: "Burp Suite", icon: "⬡", color: T.cyan },
  { name: "Wireshark", icon: "◉", color: T.amber },
  { name: "Red Teaming", icon: "◈", color: T.green },
  { name: "OSINT", icon: "⬡", color: T.cyan },
];

function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="certifications" className="py-24 px-6 md:px-14 lg:px-24" ref={ref}>
      <SectionLabel tag="CREDENTIALS.VERIFIED" title="Tech Stack & Certifications" accent={T.cyan} />

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Certs */}
        <div className="space-y-4">
          {CERTS.map((cert, i) => (
            <motion.div
              key={cert.code}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative p-5"
              style={{ border: `1px solid ${cert.color}44`, background: T.surface }}
            >
              <Brackets color={cert.color} size={8} />
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span style={{ color: cert.color, fontSize: 22 }}>{cert.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-grotesk text-sm font-semibold" style={{ color: T.text }}>
                        {cert.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: T.textMid }}>
                      {cert.issuer} · {cert.year}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="font-mono text-[9px] px-2 py-0.5"
                    style={{ color: cert.color, border: `1px solid ${cert.color}55`, background: `${cert.color}0d` }}
                  >
                    {cert.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <StatusDot color={T.green} pulse={false} />
                    <span className="font-mono text-[9px]" style={{ color: T.green }}>{cert.status}</span>
                  </div>
                </div>
              </div>
              <p className="font-grotesk text-xs leading-relaxed" style={{ color: T.textMid }}>
                {cert.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tools grid */}
        <div>
          <p className="font-mono text-xs tracking-[0.3em] mb-5" style={{ color: T.textLow }}>
            [ TOOL_SUITE ]
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.06 + 0.2 }}
                className="flex items-center gap-3 p-3 transition-all duration-200 cursor-default group"
                style={{ border: `1px solid ${T.border}`, background: T.surfaceAlt }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tool.color;
                  e.currentTarget.style.boxShadow = `0 0 14px ${tool.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ color: tool.color, fontSize: 14 }}>{tool.icon}</span>
                <span className="font-mono text-xs" style={{ color: T.textMid }}>
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS / LANGUAGES ───────────────────────────────────────────────────────
const SKILL_DOMAINS = [
  { name: "Network Security",      level: 80, color: T.green },
  { name: "Web App Pentesting",     level: 75, color: T.cyan },
  { name: "Risk Management",        level: 95, color: T.amber },
  { name: "Python Scripting",       level: 68, color: T.cyan },
  { name: "Incident Response",      level: 72, color: T.green },
  { name: "Team Leadership",        level: 96, color: T.amber },
];

const LANGUAGES = [
  { lang: "Español",  code: "ES", level: 100, label: "NATIVE",                color: T.green },
  { lang: "English",  code: "EN", level: 88,  label: "FLUENT",                 color: T.cyan },
  { lang: "Dansk",    code: "DA", level: 58,  label: "WORKING PROFICIENCY",    color: T.amber },
];

function SkillBar({ name, level, color, index, inView }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-xs" style={{ color: T.textMid }}>{name}</span>
        <span className="font-mono text-xs font-medium" style={{ color }}>{level}%</span>
      </div>
      <div className="relative h-1" style={{ background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
        <motion.div
          className="absolute top-0 left-0 h-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay: index * 0.07 + 0.2, ease: "easeOut" }}
          style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
        />
      </div>
    </div>
  );
}

function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="py-24 px-6 md:px-14 lg:px-24" ref={ref}>
      <SectionLabel tag="CAPABILITY.MATRIX" title="Skills & Protocols" accent={T.green} />

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Skill bars — 3 cols */}
        <div className="lg:col-span-3 space-y-5">
          {SKILL_DOMAINS.map((s, i) => (
            <SkillBar key={s.name} {...s} index={i} inView={inView} />
          ))}
        </div>

        {/* Languages — 2 cols */}
        <div className="lg:col-span-2">
          <p className="font-mono text-xs tracking-[0.3em] mb-5" style={{ color: T.textLow }}>
            [ COMMUNICATION_PROTOCOLS ]
          </p>
          <div className="space-y-4">
            {LANGUAGES.map((l, i) => (
              <motion.div
                key={l.lang}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12 + 0.3 }}
                className="relative p-4"
                style={{ border: `1px solid ${l.color}33`, background: T.surface }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5"
                      style={{ color: l.color, border: `1px solid ${l.color}55`, background: `${l.color}0d` }}
                    >
                      {l.code}
                    </span>
                    <span className="font-grotesk text-sm font-medium" style={{ color: T.text }}>
                      {l.lang}
                    </span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: T.textLow }}>
                    {l.label}
                  </span>
                </div>
                <div className="h-1" style={{ background: T.surfaceAlt }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${l.level}%` } : {}}
                    transition={{ duration: 1.0, delay: i * 0.12 + 0.5, ease: "easeOut" }}
                    style={{ background: l.color, boxShadow: `0 0 5px ${l.color}66` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && msg) setSent(true);
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-14 lg:px-24">
      <SectionLabel tag="COMMS.CHANNEL" title="Open a Channel" accent={T.amber} />

      <div className="max-w-xl">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "IDENTIFIER", placeholder: "Your name", value: name, set: setName, type: "text" },
                  { label: "COMM_CHANNEL", placeholder: "Email address", value: email, set: setEmail, type: "email" },
                ].map(({ label, placeholder, value, set, type }) => (
                  <div key={label}>
                    <label className="font-mono text-[10px] tracking-widest block mb-1.5" style={{ color: T.textLow }}>
                      ▸ {label}
                    </label>
                    <input
                      type={type}
                      required
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 font-mono text-xs outline-none transition-all duration-200"
                      style={{
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        color: T.text,
                        caretColor: T.green,
                      }}
                      onFocus={(e) => { e.target.style.borderColor = T.cyan; }}
                      onBlur={(e) => { e.target.style.borderColor = T.border; }}
                    />
                  </div>
                ))}
                <div>
                  <label className="font-mono text-[10px] tracking-widest block mb-1.5" style={{ color: T.textLow }}>
                    ▸ TRANSMISSION
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Your message..."
                    className="w-full px-3 py-2.5 font-mono text-xs outline-none resize-none transition-all duration-200"
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      color: T.text,
                      caretColor: T.green,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = T.cyan; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; }}
                  />
                </div>
                <TacticalButton href="#" accent="cyan">
                  <span onClick={handleSubmit}>SEND_TRANSMISSION</span>
                </TacticalButton>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-6 font-mono text-sm space-y-2"
              style={{ border: `1px solid ${T.green}55`, background: `${T.green}08` }}
            >
              <Brackets color={T.green} />
              <div style={{ color: T.green }}>✓ TRANSMISSION RECEIVED</div>
              <div style={{ color: T.textMid }}>
                FROM: <span style={{ color: T.text }}>{name}</span>
              </div>
              <div style={{ color: T.textMid }}>
                CHANNEL: <span style={{ color: T.cyan }}>{email}</span>
              </div>
              <div style={{ color: T.textMid }}>RESPONSE_ETA: 24H</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social row */}
        <div className="mt-8 flex gap-5 flex-wrap">
          {[
            ["GitHub", "github.com/jorgecampos"],
            ["LinkedIn", "linkedin.com/in/jorgecampos"],
            ["TryHackMe", "tryhackme.com/p/jorge"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={`https://${href}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] tracking-widest transition-colors duration-200 hover:text-white"
              style={{ color: T.textLow }}
            >
              /{label.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-6 px-6 md:px-14 flex flex-col md:flex-row items-center justify-between gap-3 border-t"
      style={{ borderColor: T.border }}
    >
      <span className="font-mono text-xs" style={{ color: T.textLow }}>
        © 2025 JORGE_CAMPOS — ALL RIGHTS RESERVED
      </span>
      <div className="flex items-center gap-2 font-mono text-xs" style={{ color: T.textLow }}>
        <StatusDot color={T.green} />
        <span>SYSTEMS OPERATIONAL // BUILD 2025.03.26</span>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: "Space Grotesk, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
        ::placeholder { color: #484f58; }
        input, textarea { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <StaticNoise />
      <ScanLine />
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Certifications />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}