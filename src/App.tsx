import { useState, useEffect, useRef, type ReactNode } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion"
import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"
import {
  Users,
  Brain,
  Search,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Hash,
} from "lucide-react"

// ─── Config ──────────────────────────────────────────────────────────
const SUBSCRIBE_ENDPOINT = "/api/subscribe"
const SPLINE_ROBOT =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

// ─── Animation Variants ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// ─── Animated (scroll-triggered fade-up) ─────────────────────────────
function Animated({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── SplitText (character-by-character 3D flip reveal) ───────────────
function SplitText({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const chars = children.split("")

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 60, opacity: 0, rotateX: -80 }}
          animate={inView ? { y: 0, opacity: 1, rotateX: 0 } : undefined}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.025,
          }}
          style={{ transformOrigin: "bottom center", transformPerspective: 600 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

// ─── WordReveal (word-by-word mask reveal on scroll) ─────────────────
function WordReveal({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const lines = children.split("\n")
  let wordIndex = 0

  return (
    <span ref={ref} className={cn("inline", className)}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 && <br />}
          {line.split(" ").map((word) => {
            const idx = wordIndex++
            return (
              <span
                key={idx}
                className="inline-block overflow-hidden mr-[0.25em] last:mr-0"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={inView ? { y: 0 } : undefined}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay + idx * 0.045,
                  }}
                >
                  {word}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}


// ─── TiltCard (3D perspective on hover) ──────────────────────────────
function TiltCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7])

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── MagneticButton (cursor-following CTA) ───────────────────────────
function MagneticButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 20 })
  const springY = useSpring(y, { stiffness: 250, damping: 20 })

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2)
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ─── Email Signup ────────────────────────────────────────────────────
function EmailForm({ id, centered }: { id?: string; centered?: boolean }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errMsg, setErrMsg] = useState("")

  const submit = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrMsg("Enter a valid email.")
      setStatus("error")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setErrMsg("Something went wrong. Try again.")
        setStatus("error")
      }
    } catch {
      setErrMsg("Network error. Check your connection.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 text-sm text-white/60",
          centered && "justify-center"
        )}
      >
        <span className="text-emerald-400 text-lg">✓</span>
        You're on the list. We'll be in touch.
      </div>
    )
  }

  return (
    <div id={id}>
      <div
        className={cn(
          "flex max-w-[420px] border border-white/10 rounded-full overflow-hidden bg-white/[0.03]",
          centered && "mx-auto"
        )}
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === "error") setStatus("idle")
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="flex-1 px-5 py-3.5 bg-transparent border-none text-white font-body text-sm outline-none placeholder:text-white/20 min-w-0"
        />
        <button
          onClick={submit}
          disabled={status === "loading"}
          className="px-6 py-3.5 bg-white text-black rounded-full m-1 text-sm font-bold whitespace-nowrap hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "Joining..." : "Request Access"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2.5 pl-2">{errMsg}</p>
      )}
    </div>
  )
}

// ─── Community Preview ───────────────────────────────────────────────
const channels = [
  "first-impressions",
  "pricing-barriers",
  "regional-access",
  "feature-requests",
  "competitors",
]

const communityMembers = [
  {
    initial: "A",
    name: "Aanya Mehta",
    context: "IIT Delhi · India",
    color: "#4ade80",
    tags: ["Mobile-first", "Price-sensitive"],
  },
  {
    initial: "J",
    name: "Jake Morrison",
    context: "UMich · USA",
    color: "#60a5fa",
    tags: ["Laptop user", "Low switching cost"],
  },
  {
    initial: "F",
    name: "Fatima Al-Rashid",
    context: "AUB · Lebanon",
    color: "#fbbf24",
    tags: ["iPad user", "RTL needs"],
  },
  {
    initial: "K",
    name: "Kofi Asante",
    context: "Univ. of Ghana",
    color: "#a78bfa",
    tags: ["Mobile-only", "High urgency"],
  },
  {
    initial: "L",
    name: "Lina Park",
    context: "Seoul National · Korea",
    color: "#fb7185",
    tags: ["Power user", "Privacy-first"],
  },
]

