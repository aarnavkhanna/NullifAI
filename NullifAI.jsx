import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

function AgentSwarm3D() {
  const mountRef = useRef(null);
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    let w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(0, 0.5, 14);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const mouse = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
    const onMM = (e) => { const r = container.getBoundingClientRect(); tgt.x = ((e.clientX - r.left) / r.width) * 2 - 1; tgt.y = -((e.clientY - r.top) / r.height) * 2 + 1; };
    window.addEventListener("mousemove", onMM);
    scene.add(new THREE.AmbientLight(0x404040, 0.5));
    const kl = new THREE.DirectionalLight(0xffffff, 1.3); kl.position.set(5, 5, 5); scene.add(kl);
    const rl = new THREE.DirectionalLight(0xffffff, 0.35); rl.position.set(-4, 2, -4); scene.add(rl);
    const pl = new THREE.PointLight(0xffffff, 0.6, 25); pl.position.set(0, 3, 8); scene.add(pl);

    const bMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.95, roughness: 0.15 });
    const cMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1.0, roughness: 0.05 });
    const eMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7 });
    const vMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.95, roughness: 0.05, transparent: true, opacity: 0.85 });
    const dMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.3 });

    function bot(x, y, z, s) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), bMat.clone()); head.position.y = 1.6; g.add(head);
      const vis = new THREE.Mesh(new THREE.SphereGeometry(0.43, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), vMat.clone()); vis.position.set(0, 1.62, 0.12); vis.rotation.x = 0.38; g.add(vis);
      const eg = new THREE.SphereGeometry(0.065, 12, 12);
      const le = new THREE.Mesh(eg, eMat.clone()); le.position.set(-0.16, 1.7, 0.44); g.add(le);
      const re = new THREE.Mesh(eg, eMat.clone()); re.position.set(0.16, 1.7, 0.44); g.add(re);
      const nk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.22, 16), cMat.clone()); nk.position.y = 1.0; g.add(nk);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.36, 0.95, 16), bMat.clone()); tr.position.y = 0.42; g.add(tr);
      const cp = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), cMat.clone()); cp.position.set(0, 0.55, 0.32); cp.rotation.x = -0.12; g.add(cp);
      const sg = new THREE.SphereGeometry(0.19, 16, 16);
      const ls = new THREE.Mesh(sg, cMat.clone()); ls.position.set(-0.64, 0.82, 0); g.add(ls);
      const rs = new THREE.Mesh(sg, cMat.clone()); rs.position.set(0.64, 0.82, 0); g.add(rs);
      const uag = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 12);
      const lua = new THREE.Mesh(uag, bMat.clone()); lua.position.set(-0.68, 0.46, 0); lua.rotation.z = 0.15; g.add(lua);
      const rua = new THREE.Mesh(uag, bMat.clone()); rua.position.set(0.68, 0.46, 0); rua.rotation.z = -0.15; g.add(rua);
      const lag = new THREE.CylinderGeometry(0.08, 0.1, 0.42, 12);
      const lla = new THREE.Mesh(lag, dMat.clone()); lla.position.set(-0.72, 0.06, 0); g.add(lla);
      const rla = new THREE.Mesh(lag, dMat.clone()); rla.position.set(0.72, 0.06, 0); g.add(rla);
      const hg = new THREE.SphereGeometry(0.09, 10, 10);
      const lh = new THREE.Mesh(hg, cMat.clone()); lh.position.set(-0.72, -0.2, 0); g.add(lh);
      const rh = new THREE.Mesh(hg, cMat.clone()); rh.position.set(0.72, -0.2, 0); g.add(rh);
      const im = new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 1 });
      const ind = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), im); ind.position.set(0, 0.72, 0.46); g.add(ind);
      scene.add(g);
      return { group: g, head, le, re, im, baseY: y, ph: Math.random() * Math.PI * 2 };
    }

    const agents = [bot(-3.8, 0.6, 0, 0.82), bot(-1.6, -0.6, 1.2, 0.92), bot(0.6, 1.0, 0.6, 1.0), bot(2.6, -0.4, 0.9, 0.88), bot(4.2, 0.5, -0.3, 0.78)];
    const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    const conns = [];
    for (let i = 0; i < agents.length; i++) for (let j = i + 1; j < agents.length; j++) {
      const geo = new THREE.BufferGeometry().setFromPoints([agents[i].group.position.clone().add(new THREE.Vector3(0, 0.8, 0)), agents[j].group.position.clone().add(new THREE.Vector3(0, 0.8, 0))]);
      const ln = new THREE.Line(geo, lm.clone()); scene.add(ln); conns.push({ ln, i, j });
    }
    const pm = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5 });
    const pg = new THREE.SphereGeometry(0.035, 6, 6);
    const pks = conns.map(c => { const m = new THREE.Mesh(pg, pm.clone()); m.visible = false; scene.add(m); return { m, c, p: Math.random(), sp: 0.003 + Math.random() * 0.004, on: Math.random() > 0.35 }; });
    const clock = new THREE.Clock(); let fid;
    const anim = () => {
      fid = requestAnimationFrame(anim); const t = clock.getElapsedTime();
      mouse.x += (tgt.x - mouse.x) * 0.06; mouse.y += (tgt.y - mouse.y) * 0.06;
      agents.forEach((a, i) => {
        a.group.position.y = a.baseY + Math.sin(t * 1.1 + a.ph) * 0.07;
        a.head.rotation.y += (mouse.x * 0.45 - a.head.rotation.y) * 0.035;
        a.head.rotation.x += (-mouse.y * 0.15 - a.head.rotation.x) * 0.035;
        const ep = Math.sin(t * 2.2 + i * 1.1) * 0.35 + 0.65;
        a.le.material.emissiveIntensity = ep; a.re.material.emissiveIntensity = ep;
        a.im.emissiveIntensity = 0.4 + Math.sin(t * 3 + i * 1.7) * 0.6;
        a.group.rotation.y = Math.sin(t * 0.4 + a.ph) * 0.04;
      });
      conns.forEach(c => {
        const pA = agents[c.i].group.position, pB = agents[c.j].group.position;
        const pos = c.ln.geometry.attributes.position.array;
        pos[0] = pA.x; pos[1] = pA.y + 0.8; pos[2] = pA.z; pos[3] = pB.x; pos[4] = pB.y + 0.8; pos[5] = pB.z;
        c.ln.geometry.attributes.position.needsUpdate = true;
        c.ln.material.opacity = 0.03 + Math.sin(t * 0.7 + c.i + c.j) * 0.025;
      });
      pks.forEach(pk => {
        if (!pk.on) { pk.m.visible = false; if (Math.random() < 0.003) pk.on = true; return; }
        pk.m.visible = true; pk.p += pk.sp; if (pk.p > 1) { pk.p = 0; if (Math.random() < 0.25) pk.on = false; }
        const a = agents[pk.c.i].group.position, b = agents[pk.c.j].group.position;
        pk.m.position.set(a.x + (b.x - a.x) * pk.p, (a.y + 0.8) + ((b.y + 0.8) - (a.y + 0.8)) * pk.p, a.z + (b.z - a.z) * pk.p);
      });
      camera.position.x = Math.sin(t * 0.18) * 0.25; camera.position.y = 0.5 + Math.cos(t * 0.14) * 0.15;
      camera.lookAt(0.5, 0.5, 0); renderer.render(scene, camera);
    };
    anim();
    const onR = () => { w = container.clientWidth; h = container.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(fid); window.removeEventListener("mousemove", onMM); window.removeEventListener("resize", onR); if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement); renderer.dispose(); };
  }, []);
  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
}

