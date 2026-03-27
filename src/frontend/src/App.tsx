import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import InteractiveOrb from "./components/InteractiveOrb";

// ─── Scroll reveal wrapper ────────────────────────────────────────────────────
const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Floating label input ─────────────────────────────────────────────────────
const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  "data-ocid": dataOcid,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  "data-ocid"?: string;
}) => (
  <div className="float-label-wrap">
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      required={required}
      data-ocid={dataOcid}
      className="w-full rounded-sm text-headline px-4 pt-6 pb-2 text-sm focus:outline-none transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #2e2e2e",
        caretColor: "#9b90f0",
        color: "#f5f5f5",
      }}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

const FloatingTextarea = ({
  id,
  label,
  value,
  onChange,
  rows = 3,
  "data-ocid": dataOcid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  "data-ocid"?: string;
}) => (
  <div className="float-label-wrap textarea-wrap">
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      rows={rows}
      data-ocid={dataOcid}
      className="w-full rounded-sm text-headline px-4 pt-7 pb-3 text-sm focus:outline-none transition-all duration-200 resize-none"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #2e2e2e",
        caretColor: "#9b90f0",
        color: "#f5f5f5",
      }}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const approachCards = [
  {
    num: "01",
    title: "Structured Roadmaps",
    desc: "A clear path from where you are to where you want to be — no guesswork, no overwhelm.",
  },
  {
    num: "02",
    title: "Curated Resources",
    desc: "Only what matters, none of the noise. Every resource is handpicked and sequenced to work.",
  },
  {
    num: "03",
    title: "Daily Action Steps",
    desc: "Turn plans into progress every single day with clear, manageable steps that compound.",
  },
];

const pathways = [
  {
    title: "Mental Fortitude",
    tag: "Mindset",
    img: "/assets/generated/pathway-mental-fortitude.dim_600x400.jpg",
  },
  {
    title: "Purpose & Drive",
    tag: "Motivation",
    img: "/assets/generated/pathway-purpose-drive.dim_600x400.jpg",
  },
  {
    title: "Mindfulness",
    tag: "Wellbeing",
    img: "/assets/generated/pathway-mindfulness.dim_600x400.jpg",
  },
  {
    title: "Career Mastery",
    tag: "Growth",
    img: "/assets/generated/pathway-career-mastery.dim_600x400.jpg",
  },
  {
    title: "Physical Health",
    tag: "Body",
    img: "/assets/generated/pathway-physical-health.dim_600x400.jpg",
  },
  {
    title: "Relationships",
    tag: "Connection",
    img: "/assets/generated/pathway-relationships.dim_600x400.jpg",
  },
];

