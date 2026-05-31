import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#020408",
  surface: "#060d18",
  panel: "#0a1628",
  border: "#1a3a5c",
  neon: "#00f5ff",
  neonGlow: "#00c8d7",
  gold: "#ffd700",
  orange: "#ff6b00",
  red: "#ff2244",
  green: "#00ff88",
  purple: "#bf00ff",
  text: "#e8f4ff",
  muted: "#4a7a9b",
};

const style = (css) => css;

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.neon}; border-radius: 2px; }

  @keyframes pulse-neon {
    0%, 100% { box-shadow: 0 0 5px ${COLORS.neon}, 0 0 10px ${COLORS.neon}44; }
    50% { box-shadow: 0 0 15px ${COLORS.neon}, 0 0 30px ${COLORS.neon}88, 0 0 45px ${COLORS.neon}44; }
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes data-stream {
    0% { opacity: 0; transform: translateY(-10px); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: translateY(10px); }
  }

  @keyframes glitch {
    0%, 90%, 100% { clip-path: none; transform: none; }
    92% { clip-path: inset(20% 0 50% 0); transform: translateX(-5px); }
    94% { clip-path: inset(50% 0 20% 0); transform: translateX(5px); }
    96% { clip-path: inset(10% 0 70% 0); transform: translateX(-3px); }
  }

  @keyframes particle-rise {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-80px) scale(0); opacity: 0; }
  }

  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .neon-pulse { animation: pulse-neon 2s ease-in-out infinite; }
  .float-anim { animation: float 3s ease-in-out infinite; }
  .glitch-anim { animation: glitch 5s infinite; }
  .fade-in-up { animation: fadeInUp 0.4s ease forwards; }
`;

// ── Particles background
function ParticlesBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.7 ? "#00f5ff" : Math.random() > 0.5 ? "#ffd700" : "#bf00ff",
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

// ── HexGrid decoration
function HexGrid() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke="#00f5ff" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

// ── Neon button
function NeonBtn({ children, color = COLORS.neon, onClick, size = "md", variant = "outline", style: s = {} }) {
  const [hover, setHover] = useState(false);
  const pad = size === "lg" ? "14px 36px" : size === "sm" ? "6px 16px" : "10px 24px";
  const fs = size === "lg" ? 17 : size === "sm" ? 13 : 15;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: pad,
        fontSize: fs,
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 700,
        letterSpacing: "1.5px",
        color: variant === "fill" ? "#000" : color,
        background: variant === "fill" ? color : hover ? color + "22" : "transparent",
        border: `1.5px solid ${color}`,
        borderRadius: 4,
        cursor: "pointer",
        transition: "all 0.2s",
        textTransform: "uppercase",
        boxShadow: hover ? `0 0 16px ${color}88, 0 0 32px ${color}44` : `0 0 6px ${color}44`,
        ...s,
      }}
    >
      {children}
    </button>
  );
}

// ── Section card
function Panel({ children, style: s = {}, glow = COLORS.neon }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.panel}ee, ${COLORS.surface}cc)`,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 24,
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 4px 32px #000a, inset 0 1px 0 ${glow}22`,
      ...s,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />
      {children}
    </div>
  );
}

// ── Section heading
function Heading({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 28, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 26, fontWeight: 900, color: COLORS.neon, letterSpacing: 3, textTransform: "uppercase", textShadow: `0 0 20px ${COLORS.neon}88` }}>{title}</h2>
      {sub && <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 6, letterSpacing: 1 }}>{sub}</p>}
    </div>
  );
}

// ── Badge
function Badge({ label, color = COLORS.neon }) {
  return (
    <span style={{ padding: "3px 10px", border: `1px solid ${color}`, borderRadius: 20, fontSize: 11, color, fontFamily: "'Share Tech Mono'", letterSpacing: 1 }}>{label}</span>
  );
}

// ─────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────