const communityMessages = [
  {
    member: 0,
    text: "This is exactly what I need during exam season. But \u20B9499/month? Most of us survive on \u20B9200 data plans. A student tier or UPI-based micropayments would change everything for the Indian market.",
    time: "2:34 PM",
  },
  {
    member: 1,
    text: "Clean interface, but I already use Notion + ChatGPT for this. What makes me switch? The collab feature is interesting but I'd need to convince my whole study group — and they're all on free tools.",
    time: "2:36 PM",
  },
  {
    member: 2,
    text: "Love the design, but right-to-left text support is completely broken. Also, Stripe doesn't work in Lebanon — any plans for local payment options? That's a dealbreaker for the entire MENA region.",
    time: "2:39 PM",
  },
  {
    member: 3,
    text: "This would be massive for us — we share one textbook between five people. But the app is 120MB and I'm on 1GB monthly data. An offline-first lite version is essential, not a nice-to-have.",
    time: "2:42 PM",
  },
  {
    member: 4,
    text: "Analytics features are strong, but where's the data stored? Korean PIPA law requires local hosting for student data. Also — dark mode is a must, we study until 3am. UX detail, but it signals you understand us.",
    time: "2:44 PM",
  },
]

function CommunityPreview() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((v) =>
        v < communityMessages.length ? v + 1 : 0
      )
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden mt-12 bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-white/[0.08] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white/40">N</span>
          </div>
          <span className="font-display text-sm font-bold text-white/60">
            Nullif<span className="text-white/20">AI</span>
          </span>
          <span className="font-mono text-[10px] text-white/12 ml-1 hidden sm:inline">
            Target: University Students
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {communityMembers.map((m, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold -ml-1 first:ml-0 border border-[#0a0a0a]"
              style={{
                backgroundColor: m.color + "25",
                color: m.color,
              }}
            >
              {m.initial}
            </div>
          ))}
          <span className="text-[10px] text-white/20 font-mono ml-1.5">
            5 agents
          </span>
        </div>
      </div>

      <div className="flex min-h-[420px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/[0.05] bg-white/[0.01] p-3 hidden md:flex flex-col">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15 mb-2 px-2">
            Channels
          </div>
          {channels.map((ch, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[12px] font-light",
                i === 0
                  ? "bg-white/[0.06] text-white/60"
                  : "text-white/20"
              )}
            >
              <Hash size={11} className="opacity-40 shrink-0" />
              <span className="truncate">{ch}</span>
            </div>
          ))}

          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15 mt-5 mb-2 px-2">
            Agents Online
          </div>
          {communityMembers.map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <div className="min-w-0">
                <span className="text-[11px] text-white/30 block truncate">
                  {m.name.split(" ")[0]}
                </span>
                <span className="text-[9px] text-white/10 block truncate">
                  {m.context}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-2.5 border-b border-white/[0.04] flex items-center gap-2">
            <Hash size={13} className="text-white/15 shrink-0" />
            <span className="text-[13px] font-semibold text-white/40">
              first-impressions
            </span>
            <span className="text-[10px] text-white/10 font-light ml-1 hidden sm:inline">
              Synthetic users react to your product
            </span>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-0.5 overflow-hidden">
            {communityMessages.map((msg, i) => {
              const m = communityMembers[msg.member]
              return (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 py-2.5 px-2 rounded-lg transition-all duration-700 ease-out",
                    i < visibleCount
                      ? "opacity-100 translate-y-0 blur-none scale-100"
                      : "opacity-0 translate-y-4 blur-sm scale-[0.97]"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                    style={{
                      backgroundColor: m.color + "20",
                      color: m.color,
                    }}
                  >
                    {m.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: m.color + "cc" }}
                      >
                        {m.name}
                      </span>
                      <span className="text-[10px] text-white/15 font-mono shrink-0">
                        {m.context}
                      </span>
                      <span className="text-[10px] text-white/10 shrink-0">
                        {msg.time}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mb-1.5">
                      {m.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="text-[9px] font-mono px-1.5 py-[1px] rounded-full border border-white/[0.06] text-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[13px] text-white/45 leading-[1.65] font-light">
                      {msg.text}
                    </p>
                  </div>
                </div>
              )
            })}

            {visibleCount < communityMessages.length && visibleCount > 0 && (
              <div className="flex items-center gap-2 px-2 py-2 text-white/15">
                <div className="flex gap-[3px] ml-11">
                  <span
                    className="w-[5px] h-[5px] rounded-full bg-white/20 animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1s" }}
                  />
                  <span
                    className="w-[5px] h-[5px] rounded-full bg-white/20 animate-bounce"
                    style={{
                      animationDelay: "150ms",
                      animationDuration: "1s",
                    }}
                  />
                  <span
                    className="w-[5px] h-[5px] rounded-full bg-white/20 animate-bounce"
                    style={{
                      animationDelay: "300ms",
                      animationDuration: "1s",
                    }}
                  />
                </div>
                <span className="text-[11px] font-light">
                  {
                    communityMembers[
                      communityMessages[visibleCount].member
                    ].name.split(" ")[0]
                  }{" "}
                  is typing...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Counter ─────────────────────────────────────────────────────────
function Counter({
  target,
  suffix = "",
}: {
  target: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const duration = 2000
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [inView, target])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {count}
      {suffix}
    </motion.span>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/20 mb-4">
      <span className="block w-6 h-px bg-white/20" />
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div className="font-display font-extrabold text-xl tracking-tight flex items-center gap-2.5">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse-slow" />
      <span>
        Nullif<span className="opacity-30">AI</span>
      </span>
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────
const problems = [
  {
    before: "Guessing what users want from a single perspective",
    after: "Simulate every segment of your market",
  },
  {
    before: "Months building before any signal from real users",
    after: "Test product-market fit before writing a line of code",
  },
  {
    before: "Surveys that miss cultural, economic, and regional nuance",
    after: "Agents shaped by real-world constraints",
  },
  {
    before: "Blind to how the problem is already being solved",
    after: "Your competitors — discovered automatically",
  },
]

const features = [
  {
    icon: Users,
    title: "Synthetic User Communities",
    desc: "Define your audience — students, startups, enterprises — and AI agents are deployed as real representatives from that world, globally.",
  },
  {
    icon: Brain,
    title: "Deep Persona Modeling",
    desc: "Each agent differs by demographics, economic status, tech literacy, cultural norms, regulatory context, device access, and motivation level.",
  },
  {
    icon: Search,
    title: "Competitive Intelligence",
    desc: "Agents research how your problem is already being solved, surfacing alternatives and testing your differentiation against real competitors.",
  },
  {
    icon: LayoutDashboard,
    title: "Founder Dashboard",
    desc: "Every debate, objection, and regional barrier synthesized into PMF metrics, key risks, and concrete next steps — all in one place.",
  },
]

const steps = [
  {
    title: "Describe your product and audience",
    desc: "Tell us what you're building and who it's for — students, SMBs, enterprises, developers.",
  },
  {
    title: "AI deploys your target community",
    desc: "Synthetic users spawn modeled after real people in your market — each with distinct demographics and context.",
  },
  {
    title: "Community stress-tests your product",
    desc: "Agents debate features, surface pricing objections, flag regional barriers, and challenge your value proposition.",
  },
  {
    title: "Competitive landscape is mapped",
    desc: "AI researches existing solutions to your problem — testing whether your differentiation holds.",
  },
  {
    title: "Dashboard synthesizes everything",
    desc: "All findings distilled into PMF signals, persona-level sentiment, competitive gaps, and recommendations.",
  },
]

const stats = [
  { value: 18, suffix: "+", label: "Agent Personas" },
  { value: 12, suffix: "", label: "Demographic Axes" },
  { value: 100, suffix: "%", label: "Transparent" },
  { value: null, display: "∞", label: "Sub-debates" },
]

// ─── Main App ────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Page loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Navbar scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Scroll parallax for hero
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const robotLeftY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const robotCenterY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const robotRightY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <div className="bg-black text-white font-body overflow-x-hidden">
      {/* ── Page Loader ───────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.4],
                scale: [0, 1, 1.2, 1],
              }}
              transition={{ duration: 2, times: [0, 0.2, 0.5, 1] }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display font-extrabold text-2xl tracking-tight"
            >
              Nullif<span className="opacity-30">AI</span>
            </motion.div>
            <motion.div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/40 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Noise texture */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "bg-black/80 border-white/[0.06] backdrop-blur-2xl"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("how")}
              className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <MagneticButton
              onClick={() => scrollTo("signup")}
              className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-colors border-none cursor-pointer"
            >
              Get Early Access
            </MagneticButton>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-transparent border-none text-white cursor-pointer"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl px-6 py-6 flex flex-col gap-4"
          >
            <button
              onClick={() => scrollTo("how")}
              className="font-mono text-xs tracking-widest uppercase text-white/40 text-left bg-transparent border-none cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="font-mono text-xs tracking-widest uppercase text-white/40 text-left bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("signup")}
              className="px-6 py-3 bg-white text-black rounded-full text-sm font-bold border-none cursor-pointer w-full"
            >
              Get Early Access
            </button>
          </motion.div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center relative overflow-hidden pt-16"
      >
        <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,222,128,0.015)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 w-full flex items-center gap-4">
          {/* Left — Content with scroll parallax */}
          <motion.div
            className="flex-shrink-0 w-full lg:w-[480px] relative z-10 py-12"
            style={{ y: heroContentY, opacity: heroOpacity }}
          >
            <Animated delay={2.3}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/35">
                  Accepting early access
                </span>
              </div>
            </Animated>

            <h1 className="font-display text-[52px] sm:text-[60px] lg:text-[64px] font-bold leading-[1.0] tracking-tight mb-3">
              <span className="block overflow-hidden pb-2">
                <SplitText delay={2.5}>Your market.</SplitText>
              </span>
              <span className="block overflow-hidden pb-2">
                <SplitText delay={2.8}>Stress-tested.</SplitText>
              </span>
              <span className="block overflow-hidden text-gradient-animated">
                <SplitText delay={3.1}>Before launch.</SplitText>
              </span>
            </h1>

            <Animated delay={3.5}>
              <p className="text-[15px] text-white/40 font-light leading-[1.7] max-w-[380px] mb-9 mt-1">
                Deploy synthetic AI communities modeled after your real target
                audience — shaped by demographics, culture, and economic
                reality. They stress-test your product so you find
                market fit before you build.
              </p>
            </Animated>

            <Animated delay={3.8}>
              <EmailForm id="signup" />
            </Animated>

            <Animated delay={4.1}>
              <div className="flex flex-wrap gap-5 mt-6 font-mono text-[10px] tracking-[0.08em] uppercase text-white/18">
                <span>Free during beta</span>
                <span className="text-white/8">•</span>
                <span>No credit card</span>
                <span className="text-white/8">•</span>
                <span>Early builders only</span>
              </div>
            </Animated>
          </motion.div>

          {/* Right — Robot swarm with scroll parallax */}
          <div className="flex-1 relative h-[580px] hidden lg:block">
            <Spotlight
              className="-top-40 left-0 md:left-20 md:-top-20"
              fill="white"
            />

            {/* Back-left robot */}
            <motion.div
              className="absolute z-[1]"
              style={{
                left: "-8%",
                top: "8%",
                width: "58%",
                height: "82%",
                opacity: 0.35,
                filter: "brightness(0.6)",
                y: robotLeftY,
              }}
            >
              <SplineScene scene={SPLINE_ROBOT} className="w-full h-full" />
            </motion.div>

            {/* Center robot */}
            <motion.div
              className="absolute z-[3]"
              style={{
                left: "18%",
                top: "0",
                width: "64%",
                height: "100%",
                y: robotCenterY,
              }}
            >
              <SplineScene scene={SPLINE_ROBOT} className="w-full h-full" />
            </motion.div>

            {/* Back-right robot */}
            <motion.div
              className="absolute z-[2]"
              style={{
                right: "-10%",
                top: "6%",
                width: "58%",
                height: "84%",
                opacity: 0.4,
                filter: "brightness(0.65)",
                y: robotRightY,
              }}
            >
              <SplineScene scene={SPLINE_ROBOT} className="w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Animated>
            <SectionLabel>The Problem</SectionLabel>
          </Animated>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] mb-4 max-w-lg">
            <WordReveal>You're building blind.</WordReveal>
          </h2>
          <Animated delay={0.2}>
            <p className="text-[15px] text-white/35 font-light max-w-md leading-[1.7]">
              Most founders ship v1 without real objections from real
              segments of their market. A student in Lagos and a student
              in Seoul have fundamentally different needs — but your
              survey doesn't know that.
            </p>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mt-12 rounded-2xl border border-white/[0.04] overflow-hidden">
            {problems.map((p, i) => (
              <Animated key={i} delay={i * 0.1}>
                <div className="p-7 sm:p-8 bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
                  <span className="font-mono text-[11px] text-white/[0.07] tracking-[0.1em] block mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[13px] text-white/20 line-through mb-2.5 font-light leading-relaxed">
                    {p.before}
                  </p>
                  <span className="block text-white/[0.06] text-sm font-mono mb-2.5">
                    ↓
                  </span>
                  <p className="font-display text-[15px] font-bold text-white/90 leading-snug tracking-tight">
                    {p.after}
                  </p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── How It Works ────────────────────────────────────────── */}
      <section id="how" className="py-24 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Animated>
            <SectionLabel>How It Works</SectionLabel>
          </Animated>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] mb-4 max-w-lg">
            <WordReveal>
              {"Your product, debated by\nthe people who'd actually use it."}
            </WordReveal>
          </h2>
          <Animated delay={0.2}>
            <p className="text-[15px] text-white/35 font-light max-w-md leading-[1.7]">
              Tell us your audience.
              NullifAI generates a community of synthetic users — each modeled after real people in your market.
            </p>
          </Animated>

          <Animated delay={0.4}>
            <CommunityPreview />
          </Animated>

          <Animated delay={0.6}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                "Demographics",
                "Economic status",
                "Tech literacy",
                "Device access",
                "Cultural norms",
                "Motivation level",
              ].map((axis) => (
                <div
                  key={axis}
                  className="px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.015] text-center"
                >
                  <span className="text-[11px] text-white/30 font-mono">
                    {axis}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-white/15 font-mono mt-3 text-center tracking-wide">
              Every agent differs across these axes — just like your real users
            </p>
          </Animated>
        </div>
      </section>

      <Divider />

      {/* ── Features (with TiltCards) ───────────────────────────── */}
      <section id="features" className="py-24 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Animated>
            <SectionLabel>Core Architecture</SectionLabel>
          </Animated>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] mb-4 max-w-lg">
            <WordReveal>
              {"Where arguments become\nproduct decisions"}
            </WordReveal>
          </h2>
          <Animated delay={0.2}>
            <p className="text-[15px] text-white/35 font-light max-w-md leading-[1.7]">
              AI agents debate your product like real users would.
              Every objection, opportunity, and competitor gets distilled into one founder dashboard.
            </p>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mt-12 rounded-2xl border border-white/[0.04] overflow-hidden">
            {features.map((f, i) => (
              <Animated key={i} delay={i * 0.1}>
                <TiltCard className="cursor-default">
                  <div className="p-6 bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-300 min-h-[210px] group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-white/[0.08] bg-white/[0.02] group-hover:border-white/[0.15] transition-colors">
                      <f.icon size={16} className="text-white/50" />
                    </div>
                    <h3 className="font-display text-[14px] font-bold text-white/90 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-white/30 font-light">
                      {f.desc}
                    </p>
                  </div>
                </TiltCard>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Process ─────────────────────────────────────────────── */}
      <section className="py-24 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Animated>
            <SectionLabel>Process</SectionLabel>
          </Animated>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] mb-4 max-w-lg">
            <WordReveal>{"From idea to PMF signal\nin minutes, not months."}</WordReveal>
          </h2>

          <div className="mt-12">
            {steps.map((s, i) => (
              <Animated key={i} delay={i * 0.08}>
                <div className="grid grid-cols-[48px_1fr] border-b border-white/[0.04] group hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center justify-center border-r border-white/[0.04] font-mono text-xs text-white/[0.07] py-6 group-hover:text-white/20 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="py-6 px-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-white/90 mb-1">
                        {s.title}
                      </h3>
                      <p className="text-[13px] leading-[1.6] text-white/30 font-light max-w-md">
                        {s.desc}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-white/[0.05] mt-1 shrink-0 group-hover:text-white/20 transition-colors"
                    />
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-white/[0.04] overflow-hidden">
            {stats.map((s, i) => (
              <Animated key={i} delay={i * 0.1}>
                <div className="py-10 px-6 text-center bg-white/[0.015]">
                  <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white/90">
                    {s.value !== null ? (
                      <Counter target={s.value} suffix={s.suffix} />
                    ) : (
                      s.display
                    )}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/20 mt-2">
                    {s.label}
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter leading-[1.05] mb-4">
            <WordReveal>Ship with conviction,</WordReveal>
            <br />
            <span className="text-gradient-animated">
              <WordReveal delay={0.3}>not assumptions.</WordReveal>
            </span>
          </h2>

          <Animated delay={0.5}>
            <p className="text-[15px] text-white/35 font-light mb-9 max-w-sm mx-auto leading-[1.7]">
              Let synthetic communities shaped by real-world demographics
              pressure-test your product before your real users do.
            </p>
          </Animated>

          <Animated delay={0.7}>
            <EmailForm centered />
          </Animated>
        </div>
      </section>

      <Divider />

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[11px] text-white/15 tracking-wide">
        <span>© 2026 NullifAI</span>
        <span>Synthetic Communities for Product-Market Fit</span>
      </footer>
    </div>
  )
}
