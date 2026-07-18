"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home", id: "home", icon: Home },
  { label: "Features", href: "#features", id: "features" },
  { label: "Pricing", href: "#pricing", id: "pricing" },
  { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      setVisible(!isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: figure out which section is currently under the navbar
  // so the sliding underline can track it as the user scrolls, not just
  // when they click.
  useEffect(() => {
    const sectionIds = navItems
      .filter((item) => item.id !== "home")
      .map((item) => item.id);

    const handleActiveSection = () => {
      const NAVBAR_OFFSET = 140;

      if (window.scrollY < 80) {
        setActiveSection("home");
        return;
      }

      const scrollPos = window.scrollY + NAVBAR_OFFSET;
      let current = "home";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    handleActiveSection();
    window.addEventListener("scroll", handleActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  const showNavbar = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
  };

  const hideNavbar = () => {
    if (window.scrollY <= 20) return;
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  // Nav item click: close mobile menu, hide the floating bar (existing
  // behavior), then smooth-scroll to the target section ourselves instead
  // of relying on the browser's instant anchor jump. Sets the active
  // section immediately so the underline slides right away instead of
  // waiting for the scroll-spy to catch up mid-scroll.
  const handleNavClick = (e: MouseEvent, href: string, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(id);

    if (id === "home") {
      // Already home: just scroll to top, keep the bar visible — there's
      // no new section to reveal, so nothing should disappear.
      if (activeSection !== "home") {
        setVisible(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setVisible(false);
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sign In / Get Started etc. — no scroll target, just close menu.
  const handleActionClick = () => {
    setMobileOpen(false);
    setVisible(false);
  };

  return (
    <>
      {/* Invisible Hover Zone */}
      <div
        className="fixed left-0 top-0 z-[60] h-10 w-full"
        onMouseEnter={showNavbar}
      />

      {/* Navbar */}
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : -82 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        onMouseEnter={showNavbar}
        onMouseLeave={hideNavbar}
        className="fixed left-0 right-0 top-0 z-50 flex justify-center px-5 py-4"
        style={{
          pointerEvents: visible ? "auto" : "none",
          // keep the header itself as a light-weight transform-only layer
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/*
          IMPORTANT: the glass frame (background + backdrop-blur) lives on a
          plain, non-animated element. It is never the thing that fades/scales,
          so the browser can keep the backdrop-filter composited and ready
          at all times — it doesn't have to "catch up" after the slide-in.
          Only the wrapper above animates a transform.
        */}
        <nav
          className={`relative w-full max-w-7xl overflow-hidden rounded-3xl
            border border-white/15
            bg-white/[0.08]
            backdrop-blur-3xl backdrop-saturate-150
            shadow-[0_8px_40px_rgba(0,0,0,0.35)]
            transition-colors duration-300
            ${scrolled ? "border-white/20 bg-white/[0.10]" : ""}`}
          style={{
            // forces the browser to keep this layer's backdrop-filter
            // pre-composited instead of computing it lazily on reveal
            willChange: "backdrop-filter",
            WebkitBackdropFilter: "blur(64px) saturate(150%)",
          }}
        >
          {/* Liquid Glass shine layer — static, always fully rendered.
              No independent opacity/scale animation, so it can't lag
              behind the frame anymore. */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div className="absolute left-1/2 -top-28 h-56 w-[28rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -left-24 top-0 h-full w-52 rotate-12 bg-gradient-to-r from-white/12 via-white/6 to-transparent blur-2xl" />
            <div className="absolute -right-24 top-0 h-full w-52 -rotate-12 bg-gradient-to-l from-white/10 via-white/5 to-transparent blur-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
          </div>

          <div className="relative flex h-16 items-center justify-between px-8">
            {/* Logo */}
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 font-semibold text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="leading-tight">
                <p className="text-lg font-bold tracking-wide">Insight</p>
                <p className="text-xs text-slate-400">
                  Explainable AI Investing
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                    className={`relative flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>

                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden items-center gap-4 lg:flex">
              <button
                onClick={handleActionClick}
                className="rounded-xl border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Sign In
              </button>

              <button
                onClick={handleActionClick}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white lg:hidden"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="fixed left-5 right-5 top-24 z-40 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-3xl lg:hidden"
          >
            <div className="flex flex-col gap-5">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                    className={`relative flex items-center gap-2 pl-3 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline-mobile"
                        className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={handleActionClick}
                  className="rounded-xl border border-white/10 py-3 text-slate-300"
                >
                  Sign In
                </button>

                <button
                  onClick={handleActionClick}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}