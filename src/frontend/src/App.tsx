import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AdminPage from "./components/AdminPage";
import InteractiveOrb from "./components/InteractiveOrb";
import { useActor } from "./hooks/useActor";

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
  { label: "Suggestions", href: "#suggestions" },
];

// ─── Early Access Form ────────────────────────────────────────────────────────
function EarlyAccessForm() {
  const { actor } = useActor();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !actor) return;
    setIsSubmitting(true);
    setError("");
    try {
      await actor.submitSignup(email);
      setSubmitted(true);
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        data-ocid="form.success_state"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-10 px-6"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, #7c6eea, #9b90f0)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Success"
          >
            <title>Success</title>
            <path
              d="M5 13l4 4L19 7"
              stroke="#f5f5f5"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          className="font-display text-2xl mb-2"
          style={{ color: "#f5f5f5", letterSpacing: "-0.01em" }}
        >
          You&apos;re on the list.
        </p>
        <p className="text-sm" style={{ color: "#a0a0a0" }}>
          We&apos;ll be in touch.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      data-ocid="form.panel"
      onSubmit={handleSubmit}
      className="px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          data-ocid="form.input"
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2e2e2e",
            color: "#f5f5f5",
            caretColor: "#9b90f0",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #7c6eea";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(124,110,234,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #2e2e2e";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          data-ocid="form.submit_button"
          disabled={isSubmitting || !actor}
          className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.04] whitespace-nowrap flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #7c6eea 0%, #9b90f0 100%)",
            color: "#f5f5f5",
            boxShadow: isSubmitting
              ? "none"
              : "0 0 24px rgba(124,110,234,0.28)",
          }}
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? "Submitting..." : "SUBMIT"}
        </button>
      </div>
      {error && (
        <p
          data-ocid="form.error_state"
          className="mt-3 text-center text-xs"
          style={{ color: "#ef4444" }}
        >
          {error}
        </p>
      )}
      <p className="mt-4 text-center text-xs" style={{ color: "#444444" }}>
        No spam. Ever.
      </p>
    </form>
  );
}

// ─── Suggestion Form ──────────────────────────────────────────────────────────
function SuggestionForm() {
  const { actor } = useActor();
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !actor) return;
    setIsSubmitting(true);
    setError("");
    try {
      await (actor as any).submitSuggestion(text.trim());
      setSubmitted(true);
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        data-ocid="suggestion.success_state"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-10 px-6"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Success"
          >
            <title>Success</title>
            <path
              d="M5 13l4 4L19 7"
              stroke="#0d0d0d"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          className="font-display text-2xl mb-2"
          style={{ color: "#f5f5f5", letterSpacing: "-0.01em" }}
        >
          Thanks for your suggestion!
        </p>
        <p className="text-sm" style={{ color: "#a0a0a0" }}>
          We read every single one.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      data-ocid="suggestion.panel"
      onSubmit={handleSubmit}
      className="px-6 py-8 sm:px-10 sm:py-10"
    >
      <textarea
        data-ocid="suggestion.textarea"
        required
        rows={4}
        placeholder="What features would you love to see in Clario? What problems should we solve first?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-5 py-4 rounded-2xl text-sm outline-none transition-all duration-200 resize-none mb-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid #2e2e2e",
          color: "#f5f5f5",
          caretColor: "#9b90f0",
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid #7c6eea";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,110,234,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid #2e2e2e";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#444444" }}>
          Anonymous & honest — say exactly what you think.
        </p>
        <button
          type="submit"
          data-ocid="suggestion.submit_button"
          disabled={isSubmitting || !actor || !text.trim()}
          className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.04] whitespace-nowrap flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #7c6eea 0%, #9b90f0 100%)",
            color: "#f5f5f5",
            boxShadow: isSubmitting
              ? "none"
              : "0 0 24px rgba(124,110,234,0.28)",
          }}
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? "Submitting..." : "SUBMIT"}
        </button>
      </div>
      {error && (
        <p
          data-ocid="suggestion.error_state"
          className="mt-3 text-center text-xs"
          style={{ color: "#ef4444" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroIn(true), 300);
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onMouse = (e: MouseEvent) =>
      setCursorPos({ x: e.clientX, y: e.clientY });
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // Route to admin page
  if (hash === "#admin") {
    return <AdminPage />;
  }

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
        <div className="max-w-2xl mx-auto">
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

          <Reveal>
            <div
              className="card-dark rounded-sm overflow-hidden mx-auto"
              style={{ maxWidth: 600 }}
            >
              <EarlyAccessForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <div className="divider" />
      </div>

      {/* ── Suggestions ── */}
      <section id="suggestions" className="py-28 px-8 md:px-14">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="section-label mb-4">Your Voice Matters</p>
            <h2
              className="font-display text-4xl md:text-5xl mb-5"
              style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
            >
              Share Your
              <br />
              <span className="text-gold">Thoughts</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>
              Tell us what features matter most to you. Every suggestion shapes
              what Clario becomes.
            </p>
          </Reveal>

          <Reveal>
            <div
              className="card-dark rounded-sm overflow-hidden mx-auto"
              style={{ maxWidth: 600 }}
            >
              <SuggestionForm />
            </div>
          </Reveal>
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
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "#2e2e2e" }}>
              © {new Date().getFullYear()} Clario. All rights reserved.
            </span>
            {/* Hidden admin link */}
            <button
              type="button"
              data-ocid="footer.link"
              onClick={() => {
                window.location.hash = "admin";
              }}
              className="text-xs cursor-pointer"
              style={{
                color: "#2e2e2e",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
