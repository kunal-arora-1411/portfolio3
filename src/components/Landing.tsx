import { useEffect, useRef, useState, useCallback } from "react";
import "./styles/Landing.css";
import { config } from "../config";
import FrameCanvas from "./FrameCanvas";
import About from "./About";
import WhatIDo from "./WhatIDo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const whatRef = useRef<HTMLDivElement>(null);
  const [framesReady, setFramesReady] = useState(false);

  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleFramesReady = useCallback(() => {
    setFramesReady(true);
  }, []);

  useEffect(() => {
    if (!framesReady) return;

    const renderFrame = (window as any).__renderFrame;
    const frameCount = (window as any).__frameCount;
    if (!renderFrame || !frameCount) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate(st) {
        const progress = st.progress;

        // Render frame based on scroll
        const idx = Math.round(progress * (frameCount - 1));
        requestAnimationFrame(() => renderFrame(idx));

        // --- Hero: visible 0–12%, fades out 12–18% ---
        if (heroRef.current) {
          let op = 1;
          if (progress > 0.12) {
            op = Math.max(0, 1 - (progress - 0.12) / 0.06);
          }
          heroRef.current.style.opacity = String(op);
          heroRef.current.style.visibility = op > 0 ? "visible" : "hidden";
          // slide up as it fades
          heroRef.current.style.transform = `translateY(${-(1 - op) * 40}%)`;
        }

        // --- About: fades in 18–28%, holds 28–45%, fades out 45–55% ---
        if (aboutRef.current) {
          let op = 0;
          if (progress >= 0.18 && progress < 0.28) {
            op = (progress - 0.18) / 0.10;
          } else if (progress >= 0.28 && progress <= 0.45) {
            op = 1;
          } else if (progress > 0.45 && progress < 0.55) {
            op = 1 - (progress - 0.45) / 0.10;
          }
          op = Math.max(0, Math.min(1, op));
          aboutRef.current.style.opacity = String(op);
          aboutRef.current.style.visibility = op > 0 ? "visible" : "hidden";
          if (progress > 0.28) {
            const drift = Math.min(1, (progress - 0.28) / 0.27);
            aboutRef.current.style.transform = `translateY(${-drift * 15}%)`;
          } else {
            aboutRef.current.style.transform = `translateY(${(1 - op) * 30}px)`;
          }
        }

        // --- WhatIDo: fades in 55–65%, holds 65–82%, fades out 82–92% ---
        if (whatRef.current) {
          let op = 0;
          if (progress >= 0.55 && progress < 0.65) {
            op = (progress - 0.55) / 0.10;
          } else if (progress >= 0.65 && progress <= 0.82) {
            op = 1;
          } else if (progress > 0.82 && progress < 0.92) {
            op = 1 - (progress - 0.82) / 0.10;
          }
          op = Math.max(0, Math.min(1, op));
          whatRef.current.style.opacity = String(op);
          whatRef.current.style.visibility = op > 0 ? "visible" : "hidden";
          // slight upward drift as it exits (like old tl3: y 0 → 15%)
          if (progress > 0.65) {
            const drift = Math.min(1, (progress - 0.65) / 0.27);
            whatRef.current.style.transform = `translateY(${-drift * 15}%)`;
          } else {
            whatRef.current.style.transform = `translateY(${(1 - op) * 30}px)`;
          }
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [framesReady]);

  return (
    <div className="landing-section" id="landingDiv" ref={sectionRef}>
      <FrameCanvas onReady={handleFramesReady} />

      {/* Hero Name */}
      <div
        className="scroll-panel"
        id="panel-hero"
        ref={heroRef}
        style={{ opacity: 1, visibility: "visible" }}
      >
        <div className="panel-inner panel-center">
          <p className="hero-greeting">Hello! I'm</p>
          <h1 className="hero-name">
            {firstName.toUpperCase()}
            <br />
            {lastName.toUpperCase()}
          </h1>
          <div className="hero-line"></div>
          <p className="hero-role">AI Researcher / Full-Stack Developer</p>
        </div>
      </div>

      {/* About Me — original component, pinned as overlay */}
      <div
        className="scroll-panel scroll-panel-about"
        ref={aboutRef}
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <About />
      </div>

      {/* What I Do — original component, pinned as overlay */}
      <div
        className="scroll-panel scroll-panel-what"
        ref={whatRef}
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <WhatIDo />
      </div>
    </div>
  );
};

export default Landing;