function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); let id; const ps = []; let mx = -999, my = -999;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; }; resize();
    for (let i = 0; i < 50; i++) ps.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, s: Math.random() * 1.2 + 0.3, a: Math.random() * 0.13 + 0.02 });
    const mm = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("resize", resize); window.addEventListener("mousemove", mm);
    const draw = () => { ctx.clearRect(0, 0, c.width, c.height); ps.forEach((p, i) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0; if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0; const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy); if (d < 110) { p.vx += (dx / d) * 0.02; p.vy += (dy / d) * 0.02; } p.vx *= 0.996; p.vy *= 0.996; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${p.a})`; ctx.fill(); for (let j = i + 1; j < ps.length; j++) { const dd = Math.sqrt((p.x - ps[j].x) ** 2 + (p.y - ps[j].y) ** 2); if (dd < 85) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ps[j].x, ps[j].y); ctx.strokeStyle = `rgba(255,255,255,${(1 - dd / 85) * 0.03})`; ctx.lineWidth = 0.4; ctx.stroke(); } } }); id = requestAnimationFrame(draw); }; draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", mm); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  const tr = { up: "translateY(50px)", scale: "scale(0.92)" };
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : (tr[direction] || tr.up), transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function Counter({ target, suffix = "" }) {
  const [c, setC] = useState(0); const ref = useRef(null); const go = useRef(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !go.current) { go.current = true; const s = Date.now(); const t = () => { const p = Math.min((Date.now() - s) / 1800, 1); setC(Math.floor((1 - (1 - p) ** 4) * target)); if (p < 1) requestAnimationFrame(t); }; t(); } }, { threshold: 0.3 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, [target]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function TypeWriter({ text, speed = 38 }) {
  const [d, setD] = useState(""); const [go, setGo] = useState(false); const ref = useRef(null);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  useEffect(() => { if (!go) return; let i = 0; const iv = setInterval(() => { setD(text.slice(0, i + 1)); i++; if (i >= text.length) clearInterval(iv); }, speed); return () => clearInterval(iv); }, [go, text, speed]);
  return <span ref={ref}>{d}<span style={{ animation: "twBlink 1s step-end infinite", color: "rgba(255,255,255,0.25)" }}>|</span></span>;
}

function DebateSimulation() {
  const [step, setStep] = useState(0);
  const msgs = [
    { a: "ALPHA", st: "Advocate", t: "Current evidence strongly supports hypothesis A. Three independent studies confirm the correlation with p < 0.01.", s: "left" },
    { a: "BETA", st: "Skeptic", t: "Correlation does not imply causation. The confounding variables in those studies remain unaddressed.", s: "right" },
    { a: "GAMMA", st: "Systems", t: "Both analyses miss the systemic view. Feedback loops between X and Y make linear models insufficient.", s: "left" },
    { a: "DELTA", st: "Steel-manner", t: "Steel-manning Alpha: even controlling for Beta's confounders, effect size remains significant under constraint X.", s: "right" },
    { a: "SYNTH", st: "Convergence", t: "Emerging consensus: A holds under X, B holds under Y. Novel hypothesis C integrates both. Confidence: 0.84", s: "center" },
  ];
  useEffect(() => { const iv = setInterval(() => setStep(s => (s + 1) % 6), 2800); return () => clearInterval(iv); }, []);
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)", marginTop: 56 }}>
      <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "lp 1.5s ease infinite", display: "inline-block" }} />LIVE DIALECTIC
        </div>
        <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>Does correlation imply causation in complex adaptive systems?</div>
      </div>
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 12, minHeight: 320 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ padding: "18px 22px", borderRadius: 14, border: `1px solid ${m.s === "center" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`, background: m.s === "center" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)", alignSelf: m.s === "left" ? "flex-start" : m.s === "right" ? "flex-end" : "center", maxWidth: m.s === "center" ? "88%" : "72%", opacity: i < step ? 1 : 0.05, transform: i < step ? "translateY(0)" : "translateY(14px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>AGENT {m.a}</span>
              <span style={{ fontFamily: "var(--fm)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 9px", borderRadius: 100, border: `1px solid ${m.st === "Convergence" ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)"}`, color: m.st === "Convergence" ? "#4ade80" : "rgba(255,255,255,0.3)" }}>{m.st}</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>{m.t}</div>
            {i === 4 && i < step && <div style={{ marginTop: 12, height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 100, overflow: "hidden" }}><div style={{ height: "100%", width: "84%", background: "linear-gradient(90deg, #4ade80, rgba(74,222,128,0.25))", borderRadius: 100, transition: "width 1s ease" }} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NullifAILanding() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const submit = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) { setErrMsg("Enter a valid email."); setStatus("error"); return; }
    setStatus("loading");
    try { const r = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, source: "nullifai", ts: new Date().toISOString() }) }); if (r.ok) { setStatus("success"); setEmail(""); } else { setErrMsg("Something went wrong."); setStatus("error"); } } catch { setErrMsg("Network error."); setStatus("error"); }
  };
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const sLabel = { fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 };
  const sTitle = { fontFamily: "var(--fd)", fontSize: "clamp(30px, 4.2vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 18 };
  const sDesc = { fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.35)", fontWeight: 300, maxWidth: 500 };
  const divider = { height: 1, maxWidth: 1140, margin: "0 auto", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)" };
  const dash = <span style={{ display: "block", width: 24, height: 1, background: "rgba(255,255,255,0.18)" }} />;

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Manrope', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--fd:'Syne',sans-serif;--fb:'Manrope',sans-serif;--fm:'DM Mono',monospace}
        html{scroll-behavior:smooth} body{background:#000}
        ::selection{background:rgba(255,255,255,0.12)}
        @keyframes twBlink{50%{opacity:0}}
        @keyframes lp{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes logoPulse{0%,100%{opacity:.35;box-shadow:0 0 4px rgba(255,255,255,.15)}50%{opacity:1;box-shadow:0 0 16px rgba(255,255,255,.5)}}
        @keyframes badgePulse{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <ParticleField />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", background: scrollY > 50 ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.35)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.3s" }}>
        <div style={{ fontFamily: "var(--fd)", fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "logoPulse 3s ease infinite", display: "inline-block" }} />Nullif<span style={{ opacity: 0.28 }}>AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <button onClick={() => go("how")} style={{ background: "none", border: "none", fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>How it works</button>
          <button onClick={() => go("features")} style={{ background: "none", border: "none", fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>Features</button>
          <button onClick={() => go("signup")} style={{ padding: "9px 26px", background: "#fff", color: "#000", border: "none", borderRadius: 100, fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get Early Access</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 48px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", right: "-8%", width: 800, height: 800, background: "radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, flex: "0 0 48%", maxWidth: 600 }}>
          <Reveal><div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 18px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 32 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "badgePulse 2s ease infinite", display: "inline-block" }} />Accepting early access</div></Reveal>
          <Reveal delay={0.08}><h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(46px, 6.5vw, 84px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 28 }}>AI that argues<br /><span style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.25) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>to find truth.</span></h1></Reveal>
          <Reveal delay={0.16}><p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.38)", fontWeight: 300, maxWidth: 460, marginBottom: 40 }}>NullifAI deploys swarms of AI agents that debate, challenge, and synthesize — delivering understanding forged through adversarial collaboration, not shallow consensus.</p></Reveal>
          <Reveal delay={0.24}><div id="signup">{status === "success" ? <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.55)" }}><span style={{ color: "#4ade80", fontSize: 18 }}>✓</span> You're on the list. We'll be in touch.</div> : <><div style={{ display: "flex", maxWidth: 430, border: "1px solid rgba(255,255,255,0.09)", borderRadius: 100, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}><input type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} onKeyDown={(e) => e.key === "Enter" && submit()} style={{ flex: 1, padding: "15px 22px", background: "transparent", border: "none", color: "#fff", fontFamily: "var(--fb)", fontSize: 14, outline: "none" }} /><button onClick={submit} disabled={status === "loading"} style={{ padding: "15px 30px", background: "#fff", color: "#000", border: "none", borderRadius: 100, margin: 4, fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{status === "loading" ? "Joining..." : "Request Access"}</button></div>{status === "error" && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{errMsg}</div>}</>}</div></Reveal>
          <Reveal delay={0.32}><div style={{ display: "flex", gap: 28, marginTop: 28, fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}><span>Free during beta</span><span>No credit card</span><span>Ship Q2 2026</span></div></Reveal>
        </div>
        <div style={{ flex: 1, position: "relative", minHeight: 580 }}><AgentSwarm3D /></div>
      </section>

      {/* PROBLEMS */}
      <section style={{ padding: "140px 0 100px" }}><div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px" }}>
        <Reveal><div style={sLabel}>{dash}The Problem</div><h2 style={sTitle}>One model. One answer.<br />Zero friction.</h2><p style={sDesc}>Today's AI gives you a single, agreeable response. Real understanding requires conflict, challenge, and synthesis.</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginTop: 56, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 20, overflow: "hidden" }}>
          {[{ b: "Single AI gives one perspective", a: "Multi-agent debate reveals blind spots" }, { b: "Echo chambers reinforce beliefs", a: "Adversarial agents challenge every assumption" }, { b: "Static answers, no reasoning trail", a: "Transparent chains of evolving thought" }, { b: "Shallow consensus without friction", a: "Deep understanding through dialectic" }].map((p, i) => (
            <Reveal key={i} delay={i * 0.07}><div style={{ padding: "36px 32px", background: "rgba(255,255,255,0.015)", cursor: "default" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}><div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.08)", marginBottom: 18, letterSpacing: "0.1em" }}>{String(i + 1).padStart(2, "0")}</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.18)", textDecoration: "line-through", marginBottom: 10, lineHeight: 1.5, fontWeight: 300 }}>{p.b}</div><span style={{ display: "block", color: "rgba(255,255,255,0.08)", fontSize: 14, marginBottom: 10, fontFamily: "var(--fm)" }}>↓</span><div style={{ fontSize: 16, color: "rgba(255,255,255,0.88)", lineHeight: 1.5, fontWeight: 600, fontFamily: "var(--fd)", letterSpacing: "-0.01em" }}>{p.a}</div></div></Reveal>
          ))}
        </div>
      </div></section>

      <div style={divider} />

      {/* DEBATE */}
      <section id="how" style={{ padding: "100px 0" }}><div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px" }}>
        <Reveal><div style={sLabel}>{dash}Live Preview</div><h2 style={sTitle}><TypeWriter text="Watch agents think together." /></h2><p style={sDesc}>Real-time dialectical reasoning. Agents argue, concede, and synthesize until genuine understanding emerges.</p></Reveal>
        <Reveal delay={0.12}><DebateSimulation /></Reveal>
      </div></section>

      <div style={divider} />

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 0" }}><div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px" }}>
        <Reveal><div style={sLabel}>{dash}Core Architecture</div><h2 style={sTitle}>Designed for epistemic rigor.</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginTop: 56, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 20, overflow: "hidden" }}>
          {[{ i: "⚔", t: "Adversarial Collaboration", d: "Agents take opposing stances and genuinely argue positions through structured debate." }, { i: "◈", t: "Epistemic Diversity", d: "Each agent embodies distinct reasoning styles, knowledge, and philosophical frameworks." }, { i: "⟳", t: "Dynamic Evolution", d: "Positions refine in real-time as agents encounter strong counterpoints and update beliefs." }, { i: "◉", t: "Emergent Consensus", d: "Solutions emerge from conflict and synthesis, not pre-programmed agreement." }].map((f, idx) => (
            <Reveal key={idx} delay={idx * 0.07}><div style={{ padding: "36px 26px", background: "rgba(255,255,255,0.015)", transition: "all 0.35s", cursor: "default", minHeight: 200 }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.035)"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; e.currentTarget.style.transform = "none"; }}><div style={{ width: 46, height: 46, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 22, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>{f.i}</div><div style={{ fontFamily: "var(--fd)", fontSize: 15, fontWeight: 700, marginBottom: 8, color: "rgba(255,255,255,0.88)" }}>{f.t}</div><div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>{f.d}</div></div></Reveal>
          ))}
        </div>
      </div></section>

      <div style={divider} />

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 0" }}><div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px" }}>
        <Reveal><div style={sLabel}>{dash}Process</div><h2 style={sTitle}>From question to understanding.</h2></Reveal>
        <div style={{ marginTop: 56 }}>
          {[{ t: "Pose your challenge", d: "Submit any topic — technical architecture, ethical dilemmas, strategic decisions. The harder, the better." }, { t: "Agents take positions", d: "Diverse AI agents adopt distinct reasoning approaches and defend their stance with evidence." }, { t: "Structured debate unfolds", d: "Point-counterpoint, steel-manning, Socratic questioning — all transparent and observable." }, { t: "Positions evolve live", d: "Agents update beliefs in response to strong counterpoints. Watch reasoning chains transform." }, { t: "Synthesis emerges", d: "Nuanced understanding forms — capturing agreement, productive disagreement, and novel hypotheses." }].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}><div style={{ display: "grid", gridTemplateColumns: "56px 1fr", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.04)", fontFamily: "var(--fm)", fontSize: 12, color: "rgba(255,255,255,0.08)", padding: "28px 0" }}>{String(i + 1).padStart(2, "0")}</div><div style={{ padding: "28px 24px" }}><div style={{ fontFamily: "var(--fd)", fontSize: 16, fontWeight: 700, marginBottom: 5, color: "rgba(255,255,255,0.88)" }}>{s.t}</div><div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>{s.d}</div></div></div></Reveal>
          ))}
        </div>
      </div></section>

      <div style={divider} />

      {/* STATS */}
      <section style={{ padding: "80px 0" }}><div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 20, overflow: "hidden" }}>
          {[{ n: 18, s: "+", l: "Agent Personas" }, { n: 5, s: "", l: "Debate Formats" }, { n: 100, s: "%", l: "Transparent" }, { n: null, s: "∞", l: "Sub-debates" }].map((st, i) => (
            <div key={i} style={{ padding: "44px 28px", textAlign: "center", background: "rgba(255,255,255,0.015)" }}><div style={{ fontFamily: "var(--fd)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.88)" }}>{st.n !== null ? <Counter target={st.n} suffix={st.s} /> : st.s}</div><div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginTop: 7 }}>{st.l}</div></div>
          ))}
        </div>
      </div></section>

      {/* CTA */}
      <section style={{ padding: "140px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 550, height: 550, background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />
        <Reveal>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 18, position: "relative", zIndex: 2 }}>Join the future of<br /><span style={{ background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.28) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>collective intelligence.</span></h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", marginBottom: 40, fontWeight: 300, position: "relative", zIndex: 2 }}>Be among the first to experience multi-agent dialectical AI.</p>
          <div style={{ position: "relative", zIndex: 2 }}>
            {status === "success" ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.55)" }}><span style={{ color: "#4ade80", fontSize: 18 }}>✓</span> You're on the list.</div> : <div style={{ display: "flex", maxWidth: 430, margin: "0 auto", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 100, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}><input type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} onKeyDown={(e) => e.key === "Enter" && submit()} style={{ flex: 1, padding: "15px 22px", background: "transparent", border: "none", color: "#fff", fontFamily: "var(--fb)", fontSize: 14, outline: "none" }} /><button onClick={submit} disabled={status === "loading"} style={{ padding: "15px 30px", background: "#fff", color: "#000", border: "none", borderRadius: 100, margin: 4, fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{status === "loading" ? "Joining..." : "Request Access"}</button></div>}
          </div>
        </Reveal>
      </section>

      <div style={divider} />
      <footer style={{ padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1140, margin: "0 auto", fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.04em" }}><span>© 2026 NullifAI</span><span>Multi-Agent Dialectical Intelligence</span></footer>
    </div>
  );
}