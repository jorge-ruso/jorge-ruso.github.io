/**
 * JORGE CAMPOS BELLIDO — CYBER-OPS PORTFOLIO v2
 * Stack: React + Framer Motion
 * Fonts: Space Grotesk + JetBrains Mono
 * Color coding:
 *   Blue   → Blue Team / SOC / Defensive
 *   Red    → Red Team / Pentesting / Offensive
 *   Purple → Shared / Cross-discipline
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  bg:         "#0f1117",
  surface:    "#15181f",
  surfaceAlt: "#1a1e28",
  border:     "#252a38",
  blue:       "#4f9cf9",
  blueBg:     "#0b1e35",
  red:        "#f85c6a",
  redBg:      "#280b0f",
  purple:     "#a78bfa",
  purpleBg:   "#18122e",
  green:      "#34d399",
  amber:      "#fbbf24",
  text:       "#e8eaf2",
  textMid:    "#8892a6",
  textLow:    "#454d62",
};

const teamColor = { blue: T.blue, red: T.red, purple: T.purple };
const teamBg    = { blue: T.blueBg, red: T.redBg, purple: T.purpleBg };
const teamLabel = { blue: "BLUE TEAM", red: "RED TEAM", purple: "SHARED" };

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:${T.bg};color:${T.text};font-family:'Space Grotesk',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:${T.bg}}
  ::-webkit-scrollbar-thumb{background:#252a38;border-radius:2px}
  ::placeholder{color:#454d62}
  input,textarea{font-family:'JetBrains Mono',monospace}
  @keyframes ping{75%,100%{transform:scale(1.9);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .mono{font-family:'JetBrains Mono',monospace}
  .gsk{font-family:'Space Grotesk',sans-serif}
`;

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function StatusDot({ color = T.green, pulse = true, size = 7 }) {
  return (
    <span style={{ position:"relative",display:"inline-flex",width:size+1,height:size+1,alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      {pulse && <span style={{ position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:color,opacity:.5,animation:"ping 2.5s cubic-bezier(0,0,.2,1) infinite" }} />}
      <span style={{ position:"relative",width:size,height:size,borderRadius:"50%",background:color,display:"inline-flex" }} />
    </span>
  );
}

function Brackets({ color, size = 10 }) {
  const s=`${size}px`, b=`1px solid ${color}`;
  return (
    <>
      <span style={{ position:"absolute",top:0,left:0,width:s,height:s,borderTop:b,borderLeft:b }} />
      <span style={{ position:"absolute",top:0,right:0,width:s,height:s,borderTop:b,borderRight:b }} />
      <span style={{ position:"absolute",bottom:0,left:0,width:s,height:s,borderBottom:b,borderLeft:b }} />
      <span style={{ position:"absolute",bottom:0,right:0,width:s,height:s,borderBottom:b,borderRight:b }} />
    </>
  );
}

function Badge({ team, label }) {
  const col = teamColor[team] || T.purple;
  const bg  = teamBg[team]    || T.purpleBg;
  const lbl = label || teamLabel[team] || team.toUpperCase();
  return (
    <span className="mono" style={{ fontSize:9,padding:"2px 7px",border:`1px solid ${col}55`,color:col,background:bg,letterSpacing:"0.1em",flexShrink:0 }}>
      {lbl}
    </span>
  );
}

function SecBtn({ children, href, color, outline = false }) {
  const isExt = href && (href.startsWith("http") || href.endsWith(".pdf"));
  return (
    <a href={href} target={isExt?"_blank":undefined} rel={isExt?"noreferrer":undefined} className="mono"
      style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"10px 22px",fontSize:11,
        letterSpacing:"0.15em",color:outline?color:T.bg,background:outline?"transparent":color,
        border:`1px solid ${color}`,textDecoration:"none",transition:"all 0.2s",cursor:"pointer" }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 20px ${color}44`}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      {children}
    </a>
  );
}

function SectionHead({ tag, title, accent = T.blue }) {
  return (
    <div style={{ marginBottom:36 }}>
      <p className="mono" style={{ fontSize:10,letterSpacing:"0.35em",color:accent,marginBottom:8 }}>▸ {tag}</p>
      <h2 className="gsk" style={{ fontSize:"clamp(22px,4vw,32px)",fontWeight:700,color:T.text }}>{title}</h2>
      <div style={{ marginTop:10,height:2,width:48,background:accent,borderRadius:1 }} />
    </div>
  );
}

function TeamLegend() {
  return (
    <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:24 }}>
      <Badge team="blue" /><Badge team="red" /><Badge team="purple" label="SHARED" />
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc,setSc] = useState(false);
  useEffect(()=>{
    const fn=()=>setSc(window.scrollY>30);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  const links=["About","Experience","Projects","Certifications","Skills","Contact"];
  return (
    <motion.header initial={{y:-56,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5}}
      style={{ position:"fixed",top:0,left:0,right:0,zIndex:30,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 clamp(20px,5vw,56px)",height:56,
        background:sc?`${T.bg}f5`:"transparent",
        borderBottom:sc?`1px solid ${T.border}`:"none",
        backdropFilter:sc?"blur(12px)":"none",transition:"all 0.3s" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <StatusDot color={T.green} />
        <span className="mono" style={{ fontSize:11,letterSpacing:"0.2em",color:T.textMid }}>
          JCB<span style={{color:T.blue}}>::</span>SEC
        </span>
      </div>
      <nav style={{ display:"flex",gap:24 }}>
        {links.map(l=>(
          <a key={l} href={`#${l.toLowerCase()}`} className="mono"
            style={{ fontSize:10,letterSpacing:"0.2em",color:T.textLow,textDecoration:"none",transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color=T.blue}
            onMouseLeave={e=>e.target.style.color=T.textLow}>
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
      <div className="mono" style={{ display:"flex",alignItems:"center",gap:6,fontSize:10,
        padding:"4px 10px",border:`1px solid ${T.blue}44`,color:T.blue,background:`${T.blue}0d` }}>
        ⚿ ENCRYPTED
      </div>
    </motion.header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [role,setRole]=useState(""); const [done,setDone]=useState(false);
  useEffect(()=>{
    let i=0; const txt="Cyber Security Analyst & Penetration Tester";
    const t=setTimeout(()=>{
      const iv=setInterval(()=>{ setRole(txt.slice(0,++i)); if(i>=txt.length){clearInterval(iv);setDone(true);}},48);
      return ()=>clearInterval(iv);
    },1200);
    return ()=>clearTimeout(t);
  },[]);
  return (
    <section id="hero" style={{ minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",
      padding:"80px clamp(20px,5vw,56px) 60px",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,opacity:0.03,
        backgroundImage:`linear-gradient(${T.blue} 1px,transparent 1px),linear-gradient(90deg,${T.blue} 1px,transparent 1px)`,
        backgroundSize:"52px 52px" }} />
      <div style={{ position:"absolute",top:"-10%",right:"-5%",width:500,height:500,borderRadius:"50%",
        background:`radial-gradient(circle,${T.blue},transparent 70%)`,opacity:0.05,pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"10%",left:"-5%",width:400,height:400,borderRadius:"50%",
        background:`radial-gradient(circle,${T.red},transparent 70%)`,opacity:0.05,pointerEvents:"none" }} />

      <div style={{ position:"relative",zIndex:2,maxWidth:800 }}>
        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="mono" style={{ display:"flex",alignItems:"center",gap:10,marginBottom:24,fontSize:11,color:T.textMid }}>
          <StatusDot color={T.green} />
          <span>[ STATUS: <span style={{color:T.green}}>ACTIVE</span> // <span style={{color:T.blue}}>SEEKING OPPORTUNITIES · COPENHAGEN</span> ]</span>
        </motion.div>

        <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
          className="gsk" style={{ fontSize:"clamp(44px,9vw,88px)",fontWeight:800,lineHeight:1,marginBottom:14,color:T.text }}>
          Jorge<br />
          <span style={{color:T.blue}}>Campos</span>{" "}
          <span style={{color:T.red}}>Bellido</span>
        </motion.h1>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}}
          className="gsk" style={{ fontSize:"clamp(15px,2.5vw,21px)",fontWeight:500,color:T.textMid,marginBottom:8,minHeight:"1.4em" }}>
          {role}{!done&&<span style={{color:T.blue,animation:"blink 1s infinite"}}>▌</span>}
        </motion.p>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3.8}}
          className="gsk" style={{ fontSize:14,color:T.textLow,marginBottom:32,maxWidth:520,lineHeight:1.7 }}>
          From managing physical risks on construction sites to hunting digital threats.
          eSOC & eJPTv2 certified. Copenhagen, Denmark.
        </motion.p>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:4.0}}
          style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:32 }}>
          <Badge team="blue" label="SOC ANALYST" />
          <Badge team="red"  label="PENTESTER" />
          <span className="mono" style={{ fontSize:9,padding:"2px 7px",border:`1px solid ${T.green}55`,color:T.green,background:`${T.green}0d` }}>eSOC · INE</span>
          <span className="mono" style={{ fontSize:9,padding:"2px 7px",border:`1px solid ${T.green}55`,color:T.green,background:`${T.green}0d` }}>eJPTv2 · INE</span>
          <span className="mono" style={{ fontSize:9,padding:"2px 7px",border:`1px solid ${T.amber}55`,color:T.amber,background:`${T.amber}0d` }}>GOOGLE CERT</span>
        </motion.div>

        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:4.3}}
          style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          <SecBtn href="#experience" color={T.blue}>VIEW_EXPERIENCE</SecBtn>
          <SecBtn href="#projects"   color={T.red}    outline>VIEW_PROJECTS</SecBtn>
          <SecBtn href="#contact"    color={T.purple} outline>OPEN_CHANNEL</SecBtn>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  const lines=[
    {prompt:"whoami"},
    {out:"jorge_campos_bellido — SOC Analyst | Pentester | Copenhagen",col:T.blue},
    {prompt:"cat profile.txt"},
    {out:"Entry-level cybersecurity professional. Blue Team & SOC focus.",col:T.text},
    {out:"eSOC + eJPTv2 (INE Security) + Google Cybersecurity Professional.",col:T.text},
    {out:"3+ years Foreman — risk management, incident coordination, high-pressure ops.",col:T.text},
    {out:"Hands-on labs: TryHackMe (5 paths), INE Security, Python automation.",col:T.text},
    {prompt:"cat languages.conf"},
    {out:"ESPAÑOL  [██████████] NATIVE",col:T.blue},
    {out:"ENGLISH  [████████░░] FLUENT (B1 Certified)",col:T.blue},
    {out:"DANSK    [████░░░░░░] BASIC",col:T.blue},
    {prompt:"echo $CONTACT"},
    {out:"jorgecamposbellido@gmail.com",col:T.purple},
    {prompt:"echo $STATUS"},
    {out:"AVAILABLE_FOR_OPPORTUNITIES — Seeking SOC Analyst role in Denmark",col:T.green},
  ];
  return (
    <section id="about" style={{ padding:"80px clamp(20px,5vw,56px)" }}>
      <SectionHead tag="SYS.PROFILE" title="About Me" accent={T.blue} />
      <motion.div ref={ref} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.5}}
        style={{ maxWidth:640,border:`1px solid ${T.border}`,background:T.surface }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderBottom:`1px solid ${T.border}` }}>
          {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}} />)}
          <span className="mono" style={{fontSize:10,color:T.textLow,marginLeft:4}}>jorge@kali:~$</span>
        </div>
        <div style={{padding:20}} className="mono">
          {lines.map((l,i)=>(
            <div key={i} style={{fontSize:11,lineHeight:"1.9"}}>
              {l.prompt&&(
                <div style={{color:T.textMid}}>
                  <span style={{color:T.blue}}>jorge@kali</span>
                  <span style={{color:T.textLow}}>:~$</span>{" "}
                  <span style={{color:T.text}}>{l.prompt}</span>
                </div>
              )}
              {l.out&&<div style={{color:l.col,paddingLeft:l.prompt?0:12}}>{l.out}</div>}
            </div>
          ))}
          <div style={{fontSize:11,color:T.textMid,marginTop:4}}>
            <span style={{color:T.blue}}>jorge@kali</span>
            <span style={{color:T.textLow}}>:~$</span>{" "}
            <span style={{color:T.blue,animation:"blink 1s infinite"}}>▌</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const MISSIONS=[
  { id:"OPS-002",color:T.blue,badge:"PROMOTED",classification:"CURRENT · ACTIVE",
    role:"Physical Risk Management & Team Operations",
    org:"J. Jensen A/S — Copenhagen, Denmark",period:"Mar 2023 – Present",
    bullets:[
      "Lead multicultural teams in safety-critical environments — full compliance with Danish safety regulations",
      "Ongoing risk assessments & incident response coordination → directly maps to SOC alert triage",
      "Promoted to Foreman within 6 months — youngest in company — High Adaptability rating",
      "Real-time decision-making, resource prioritisation under pressure across time-sensitive operations",
    ],
    tags:["Risk Assessment","Incident Response","Team Leadership","Compliance","High-Pressure Ops"],
  },
  { id:"OPS-001",color:T.purple,badge:null,classification:"PRIOR_OPS",
    role:"Team Leader & Customer-Facing Operations",
    org:"Alcaidesa Golf Club / Sal Verde — Spain",period:"2019 – 2022",
    bullets:[
      "Led small teams in fast-paced environments — crisis management and conflict resolution",
      "Successfully relocated Spain → Denmark — high adaptability under environmental change",
      "Cross-cultural communication with diverse international teams and clients",
    ],
    tags:["Team Leadership","Crisis Management","Cross-cultural Comms","International"],
  },
];

function MissionCard({m,index}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-60px"});
  const [hov,setHov]=useState(false);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.5,delay:index*0.1}}
      style={{ position:"relative",padding:24,border:`1px solid ${hov?m.color:T.border}`,
        background:hov?`${m.color}08`:T.surface,
        boxShadow:hov?`0 0 28px ${m.color}18`:"none",transition:"all 0.3s",cursor:"default" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <Brackets color={m.color} />
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:8,marginBottom:14}}>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <span className="mono" style={{fontSize:10,color:m.color}}>[{m.id}]</span>
            <span className="mono" style={{fontSize:9,padding:"2px 7px",border:`1px solid ${m.color}44`,color:m.color,background:`${m.color}0d`}}>{m.classification}</span>
            {m.badge&&<span className="mono" style={{fontSize:9,padding:"2px 7px",border:`1px solid ${T.amber}55`,color:T.amber,background:`${T.amber}0d`}}>★ {m.badge}</span>}
          </div>
          <h3 className="gsk" style={{fontSize:15,fontWeight:600,color:T.text,margin:0}}>{m.role}</h3>
          <p className="mono" style={{fontSize:11,color:T.textMid,margin:"4px 0 0"}}>{m.org}</p>
        </div>
        <span className="mono" style={{fontSize:11,color:T.textLow}}>{m.period}</span>
      </div>
      <ul style={{listStyle:"none",padding:0,margin:"0 0 14px",display:"flex",flexDirection:"column",gap:5}}>
        {m.bullets.map((b,i)=>(
          <li key={i} className="mono" style={{display:"flex",gap:8,fontSize:10,color:hov?T.textMid:T.textLow,transition:"color 0.2s",lineHeight:1.7}}>
            <span style={{color:m.color,flexShrink:0}}>›</span>{b}
          </li>
        ))}
      </ul>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {m.tags.map(t=><span key={t} className="mono" style={{fontSize:9,padding:"2px 7px",border:`1px solid ${T.border}`,color:T.textLow}}>{t}</span>)}
      </div>
      <motion.div animate={{width:hov?"100%":"0%"}} transition={{duration:0.4}}
        style={{position:"absolute",bottom:0,left:0,height:2,background:m.color}} />
    </motion.div>
  );
}

function Experience() {
  return (
    <section id="experience" style={{padding:"80px clamp(20px,5vw,56px)"}}>
      <SectionHead tag="MISSION.LOG" title="Experience" accent={T.blue} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,maxWidth:980}}>
        {MISSIONS.map((m,i)=><MissionCard key={m.id} m={m} index={i} />)}
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const PROJECTS=[
  { id:"PRJ-002",team:"blue",color:T.blue,
    title:"BRICKSTORM Malware Analysis",
    tag:"Threat Intelligence / Malware Analysis",
    desc:"Independent analysis of BRICKSTORM — a Go/Rust backdoor by UNC5221 (Chinese APT) targeting VMware vCenter. 393 days undetected. Full MITRE ATT&CK mapping, YARA/Sigma rules, IOC list, and kill-chain diagram. Based on TLP:CLEAR intelligence from CISA, Google Mandiant, and NVISO.",
    highlights:["39 MITRE ATT&CK techniques · 12 tactics","4 YARA rules (Go, Rust, Windows, BRICKSTEAL)","6 Sigma rules for SIEM platforms","IOC list + attack flow kill-chain diagram"],
    tech:["MITRE ATT&CK","YARA","Sigma","Threat Intel","IOC Analysis","VMware vCenter","Go","Rust"],
    link:"https://github.com/jorge-ruso/brickstorm-malware-analysis",
  },
  { id:"PRJ-001",team:"red",color:T.red,
    title:"FastRecon Automator",
    tag:"Red Team / Recon Automation",
    desc:"Automates the full reconnaissance phase of a pentest across 5 sequential phases: subdomain enumeration, bulk DNS resolution with 50 concurrent threads, port scanning via Nmap, web fingerprinting with httpx + whatweb, and auto-generated interactive HTML report + plain text + JSON output.",
    highlights:["5 automated recon phases end-to-end","50 concurrent DNS resolution threads","Interactive HTML report + JSON + plain text","115 LinkedIn impressions on launch"],
    tech:["Python","Bash","Nmap","Subfinder","Amass","Assetfinder","httpx","Whatweb"],
    link:"https://github.com/jorge-ruso/FastRecon-Automator",
  },
];

function ProjectCard({p,index}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-60px"});
  const [hov,setHov]=useState(false);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.5,delay:index*0.12}}
      style={{position:"relative",padding:24,border:`1px solid ${hov?p.color:`${p.color}44`}`,
        background:hov?`${p.color}06`:T.surface,
        boxShadow:hov?`0 0 28px ${p.color}18`:"none",transition:"all 0.3s",cursor:"default"}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <Brackets color={p.color} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:8}}>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <span className="mono" style={{fontSize:10,color:p.color}}>[{p.id}]</span>
            <Badge team={p.team} label={p.tag} />
          </div>
          <h3 className="gsk" style={{fontSize:16,fontWeight:700,color:T.text,margin:0}}>{p.title}</h3>
        </div>
        <a href={p.link} target="_blank" rel="noreferrer" className="mono"
          style={{fontSize:9,padding:"4px 10px",border:`1px solid ${p.color}55`,color:p.color,
            textDecoration:"none",background:`${p.color}0d`,flexShrink:0,transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 12px ${p.color}44`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          GITHUB →
        </a>
      </div>
      <p className="gsk" style={{fontSize:12,color:T.textMid,lineHeight:1.75,margin:"0 0 14px"}}>{p.desc}</p>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:14}}>
        {p.highlights.map((h,i)=>(
          <div key={i} className="mono" style={{fontSize:10,color:i<2?p.color:T.textMid,display:"flex",gap:6,alignItems:"flex-start"}}>
            <span style={{color:p.color,flexShrink:0}}>▸</span>{h}
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {p.tech.map(t=><span key={t} className="mono" style={{fontSize:9,padding:"2px 7px",border:`1px solid ${p.color}33`,color:p.color,background:`${p.color}0d`}}>{t}</span>)}
      </div>
      <motion.div animate={{width:hov?"100%":"0%"}} transition={{duration:0.4}}
        style={{position:"absolute",bottom:0,left:0,height:2,background:p.color}} />
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{padding:"80px clamp(20px,5vw,56px)"}}>
      <SectionHead tag="PROJECT.LOG" title="Projects" accent={T.red} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,maxWidth:980}}>
        {PROJECTS.map((p,i)=><ProjectCard key={p.id} p={p} index={i} />)}
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
const CERTS=[
  {code:"eSOC",   name:"Security Operations Center",        issuer:"INE Security",     date:"Apr 2026",team:"blue",  icon:"◈",star:true},
  {code:"eJPTv2", name:"Junior Penetration Tester v2",      issuer:"INE Security",     date:"Jan 2026",team:"red",   icon:"⬡",star:true,id:"172015960"},
  {code:"THM-JPT",name:"Jr Penetration Tester",             issuer:"TryHackMe",        date:"Mar 2026",team:"red",   icon:"⬡",id:"THM-R9PLQJ55OD"},
  {code:"THM-WEB",name:"Web Fundamentals",                  issuer:"TryHackMe",        date:"Mar 2026",team:"purple",icon:"◉",id:"THM-TSHICTXABE"},
  {code:"THM-CS", name:"Cyber Security 101",                issuer:"TryHackMe",        date:"Nov 2025",team:"purple",icon:"◉",id:"THM-IVFW3VNYMY"},
  {code:"THM-PRE",name:"Pre Security",                      issuer:"TryHackMe",        date:"Jul 2025",team:"blue",  icon:"◈",id:"THM-MJ8VR72BH4"},
  {code:"GCC",    name:"Cybersecurity Professional",        issuer:"Google / Coursera",date:"May 2025",team:"blue",  icon:"◈",id:"3JINLXBDLDV4"},
  {code:"PY-SEC", name:"Automate Cybersecurity with Python",issuer:"Coursera",         date:"2025",    team:"purple",icon:"◉"},
  {code:"ATK-VUL",name:"Assets, Threats & Vulnerabilities", issuer:"Coursera",         date:"2025",    team:"blue",  icon:"◈"},
  {code:"NET-SEC",name:"Networks & Network Security",       issuer:"Coursera",         date:"2025",    team:"blue",  icon:"◈"},
  {code:"SEC-RSK",name:"Manage Security Risk",              issuer:"Coursera",         date:"Jan 2025",team:"blue",  icon:"◈"},
  {code:"AI-DEV", name:"Intro to Development with AI",      issuer:"BIG School",       date:"Oct 2025",team:"purple",icon:"◉"},
];

function Certifications() {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  return (
    <section id="certifications" style={{padding:"80px clamp(20px,5vw,56px)"}} ref={ref}>
      <SectionHead tag="CREDENTIALS.VERIFIED" title="Certifications" accent={T.purple} />
      <TeamLegend />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:10,maxWidth:980}}>
        {CERTS.map((c,i)=>{
          const col=teamColor[c.team];
          return (
            <motion.div key={c.code} initial={{opacity:0,scale:0.95}} animate={inView?{opacity:1,scale:1}:{}}
              transition={{delay:i*0.05}}
              style={{position:"relative",padding:14,
                border:`1px solid ${c.star?`${col}66`:T.border}`,
                background:c.star?`${col}07`:T.surface,transition:"all 0.25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.boxShadow=`0 0 16px ${col}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=c.star?`${col}66`:T.border;e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:col,fontSize:18,flexShrink:0}}>{c.icon}</span>
                  <div>
                    <p className="gsk" style={{fontSize:12,fontWeight:600,color:T.text,margin:0,lineHeight:1.3}}>{c.name}</p>
                    <p className="mono" style={{fontSize:9,color:T.textMid,margin:"3px 0 0"}}>{c.issuer} · {c.date}</p>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0,marginLeft:8}}>
                  <span className="mono" style={{fontSize:9,padding:"2px 6px",border:`1px solid ${col}55`,color:col,background:`${col}0d`}}>{c.code}</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <StatusDot color={T.green} pulse={false} size={6} />
                    <span className="mono" style={{fontSize:9,color:T.green}}>ACTIVE</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                <Badge team={c.team} />
                {c.id&&<span className="mono" style={{fontSize:8,color:T.textLow}}>ID: {c.id}</span>}
                {c.star&&<span className="mono" style={{fontSize:9,color:T.amber}}>★ KEY</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SKILL_GROUPS=[
  { title:"SOC / Blue Team",team:"blue",
    skills:[
      {name:"SIEM Tools & Log Analysis",level:75},
      {name:"Threat Detection & Alert Triage",level:78},
      {name:"Incident Response",level:82},
      {name:"Network Security Monitoring",level:74},
      {name:"IDS/IPS & Intrusion Detection",level:70},
      {name:"TCP/IP & Network Traffic Analysis",level:76},
    ]},
  { title:"Red Team / Pentesting",team:"red",
    skills:[
      {name:"Nmap / Port Scanning",level:82},
      {name:"Burp Suite / Web App Testing",level:72},
      {name:"Metasploit",level:65},
      {name:"OWASP Top 10",level:75},
      {name:"Reconnaissance & OSINT",level:84},
      {name:"Vulnerability Assessment",level:74},
    ]},
  { title:"Shared / Cross-discipline",team:"purple",
    skills:[
      {name:"Python (Security Automation)",level:68},
      {name:"Bash Scripting",level:70},
      {name:"SQL",level:60},
      {name:"Kali Linux / Linux Admin",level:78},
      {name:"Risk Management",level:92},
      {name:"Team Leadership",level:95},
    ]},
];

const TOOLS=[
  {name:"Kali Linux",team:"red"},{name:"Python",team:"purple"},{name:"Nmap",team:"red"},
  {name:"Metasploit",team:"red"},{name:"Burp Suite",team:"red"},{name:"Wireshark",team:"blue"},
  {name:"SIEM",team:"blue"},{name:"SQL",team:"purple"},{name:"Bash",team:"purple"},
  {name:"YARA",team:"blue"},{name:"Sigma",team:"blue"},{name:"OSINT",team:"purple"},
  {name:"MITRE ATT&CK",team:"blue"},{name:"Threat Intel",team:"blue"},{name:"Subfinder",team:"red"},
];

function Skills() {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-60px"});
  return (
    <section id="skills" style={{padding:"80px clamp(20px,5vw,56px)"}} ref={ref}>
      <SectionHead tag="CAPABILITY.MATRIX" title="Skills & Stack" accent={T.purple} />
      <TeamLegend />

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,maxWidth:980,marginBottom:32}}>
        {SKILL_GROUPS.map(g=>{
          const col=teamColor[g.team];
          return (
            <div key={g.team} style={{border:`1px solid ${col}33`,background:T.surface,padding:20}}>
              <div style={{marginBottom:18}}><Badge team={g.team} label={g.title.toUpperCase()} /></div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {g.skills.map((s,i)=>(
                  <div key={s.name}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span className="mono" style={{fontSize:10,color:T.textMid}}>{s.name}</span>
                      <span className="mono" style={{fontSize:10,fontWeight:500,color:col}}>{s.level}%</span>
                    </div>
                    <div style={{height:3,background:T.surfaceAlt,border:`1px solid ${T.border}`,position:"relative"}}>
                      <motion.div initial={{width:0}} animate={inView?{width:`${s.level}%`}:{}}
                        transition={{duration:1.1,delay:i*0.07+0.2,ease:"easeOut"}}
                        style={{position:"absolute",top:0,left:0,height:"100%",background:col}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mono" style={{fontSize:10,letterSpacing:"0.3em",color:T.textLow,marginBottom:14}}>[ TOOL_SUITE ]</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,maxWidth:980,marginBottom:32}}>
        {TOOLS.map((t,i)=>{
          const col=teamColor[t.team];
          return (
            <motion.span key={t.name} initial={{opacity:0,scale:0.9}} animate={inView?{opacity:1,scale:1}:{}}
              transition={{delay:i*0.04}} className="mono"
              style={{fontSize:10,padding:"5px 12px",border:`1px solid ${T.border}`,color:T.textMid,background:T.surface,cursor:"default",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.color=col;e.currentTarget.style.boxShadow=`0 0 12px ${col}33`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid;e.currentTarget.style.boxShadow="none";}}>
              {t.name}
            </motion.span>
          );
        })}
      </div>

      <p className="mono" style={{fontSize:10,letterSpacing:"0.3em",color:T.textLow,marginBottom:14}}>[ COMMUNICATION_PROTOCOLS ]</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",maxWidth:980}}>
        {[
          {lang:"Español",code:"ES",level:100,label:"Native",              color:T.blue},
          {lang:"English", code:"EN",level:88, label:"Fluent (B1 Certified)",color:T.purple},
          {lang:"Dansk",   code:"DA",level:45, label:"Basic",              color:T.red},
        ].map(l=>(
          <div key={l.lang} style={{padding:14,border:`1px solid ${l.color}33`,background:T.surface,minWidth:180,flex:"1 1 180px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span className="mono" style={{fontSize:10,fontWeight:700,padding:"2px 6px",border:`1px solid ${l.color}55`,color:l.color,background:`${l.color}0d`}}>{l.code}</span>
                <span className="gsk" style={{fontSize:13,fontWeight:500,color:T.text}}>{l.lang}</span>
              </div>
              <span className="mono" style={{fontSize:9,color:T.textLow}}>{l.label}</span>
            </div>
            <div style={{height:3,background:T.surfaceAlt}}>
              <motion.div initial={{width:0}} animate={inView?{width:`${l.level}%`}:{}}
                transition={{duration:1.0,delay:0.3,ease:"easeOut"}}
                style={{height:"100%",background:l.color}} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [msg,setMsg]=useState(""); const [sent,setSent]=useState(false);
  const submit=e=>{ e.preventDefault(); if(name&&email&&msg) setSent(true); };
  const inp={ width:"100%",padding:"10px 12px",background:T.surface,
    border:`1px solid ${T.border}`,color:T.text,fontFamily:"JetBrains Mono,monospace",
    fontSize:11,outline:"none",transition:"border-color 0.2s",caretColor:T.blue };
  return (
    <section id="contact" style={{padding:"80px clamp(20px,5vw,56px)"}}>
      <SectionHead tag="COMMS.CHANNEL" title="Open a Channel" accent={T.blue} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:40,maxWidth:780}}>
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {label:"IDENTIFIER",  placeholder:"Your name",    val:name, set:setName, type:"text"},
                {label:"COMM_CHANNEL",placeholder:"Email address",val:email,set:setEmail,type:"email"},
              ].map(f=>(
                <div key={f.label}>
                  <label className="mono" style={{fontSize:10,letterSpacing:"0.25em",color:T.textLow,display:"block",marginBottom:6}}>▸ {f.label}</label>
                  <input type={f.type} required value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder}
                    style={inp} onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border} />
                </div>
              ))}
              <div>
                <label className="mono" style={{fontSize:10,letterSpacing:"0.25em",color:T.textLow,display:"block",marginBottom:6}}>▸ TRANSMISSION</label>
                <textarea required rows={4} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Your message..."
                  style={{...inp,resize:"none"}} onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
              <SecBtn href="#" color={T.blue}><span onClick={submit}>SEND_TRANSMISSION</span></SecBtn>
            </motion.form>
          ) : (
            <motion.div key="confirm" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              style={{position:"relative",padding:24,border:`1px solid ${T.blue}55`,background:`${T.blue}08`}}>
              <Brackets color={T.blue} />
              <div className="mono" style={{fontSize:12,display:"flex",flexDirection:"column",gap:6}}>
                <div style={{color:T.green}}>✓ TRANSMISSION RECEIVED</div>
                <div style={{color:T.textMid}}>FROM: <span style={{color:T.text}}>{name}</span></div>
                <div style={{color:T.textMid}}>CHANNEL: <span style={{color:T.blue}}>{email}</span></div>
                <div style={{color:T.textMid}}>RESPONSE_ETA: <span style={{color:T.amber}}>24H</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <p className="mono" style={{fontSize:10,letterSpacing:"0.3em",color:T.textLow,marginBottom:4}}>[ CONNECT ]</p>
          {[
            {label:"GitHub",  href:"https://github.com/jorge-ruso",color:T.blue},
            {label:"LinkedIn",href:"https://linkedin.com/in/jorge-campos-bellido-51a549330",color:T.blue},
            {label:"FastRecon Automator",href:"https://github.com/jorge-ruso/FastRecon-Automator",color:T.red},
            {label:"BRICKSTORM Analysis",href:"https://github.com/jorge-ruso/brickstorm-malware-analysis",color:T.purple},
          ].map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="mono"
              style={{fontSize:11,letterSpacing:"0.12em",color:T.textLow,textDecoration:"none",transition:"color 0.2s",display:"flex",alignItems:"center",gap:8}}
              onMouseEnter={e=>e.currentTarget.style.color=s.color}
              onMouseLeave={e=>e.currentTarget.style.color=T.textLow}>
              <span style={{color:s.color}}>›</span>/{s.label.toUpperCase().replace(/ /g,"_")}
            </a>
          ))}
          <div style={{marginTop:16,padding:16,border:`1px solid ${T.border}`,background:T.surface}}>
            <p className="mono" style={{fontSize:9,color:T.textLow,marginBottom:6}}>DIRECT CONTACT</p>
            <a href="mailto:jorgecamposbellido@gmail.com" className="mono"
              style={{fontSize:11,color:T.blue,textDecoration:"none"}}>
              jorgecamposbellido@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{padding:"24px clamp(20px,5vw,56px)",borderTop:`1px solid ${T.border}`,
      display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
      <span className="mono" style={{fontSize:10,color:T.textLow}}>© 2026 JORGE_CAMPOS_BELLIDO — ALL RIGHTS RESERVED</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <StatusDot color={T.green} />
        <span className="mono" style={{fontSize:10,color:T.textLow}}>SYSTEMS OPERATIONAL // Copenhagen, DK</span>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{background:T.bg,color:T.text,fontFamily:"Space Grotesk, sans-serif"}}>
      <style>{GLOBAL_CSS}</style>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Certifications />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