const navLinks = [
  { label: "Discover", href: "#approach" },
  { label: "Pathways", href: "#pathways" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#early-access" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [heroIn, setHeroIn] = useState(false);
  const [email, setEmail] = useState("");
  const [improvementGoal, setImprovementGoal] = useState("");
  const [biggestProblem, setBiggestProblem] = useState("");
  const [wouldUse, setWouldUse] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [formStatus, setFormStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  useEffect(() => {
    const timer = setTimeout(() => setHeroIn(true), 300);
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onMouse = (e: MouseEvent) =>
      setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setFormStatus("pending");
    const url = `https://docs.google.com/forms/d/e/1FAIpQLSeA8O9cxSHlrRUYDEfmH3JBgAg9NOq4mtfGRbQYKaQsInBoOw/formResponse?entry.922709782=${encodeURIComponent(email)}`;
    fetch(url, { mode: "no-cors" })
      .then(() => setFormStatus("success"))
      .catch(() => setFormStatus("success")); // no-cors always resolves, treat as success
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)",
      }}
    >
      {/* Custom cursor */}
      <div
        className="cursor-dot hidden md:block"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
        }}
      />

      {/* ── Header ── */}
      <header
        data-ocid="nav.panel"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(13,13,13,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid #242424" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-14 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #7c6eea, #9b90f0)",
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              C
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Clario
            </span>
          </div>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-ocid="nav.link"
                className="text-sm font-medium transition-colors duration-200 hover:text-headline"
                style={{ color: "#666666" }}
                onClick={(e) => {
                  e.preventDefault();
                  const id = l.href.replace("#", "");
                  scrollTo(id);
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button
            type="button"
            data-ocid="nav.primary_button"
            onClick={() => scrollTo("early-access")}
            className="hidden md:flex items-center text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 hover:bg-white/5"
            style={{
              border: "1px solid #2e2e2e",
              color: "#f5f5f5",
            }}
          >
            Get Early Access
          </button>

          {/* Mobile CTA */}
          <button
            type="button"
            data-ocid="nav.primary_button"
            onClick={() => scrollTo("early-access")}
            className="md:hidden text-sm font-semibold px-4 py-1.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #7c6eea, #9b90f0)",
              color: "#f5f5f5",
            }}
          >
            Access
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 65% 40%, rgba(124,110,234,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center py-24">
          {/* Left: copy */}
          <div>
            <AnimatePresence>
              {heroIn && (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0 }}
                    className="section-label mb-6"
                  >
                    Coming Soon
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-7"
                    style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
                  >
                    UNEARTH YOUR
                    <br />
                    <span className="text-gold">TRUE</span> POTENTIAL.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
                    style={{ color: "#a0a0a0" }}
                  >
                    Turn confusion into action with structured roadmaps, curated
                    resources, and real-life solutions built for people who want
                    genuine change.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <button
                      type="button"
                      data-ocid="hero.primary_button"
                      onClick={() => scrollTo("early-access")}
                      className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
                      style={{
                        background:
                          "linear-gradient(135deg, #7c6eea 0%, #9b90f0 100%)",
                        color: "#f5f5f5",
                        boxShadow: "0 0 32px rgba(124,110,234,0.3)",
                      }}
                    >
                      BE FIRST TO KNOW
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Right: orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={heroIn ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center orb-container w-full"
            style={{ height: "480px" }}
          >
            <InteractiveOrb />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroIn ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#2e2e2e] to-transparent" />
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "#666666" }}
          >
            Scroll
          </span>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <div className="divider" />
      </div>

      {/* ── Our Approach ── */}
      <section id="approach" className="py-28 px-8 md:px-14">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <p className="section-label mb-4">Our Approach</p>
            <h2
              className="font-display text-4xl md:text-5xl"
              style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
            >
              The Three Pillars of
              <br />
              <span className="text-gold">Lasting Progress</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approachCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.12}>
                <div
                  data-ocid={`approach.item.${i + 1}`}
                  className="card-dark-hover rounded-sm p-8 h-full"
                >
                  <span
                    className="block text-5xl font-light mb-6 leading-none"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      color: "rgba(124,110,234,0.2)",
                    }}
                  >
                    {card.num}
                  </span>
                  <h3
                    className="font-semibold text-lg mb-3"
                    style={{ color: "#f5f5f5" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#a0a0a0" }}
                  >
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <div className="divider" />
      </div>

      {/* ── Explore Pathways ── */}
      <section id="pathways" className="py-28">
        <div className="max-w-6xl mx-auto px-8 md:px-14 mb-12">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="section-label mb-4">Planned Pathways</p>
                <h2
                  className="font-display text-4xl md:text-5xl"
                  style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
                >
                  Choose Your
                  <br />
                  <em className="not-italic text-gold">Direction</em>
                </h2>
              </div>
              <p
                className="hidden md:block text-sm max-w-xs text-right"
                style={{ color: "#666666" }}
              >
                Six curated pathways designed to create lasting change in every
                area of life.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Horizontal scroll */}
        <div className="pl-8 md:pl-14">
          <div className="pathway-scroll">
            {pathways.map((p, i) => (
              <div
                key={p.title}
                data-ocid={`pathway.item.${i + 1}`}
                className="pathway-card card-dark-hover rounded-sm overflow-hidden group cursor-default"
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: 200 }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 50%)",
                    }}
                  />
                </div>
                <div className="p-6">
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase mb-2 block"
                    style={{ color: "#9b90f0" }}
                  >
                    {p.tag}
                  </span>
                  <h3
                    className="font-display text-xl"
                    style={{ color: "#f5f5f5" }}
                  >
                    {p.title}
                  </h3>
                </div>
              </div>
            ))}
            {/* Trailing spacer */}
            <div style={{ flex: "0 0 32px" }} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <div className="divider" />
      </div>

      {/* ── About strip ── */}
      <section id="about" className="py-24 px-8 md:px-14">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="section-label mb-5">Built For Change</p>
                <h2
                  className="font-display text-4xl md:text-5xl mb-6"
                  style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
                >
                  Not more content.
                  <br />
                  <span className="text-gold">Just the right path.</span>
                </h2>
              </div>
              <div>
                <p
                  className="text-base leading-relaxed mb-5"
                  style={{ color: "#a0a0a0" }}
                >
                  The internet is flooded with information. The real problem
                  isn&apos;t access to knowledge — it&apos;s the absence of a
                  clear, personalized path through it.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#666666" }}
                >
                  Clario is being built for people who are serious about growth.
                  We&apos;re distilling what matters, sequencing it properly,
                  and creating the daily structure to make real progress — not
                  just consume more.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <div className="divider" />
      </div>

      {/* ── Early Access Form ── */}
      <section id="early-access" className="py-28 px-8 md:px-14">
        <div className="max-w-xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="section-label mb-4">We&apos;re Building This</p>
            <h2
              className="font-display text-4xl md:text-5xl mb-5"
              style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
            >
              Help Shape
              <br />
              <span className="text-gold">What We Build</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>
              Clario is in development. Be first to know when we launch — and
              help us build something that actually works for you.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {formStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                data-ocid="form.success_state"
                className="rounded-sm p-12 text-center card-dark"
                style={{ boxShadow: "0 0 80px rgba(124,110,234,0.1)" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(124,110,234,0.18) 0%, transparent 70%)",
                    border: "1px solid rgba(124,110,234,0.4)",
                    boxShadow: "0 0 40px rgba(124,110,234,0.2)",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    role="img"
                    aria-label="Success"
                  >
                    <motion.path
                      d="M6 14 L11.5 19.5 L22 8"
                      stroke="#9b90f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>
                <h3
                  className="font-display text-2xl mb-3"
                  style={{ color: "#f5f5f5" }}
                >
                  You&apos;re In.
                </h3>
                <p className="text-sm" style={{ color: "#666666" }}>
                  We&apos;ll build Clario with you. Watch your inbox.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                data-ocid="form.panel"
                className="rounded-sm p-8 md:p-10 flex flex-col gap-5 card-dark"
              >
                <FloatingInput
                  id="email"
                  label="Email address *"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  data-ocid="form.input"
                />

                <FloatingTextarea
                  id="improvement"
                  label="What do you want to improve?"
                  value={improvementGoal}
                  onChange={setImprovementGoal}
                  data-ocid="form.textarea"
                />

                <FloatingTextarea
                  id="problem"
                  label="Biggest challenge right now?"
                  value={biggestProblem}
                  onChange={setBiggestProblem}
                />

                {/* Would use toggle */}
                <div>
                  <p
                    className="text-xs mb-3 tracking-wide uppercase font-medium"
                    style={{
                      color: "#666666",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Would you use Clario?
                  </p>
                  <div className="flex gap-3">
                    {["Yes", "No", "Maybe"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        data-ocid="form.toggle"
                        onClick={() => setWouldUse(opt)}
                        className="flex-1 py-2.5 rounded-sm text-sm font-medium transition-all duration-200"
                        style={{
                          background:
                            wouldUse === opt
                              ? "rgba(124,110,234,0.12)"
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${
                            wouldUse === opt
                              ? "rgba(124,110,234,0.5)"
                              : "#2e2e2e"
                          }`,
                          color: wouldUse === opt ? "#9b90f0" : "#666666",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <FloatingTextarea
                  id="suggestions"
                  label="Suggestions (optional)"
                  value={suggestions}
                  onChange={setSuggestions}
                />

                {formStatus === "error" && (
                  <div
                    data-ocid="form.error_state"
                    className="rounded-sm px-4 py-3 text-xs"
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#fca5a5",
                    }}
                  >
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  data-ocid="form.submit_button"
                  disabled={formStatus === "pending" || !email}
                  className="w-full py-4 rounded-sm font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c6eea 0%, #9b90f0 100%)",
                    color: "#f5f5f5",
                    letterSpacing: "0.05em",
                    boxShadow: "0 0 32px rgba(124,110,234,0.25)",
                  }}
                >
                  {formStatus === "pending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "SUBMIT"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #242424" }}>
        <div className="max-w-6xl mx-auto px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #7c6eea, #9b90f0)",
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              C
            </div>
            <span
              className="text-base font-semibold"
              style={{
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Clario
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-ocid="footer.link"
                className="text-xs transition-colors hover:text-headline"
                style={{ color: "#666666" }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href.replace("#", ""));
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <span className="text-xs" style={{ color: "#2e2e2e" }}>
            © {new Date().getFullYear()} Clario. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