function HomeScreen() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 80);
    return () => clearInterval(t);
  }, []);
  const bars = "▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮";
  const animated = bars.slice(0, (tick % 20));
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "40px 20px", textAlign: "center" }}>
      <ParticlesBG />
      <HexGrid />

      {/* Scanline */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.neon}66, transparent)`, animation: "scanline 4s linear infinite", pointerEvents: "none", zIndex: 999 }} />

      {/* Logo */}
      <div className="float-anim" style={{ marginBottom: 12, position: "relative" }}>
        <div style={{ width: 100, height: 100, margin: "0 auto 16px", position: "relative" }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 12px ${COLORS.neon})` }}>
            <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill={COLORS.panel} stroke={COLORS.neon} strokeWidth="2" />
            <polygon points="50,18 82,34 82,66 50,82 18,66 18,34" fill="none" stroke={COLORS.neon + "44"} strokeWidth="1" />
            <text x="50" y="58" textAnchor="middle" fontFamily="Orbitron" fontWeight="900" fontSize="28" fill={COLORS.neon}>BX</text>
            <line x1="30" y1="36" x2="70" y2="36" stroke={COLORS.orange} strokeWidth="1.5" />
            <line x1="30" y1="64" x2="70" y2="64" stroke={COLORS.orange} strokeWidth="1.5" />
          </svg>
          {/* Orbiting ring */}
          <div style={{ position: "absolute", inset: -10, border: `1px solid ${COLORS.neon}44`, borderRadius: "50%", animation: "rotate-slow 8s linear infinite" }}>
            <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: COLORS.neon, boxShadow: `0 0 8px ${COLORS.neon}` }} />
          </div>
        </div>
      </div>

      <h1 className="glitch-anim" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(36px, 8vw, 72px)", fontWeight: 900, letterSpacing: 6, lineHeight: 1, background: `linear-gradient(135deg, ${COLORS.neon}, ${COLORS.gold}, ${COLORS.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "none", marginBottom: 8 }}>
        BATTLEX
      </h1>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(14px, 3vw, 22px)", fontWeight: 400, letterSpacing: 12, color: COLORS.muted, marginBottom: 32, textTransform: "uppercase" }}>
        LEGENDS
      </h2>

      <p style={{ fontFamily: "'Share Tech Mono'", color: COLORS.neon + "88", fontSize: 12, letterSpacing: 2, marginBottom: 40 }}>
        INITIALIZING BATTLEZONE... [{animated}<span style={{ opacity: tick % 2 === 0 ? 1 : 0 }}>|</span>]
      </p>

      {/* Mode cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, maxWidth: 720, width: "100%", marginBottom: 36 }}>
        {[
          { label: "SOLO", icon: "⚔️", color: COLORS.neon, players: "1v49" },
          { label: "DUO", icon: "🤝", color: COLORS.purple, players: "2v48" },
          { label: "SQUAD", icon: "🛡️", color: COLORS.orange, players: "4v46" },
          { label: "RANKED", icon: "🏆", color: COLORS.gold, players: "50 PLAYERS" },
        ].map((m) => (
          <ModeCard key={m.label} {...m} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <NeonBtn size="lg" color={COLORS.neon} variant="fill">PLAY NOW</NeonBtn>
        <NeonBtn size="lg" color={COLORS.orange}>TOURNAMENT</NeonBtn>
      </div>

      {/* Live stats bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: `${COLORS.surface}ee`, borderTop: `1px solid ${COLORS.border}`, padding: "8px 20px", display: "flex", justifyContent: "space-around", fontSize: 12, fontFamily: "'Share Tech Mono'", backdropFilter: "blur(10px)", zIndex: 100 }}>
        {[["🟢 ONLINE", "128,491"], ["🏆 IN-MATCH", "4,203"], ["⚡ SERVER", "ASIA-01"], ["📶 PING", "22ms"]].map(([l, v]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1 }}>{l}</div>
            <div style={{ color: COLORS.neon, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeCard({ label, icon, color, players }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? color + "18" : COLORS.panel, border: `1px solid ${h ? color : COLORS.border}`, borderRadius: 10, padding: "18px 12px", cursor: "pointer", transition: "all 0.25s", boxShadow: h ? `0 0 20px ${color}44` : "none", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, color, letterSpacing: 2 }}>{label}</div>
      <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4, fontFamily: "'Share Tech Mono'" }}>{players}</div>
    </div>
  );
}

// ── HEROES SCREEN
const HEROES = [
  { name: "VEXON", role: "ASSAULT", ability: "Plasma Shield", passive: "Armor Boost +15%", color: COLORS.neon, rarity: "LEGENDARY", emoji: "🤖", desc: "A cybernetic soldier engineered for frontline warfare. His nano-armor regenerates under heavy fire." },
  { name: "SHADE", role: "STEALTH", ability: "Shadow Cloak", passive: "Movement +25%", color: COLORS.purple, rarity: "EPIC", emoji: "🥷", desc: "A ghost operative trained in urban camouflage. She vanishes into darkness and strikes unseen." },
  { name: "BLAZE", role: "SUPPORT", ability: "Medic Drone", passive: "Heal +20%", color: COLORS.orange, rarity: "RARE", emoji: "🔥", desc: "Ex-military medic turned battlefield engineer. His drone can revive downed allies mid-combat." },
  { name: "VOLT", role: "TECH", ability: "EMP Burst", passive: "Hack Radius +30%", color: COLORS.gold, rarity: "LEGENDARY", emoji: "⚡", desc: "A rogue AI hacker with neural implants. Can disable enemy vehicles and expose cloaked opponents." },
  { name: "KIRA", role: "SNIPER", ability: "Eagle Vision", passive: "Accuracy +40%", color: COLORS.green, rarity: "EPIC", emoji: "🎯", desc: "Former Olympic marksman turned mercenary. She spots enemies through walls with her bionic eye." },
  { name: "TITAN", role: "TANK", ability: "Ground Slam", passive: "HP +25%", color: COLORS.red, rarity: "RARE", emoji: "💪", desc: "A hulking juggernaut built for close quarters. His seismic slam knocks back entire squads." },
];

function HeroesScreen() {
  const [sel, setSel] = useState(0);
  const hero = HEROES[sel];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="⚔️" title="HERO ROSTER" sub="SELECT YOUR LEGEND — EACH HERO CHANGES THE BATTLEFIELD" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 28 }}>
        {HEROES.map((h, i) => (
          <div key={h.name} onClick={() => setSel(i)} style={{ background: sel === i ? h.color + "22" : COLORS.panel, border: `1.5px solid ${sel === i ? h.color : COLORS.border}`, borderRadius: 10, padding: "14px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", boxShadow: sel === i ? `0 0 16px ${h.color}66` : "none" }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>{h.emoji}</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: h.color, letterSpacing: 1 }}>{h.name}</div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 3 }}>{h.role}</div>
          </div>
        ))}
      </div>
      {/* Detail panel */}
      <Panel glow={hero.color} style={{ animation: "fadeInUp 0.3s ease" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ textAlign: "center", minWidth: 100 }}>
            <div style={{ fontSize: 64, lineHeight: 1, filter: `drop-shadow(0 0 12px ${hero.color})` }}>{hero.emoji}</div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <Badge label={hero.rarity} color={hero.color} />
              <Badge label={hero.role} color={COLORS.muted} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, color: hero.color, fontWeight: 900, letterSpacing: 3, textShadow: `0 0 16px ${hero.color}88` }}>{hero.name}</h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: "10px 0 16px", lineHeight: 1.6 }}>{hero.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["⚡ ACTIVE ABILITY", hero.ability], ["🛡️ PASSIVE", hero.passive]].map(([l, v]) => (
                <div key={l} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, fontFamily: "'Share Tech Mono'" }}>{l}</div>
                  <div style={{ color: hero.color, fontWeight: 600, fontSize: 14, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <NeonBtn color={hero.color} variant="fill">SELECT HERO</NeonBtn>
              <NeonBtn color={hero.color}>UPGRADE</NeonBtn>
            </div>
          </div>
          <div style={{ minWidth: 140 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, marginBottom: 10, fontFamily: "'Share Tech Mono'" }}>BASE STATS</div>
            {[["HP", 80], ["SPEED", 65], ["ARMOR", 70], ["ATTACK", 75], ["SPECIAL", 90]].map(([stat, val]) => (
              <div key={stat} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: COLORS.muted }}>{stat}</span>
                  <span style={{ color: hero.color, fontFamily: "'Share Tech Mono'" }}>{val}</span>
                </div>
                <div style={{ height: 4, background: COLORS.bg, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${val}%`, background: `linear-gradient(90deg, ${hero.color}88, ${hero.color})`, borderRadius: 2, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── MAP SCREEN
const ZONES = [
  { id: "city", label: "NEO CITY", x: 35, y: 22, size: 18, color: COLORS.neon, type: "URBAN", risk: "HIGH" },
  { id: "forest", label: "DARK GROVE", x: 68, y: 38, size: 14, color: COLORS.green, type: "FOREST", risk: "MEDIUM" },
  { id: "desert", label: "SOLAR WASTES", x: 20, y: 62, size: 16, color: COLORS.orange, type: "DESERT", risk: "LOW" },
  { id: "lab", label: "APEX LAB ★", x: 55, y: 58, size: 10, color: COLORS.gold, type: "SECRET", risk: "EXTREME" },
  { id: "port", label: "DEAD PORT", x: 80, y: 72, size: 12, color: COLORS.purple, type: "COASTAL", risk: "HIGH" },
];

function MapScreen() {
  const [sel, setSel] = useState(null);
  const zone = ZONES.find((z) => z.id === sel);
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🗺️" title="BATTLEZONE MAP" sub="FUTURISTIC OPEN WORLD — 8KM² PLAYABLE AREA" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Map viewport */}
        <div style={{ flex: 2, minWidth: 280, position: "relative", aspectRatio: "16/10", background: `radial-gradient(ellipse at 50% 50%, #0a2040, ${COLORS.bg})`, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", cursor: "crosshair" }}>
          {/* Grid */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.neon} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Terrain blobs */}
          {[
            { cx: "35%", cy: "22%", rx: "12%", ry: "8%", fill: COLORS.neon + "11" },
            { cx: "68%", cy: "38%", rx: "10%", ry: "7%", fill: COLORS.green + "11" },
            { cx: "20%", cy: "62%", rx: "14%", ry: "9%", fill: COLORS.orange + "11" },
            { cx: "55%", cy: "58%", rx: "8%", ry: "6%", fill: COLORS.gold + "18" },
            { cx: "80%", cy: "72%", rx: "10%", ry: "7%", fill: COLORS.purple + "11" },
          ].map((e, i) => (
            <div key={i} style={{ position: "absolute", left: e.cx, top: e.cy, transform: "translate(-50%,-50%)", width: e.rx, paddingTop: e.ry, background: e.fill, borderRadius: "50%", filter: "blur(16px)" }} />
          ))}
          {/* Zone markers */}
          {ZONES.map((z) => (
            <div key={z.id} onClick={() => setSel(z.id === sel ? null : z.id)} style={{ position: "absolute", left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 10, textAlign: "center" }}>
              <div style={{ width: z.size, height: z.size, borderRadius: "50%", background: z.color, boxShadow: `0 0 12px ${z.color}, 0 0 24px ${z.color}66`, animation: sel === z.id ? "pulse-neon 1s infinite" : "none", border: sel === z.id ? `2px solid #fff` : "none" }} />
              <div style={{ color: z.color, fontSize: 9, fontFamily: "'Share Tech Mono'", whiteSpace: "nowrap", marginTop: 4, textShadow: `0 0 6px ${z.color}` }}>{z.label}</div>
            </div>
          ))}
          {/* Safe zone circle */}
          <div style={{ position: "absolute", left: "48%", top: "45%", transform: "translate(-50%,-50%)", width: "55%", aspectRatio: "1", border: `1px dashed ${COLORS.neon}44`, borderRadius: "50%", pointerEvents: "none" }} />
          {/* Compass */}
          <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "'Share Tech Mono'", fontSize: 10, color: COLORS.neon, textAlign: "center", lineHeight: 1.4 }}>
            <div>N</div><div style={{ color: COLORS.muted, fontSize: 8 }}>◆</div><div>S</div>
          </div>
          {/* Weather */}
          <div style={{ position: "absolute", top: 12, left: 12, background: COLORS.panel + "cc", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 10, fontFamily: "'Share Tech Mono'", color: COLORS.neon }}>
            🌩️ STORM — 03:42
          </div>
        </div>
        {/* Zone detail */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {zone ? (
            <Panel glow={zone.color} style={{ height: "100%" }}>
              <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, fontFamily: "'Share Tech Mono'", marginBottom: 8 }}>ZONE INTEL</div>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, color: zone.color, letterSpacing: 2 }}>{zone.label}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <Badge label={zone.type} color={zone.color} />
                <Badge label={`RISK: ${zone.risk}`} color={zone.risk === "EXTREME" ? COLORS.red : zone.risk === "HIGH" ? COLORS.orange : COLORS.green} />
              </div>
              <div style={{ marginTop: 16 }}>
                {[["LOOT TIER", "S-RANK"], ["ENEMIES", zone.risk === "EXTREME" ? "12-18" : "4-10"], ["VEHICLES", zone.type === "SECRET" ? "NONE" : "2-4"], ["COVER", zone.type === "URBAN" ? "EXCELLENT" : "MODERATE"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                    <span style={{ color: COLORS.muted }}>{k}</span>
                    <span style={{ color: zone.color, fontFamily: "'Share Tech Mono'" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}><NeonBtn color={zone.color} variant="fill" size="sm">DROP HERE</NeonBtn></div>
            </Panel>
          ) : (
            <Panel style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontSize: 40, opacity: 0.3 }}>🎯</div>
              <p style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", fontFamily: "'Share Tech Mono'" }}>CLICK A ZONE<br />FOR INTEL</p>
              <div style={{ marginTop: 8 }}>
                {ZONES.map((z) => (
                  <div key={z.id} onClick={() => setSel(z.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, boxShadow: `0 0 6px ${z.color}` }} />
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{z.label}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ── WEAPONS SCREEN
const WEAPONS = [
  { name: "VORTEX AR", type: "ASSAULT RIFLE", damage: 88, rate: 75, range: 70, ammo: "5.56mm", rarity: "LEGENDARY", icon: "🔫", color: COLORS.neon },
  { name: "PHANTOM SR", type: "SNIPER RIFLE", damage: 98, rate: 20, range: 99, ammo: ".50 CAL", rarity: "EPIC", icon: "🎯", color: COLORS.gold },
  { name: "STORM SMG", type: "SUBMACHINE", damage: 60, rate: 95, range: 40, ammo: "9mm", rarity: "RARE", icon: "💥", color: COLORS.orange },
  { name: "NOVA SHOTGUN", type: "SHOTGUN", damage: 95, rate: 15, range: 25, ammo: "12G", rarity: "EPIC", icon: "⚡", color: COLORS.purple },
];

function WeaponsScreen() {
  const [sel, setSel] = useState(0);
  const w = WEAPONS[sel];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🔫" title="ARMORY" sub="ADVANCED WEAPON SYSTEM WITH UPGRADES & ATTACHMENTS" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200, flex: 1 }}>
          {WEAPONS.map((wp, i) => (
            <div key={wp.name} onClick={() => setSel(i)} style={{ background: sel === i ? wp.color + "18" : COLORS.panel, border: `1.5px solid ${sel === i ? wp.color : COLORS.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28 }}>{wp.icon}</div>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: sel === i ? wp.color : COLORS.text, fontWeight: 700 }}>{wp.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{wp.type}</div>
              </div>
              <Badge label={wp.rarity} color={wp.color} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
        {/* Detail */}
        <Panel style={{ flex: 2, minWidth: 260 }} glow={w.color}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 60, filter: `drop-shadow(0 0 12px ${w.color})` }}>{w.icon}</div>
            <div>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: w.color, letterSpacing: 3 }}>{w.name}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Badge label={w.rarity} color={w.color} />
                <Badge label={w.type} color={COLORS.muted} />
                <Badge label={`AMMO: ${w.ammo}`} color={COLORS.muted} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            {[["DAMAGE", w.damage], ["FIRE RATE", w.rate], ["RANGE", w.range], ["ACCURACY", Math.round((w.damage + w.range) / 2)]].map(([s, v]) => (
              <div key={s} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.muted, letterSpacing: 1 }}>{s}</span>
                  <span style={{ color: w.color, fontFamily: "'Share Tech Mono'" }}>{v}/100</span>
                </div>
                <div style={{ height: 6, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${v}%`, background: `linear-gradient(90deg, ${w.color}66, ${w.color})`, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, marginBottom: 12, fontFamily: "'Share Tech Mono'" }}>ATTACHMENTS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {["SCOPE X4", "SUPPRESSOR", "EXTENDED MAG", "GRIP TAPE", "LASER SIGHT"].map((att) => (
              <div key={att} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 10px", fontSize: 11, color: COLORS.muted, fontFamily: "'Share Tech Mono'", cursor: "pointer" }}>{att}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <NeonBtn color={w.color} variant="fill">EQUIP</NeonBtn>
            <NeonBtn color={w.color}>UPGRADE ⬆</NeonBtn>
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ── PROGRESSION SCREEN
function ProgressionScreen() {
  const [pass, setPass] = useState("PREMIUM");
  const tiers = [
    { tier: 1, free: "1000 XP", premium: "2000 XP + SKIN", unlocked: true },
    { tier: 5, free: "WEAPON SKIN", premium: "LEGENDARY OUTFIT", unlocked: true },
    { tier: 10, free: "3000 COINS", premium: "HERO: SHADE", unlocked: false },
    { tier: 20, free: "EMOTE", premium: "VEHICLE SKIN", unlocked: false },
    { tier: 50, free: "EPIC CRATE", premium: "EXCLUSIVE HERO", unlocked: false },
    { tier: 100, free: "10,000 COINS", premium: "GRAND MASTER SET", unlocked: false },
  ];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🏆" title="BATTLE PASS" sub="SEASON 4: NEON UPRISING — 100 TIERS OF REWARDS" />

      {/* XP bar */}
      <Panel style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: COLORS.gold }}>SEASON LEVEL 34</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>14,250 / 20,000 XP to next level</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Share Tech Mono'", color: COLORS.neon, fontSize: 12 }}>RANK: PLATINUM II</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Top 12% of players</div>
          </div>
        </div>
        <div style={{ height: 12, background: COLORS.bg, borderRadius: 6, overflow: "hidden", position: "relative" }}>
          <div style={{ height: "100%", width: "71%", background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.neon})`, borderRadius: 6 }} />
          <div style={{ position: "absolute", right: "29%", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, borderRadius: "50%", background: COLORS.neon, boxShadow: `0 0 10px ${COLORS.neon}`, marginTop: 0, marginLeft: -8 }} />
        </div>
      </Panel>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {["FREE", "PREMIUM"].map((p) => (
          <NeonBtn key={p} size="sm" color={p === "PREMIUM" ? COLORS.gold : COLORS.muted} variant={pass === p ? "fill" : "outline"} onClick={() => setPass(p)}>{p} TRACK</NeonBtn>
        ))}
      </div>

      {/* Tiers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {tiers.map((t) => (
          <div key={t.tier} style={{ background: t.unlocked ? (pass === "PREMIUM" ? COLORS.gold + "18" : COLORS.neon + "12") : COLORS.panel, border: `1.5px solid ${t.unlocked ? (pass === "PREMIUM" ? COLORS.gold : COLORS.neon) : COLORS.border}`, borderRadius: 10, padding: "14px 12px", textAlign: "center", position: "relative" }}>
            {t.unlocked && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 12 }}>✅</div>}
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>TIER {t.tier}</div>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{pass === "PREMIUM" ? "💎" : "🎁"}</div>
            <div style={{ fontSize: 12, color: pass === "PREMIUM" ? COLORS.gold : COLORS.neon, fontWeight: 600 }}>{pass === "PREMIUM" ? t.premium : t.free}</div>
          </div>
        ))}
      </div>

      {/* Missions */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: COLORS.neon, letterSpacing: 2, marginBottom: 14 }}>DAILY MISSIONS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Deal 500 damage in a match", xp: 500, prog: 320, max: 500, color: COLORS.orange },
            { label: "Land 10 headshots", xp: 800, prog: 7, max: 10, color: COLORS.neon },
            { label: "Win 1 Ranked match", xp: 2000, prog: 0, max: 1, color: COLORS.gold },
            { label: "Use hero ability 5 times", xp: 400, prog: 5, max: 5, color: COLORS.green },
          ].map((m) => (
            <Panel key={m.label} style={{ padding: "12px 16px" }} glow={m.color}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: COLORS.text }}>{m.label}</span>
                <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, color: m.color }}>+{m.xp} XP</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 5, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(m.prog / m.max) * 100}%`, background: m.prog === m.max ? COLORS.green : m.color, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
                <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, color: m.prog === m.max ? COLORS.green : COLORS.muted, whiteSpace: "nowrap" }}>{m.prog}/{m.max}</span>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ARCHITECTURE SCREEN
function ArchScreen() {
  const layers = [
    {
      title: "🎮 CLIENT LAYER (Android / Unity)",
      color: COLORS.neon,
      items: ["Unity 2023 LTS — Main game engine", "URP (Universal Render Pipeline) for mobile optimization", "C# game logic, shaders, VFX Graph", "Flutter companion app (stats, store, social)", "Addressable Assets for dynamic content loading"],
    },
    {
      title: "⚡ REAL-TIME GAME SERVERS",
      color: COLORS.orange,
      items: ["Photon Fusion 2 — authoritative server-side rollback netcode", "Dedicated game servers — AWS EC2 G4 (GPU) instances", "WebSocket connections with custom binary protocol", "Anti-cheat: server-side validation + Easy Anti-Cheat SDK", "Region-based matchmaking (Asia, EU, NA, LATAM)"],
    },
    {
      title: "🗄️ BACKEND SERVICES",
      color: COLORS.purple,
      items: ["Node.js + TypeScript microservices on Kubernetes", "PostgreSQL — player profiles, stats, inventory", "Redis — session cache, leaderboards, realtime data", "MongoDB — game events, logs, telemetry", "Firebase Auth — secure login + cloud save sync"],
    },
    {
      title: "🌐 INFRASTRUCTURE & CDN",
      color: COLORS.gold,
      items: ["AWS CloudFront CDN — global asset delivery", "S3 — asset bundles, game builds, media", "Cloudflare DDoS protection + WAF", "CI/CD: GitHub Actions → Unity Cloud Build → Google Play", "DataDog + Grafana — monitoring and alerting"],
    },
    {
      title: "💰 MONETIZATION ENGINE",
      color: COLORS.green,
      items: ["Google Play Billing — IAP coins, gems, battle pass", "Battle Pass: ₹599/season (100 tiers)", "Cosmetic shop: skins, emotes, vehicles (no pay-to-win)", "Season bundles & limited-time event crates", "Rewarded ads (optional, for free players)"],
    },
  ];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🏗️" title="GAME ARCHITECTURE" sub="FULL-STACK TECHNICAL BLUEPRINT" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {layers.map((layer, i) => (
          <Panel key={i} glow={layer.color}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: layer.color, letterSpacing: 2, marginBottom: 14 }}>{layer.title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
              {layer.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: layer.color, flexShrink: 0, marginTop: 6, boxShadow: `0 0 6px ${layer.color}` }} />
                  <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ── DB SCREEN
function DBScreen() {
  const schemas = [
    {
      name: "players", color: COLORS.neon,
      fields: ["player_id UUID PK", "username VARCHAR(32)", "email ENCRYPTED", "level INT", "xp BIGINT", "coins INT", "gems INT", "rank_points INT", "hero_id FK", "created_at TIMESTAMP"],
    },
    {
      name: "matches", color: COLORS.orange,
      fields: ["match_id UUID PK", "mode ENUM(solo,duo,squad,ranked)", "map_id FK", "started_at TIMESTAMP", "ended_at TIMESTAMP", "weather_state JSON", "zone_config JSON", "winner_team_id FK"],
    },
    {
      name: "player_stats", color: COLORS.purple,
      fields: ["stat_id UUID PK", "player_id FK", "match_id FK", "kills INT", "damage INT", "assists INT", "placement INT", "survival_time INT", "hero_used FK", "xp_earned INT"],
    },
    {
      name: "inventory", color: COLORS.gold,
      fields: ["item_id UUID PK", "player_id FK", "item_type ENUM", "rarity ENUM", "equipped BOOL", "acquired_at TIMESTAMP", "skin_data JSONB"],
    },
  ];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🗃️" title="DATABASE SCHEMA" sub="POSTGRESQL — OPTIMIZED FOR HIGH-CONCURRENCY GAMING" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {schemas.map((s) => (
          <Panel key={s.name} glow={s.color}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: s.color, letterSpacing: 2, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>TABLE:</span><span>{s.name.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11 }}>
              {s.fields.map((f, i) => {
                const [name, ...rest] = f.split(" ");
                return (
                  <div key={i} style={{ padding: "5px 0", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: s.color }}>{name}</span>
                    <span style={{ color: COLORS.muted }}>{rest.join(" ")}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ── ROADMAP SCREEN
function RoadmapScreen() {
  const phases = [
    {
      phase: "PHASE 1", label: "PROTOTYPE", duration: "0-3 Months", color: COLORS.neon,
      tasks: ["Unity project setup with URP", "Basic movement & shooting mechanics", "Single test map (2km × 2km)", "2 prototype heroes", "Local multiplayer test build", "Core inventory system"],
      status: "FOUNDATION",
    },
    {
      phase: "PHASE 2", label: "ALPHA BUILD", duration: "4-8 Months", color: COLORS.orange,
      tasks: ["Full 8km map with all 5 zones", "All 6 launch heroes", "Photon Fusion multiplayer (20 players)", "Vehicle system (4 types)", "Basic battle pass system", "Android APK closed alpha"],
      status: "CORE GAMEPLAY",
    },
    {
      phase: "PHASE 3", label: "BETA", duration: "9-14 Months", color: COLORS.purple,
      tasks: ["50-player live matches", "Ranked mode + matchmaking", "Full hero skills balanced", "Dynamic weather system", "Voice chat integration", "Anti-cheat implementation", "1,000 beta testers"],
      status: "POLISH",
    },
    {
      phase: "PHASE 4", label: "LAUNCH", duration: "15-18 Months", color: COLORS.gold,
      tasks: ["Google Play Store release", "All 4 game modes live", "Season 1 battle pass", "Clan system + friends", "Custom rooms + tournaments", "Global server deployment"],
      status: "GO LIVE",
    },
    {
      phase: "PHASE 5", label: "LIVE OPS", duration: "Month 19+", color: COLORS.green,
      tasks: ["Seasonal map updates", "New heroes every 45 days", "Community tournaments", "iOS port (TestFlight)", "PC client via cross-play", "Esports partnership program"],
      status: "GROWTH",
    },
  ];
  return (
    <div style={{ padding: "32px 20px" }}>
      <Heading icon="🗓️" title="DEV ROADMAP" sub="18-MONTH ANDROID LAUNCH PLAN" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {phases.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 0 }}>
            {/* Timeline bar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.color + "22", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "'Orbitron', sans-serif", color: p.color, fontWeight: 700, boxShadow: `0 0 12px ${p.color}66`, zIndex: 1 }}>{i + 1}</div>
              {i < phases.length - 1 && <div style={{ flex: 1, width: 2, background: `linear-gradient(${p.color}, ${phases[i + 1].color})`, marginTop: 2 }} />}
            </div>
            <Panel style={{ flex: 1, marginLeft: 12, marginBottom: i < phases.length - 1 ? 0 : 0 }} glow={p.color}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, color: COLORS.muted }}>{p.phase} — </span>
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, color: p.color, letterSpacing: 2 }}>{p.label}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge label={p.duration} color={p.color} />
                  <Badge label={p.status} color={COLORS.muted} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
                {p.tasks.map((t, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <span style={{ color: p.color, flexShrink: 0, marginTop: 1 }}>▸</span>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>{t}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
const SCREENS = [
  { id: "home", label: "HOME", icon: "🏠" },
  { id: "heroes", label: "HEROES", icon: "⚔️" },
  { id: "map", label: "MAP", icon: "🗺️" },
  { id: "weapons", label: "ARMORY", icon: "🔫" },
  { id: "progression", label: "PROGRESSION", icon: "🏆" },
  { id: "arch", label: "ARCHITECTURE", icon: "🏗️" },
  { id: "db", label: "DATABASE", icon: "🗃️" },
  { id: "roadmap", label: "ROADMAP", icon: "🗓️" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen />;
      case "heroes": return <HeroesScreen />;
      case "map": return <MapScreen />;
      case "weapons": return <WeaponsScreen />;
      case "progression": return <ProgressionScreen />;
      case "arch": return <ArchScreen />;
      case "db": return <DBScreen />;
      case "roadmap": return <RoadmapScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>

        {/* Top nav */}
        <nav style={{ position: "sticky", top: 0, zIndex: 200, background: `${COLORS.surface}ee`, borderBottom: `1px solid ${COLORS.border}`, backdropFilter: "blur(16px)", padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 56 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 16, color: COLORS.neon, letterSpacing: 3, textShadow: `0 0 10px ${COLORS.neon}88`, flexShrink: 0 }}>BATTLEX</div>
          
          {/* Desktop tabs */}
          <div style={{ display: "flex", gap: 4, overflow: "auto", flex: 1, msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {SCREENS.map((s) => (
              <button key={s.id} onClick={() => { setScreen(s.id); setMenuOpen(false); }} style={{ padding: "6px 12px", fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: screen === s.id ? COLORS.neon : COLORS.muted, background: screen === s.id ? COLORS.neon + "18" : "transparent", border: `1px solid ${screen === s.id ? COLORS.neon : "transparent"}`, borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Player HUD */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: COLORS.neon }}>LVL 34</div>
              <div style={{ fontSize: 10, color: COLORS.gold }}>💎 4,820</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.neon}44, ${COLORS.purple}44)`, border: `2px solid ${COLORS.neon}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          </div>
        </nav>

        {/* Content */}
        <main style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", paddingBottom: 60 }}>
          {renderScreen()}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, background: COLORS.surface }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: COLORS.muted, letterSpacing: 2 }}>© 2025 BATTLEX LEGENDS — ALL RIGHTS RESERVED</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Unity 2023 LTS", "Photon Fusion 2", "AWS", "Flutter"].map((t) => (
              <span key={t} style={{ fontSize: 10, color: COLORS.border, fontFamily: "'Share Tech Mono'" }}>{t}</span>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
