import { useEffect, useRef } from "react";
import "./styles/About.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";

const About = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && ScrollTrigger.isTouch) {
      container.classList.remove("about-noTouch");
      const handleClick = () => container.classList.toggle("about-content-active");
      container.addEventListener("click", handleClick);
      return () => container.removeEventListener("click", handleClick);
    }
  }, []);

  return (
    <div className="aboutME">
      <div className="about-box">
        <div style={{ marginRight: "10%", marginBottom: "100px", display: "flex", flexDirection: "column" }}>
          <h2 className="title" style={{ margin: 0 }}>ABOUT</h2>
          <h2 className="title" style={{ margin: 0 }}>
            <span className="e-h2" style={{ color: "var(--accentColor)" }}>M</span>E
          </h2>
        </div>
      </div>
      <div className="about-box">
        <div className="about-box-in">
          <div className="about-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="about-content about-noTouch"
            ref={containerRef}
          >
            <div className="about-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="about-corner"></div>

            <div className="about-content-in">
              <h3>{config.developer.title}</h3>
              <h4>{config.social.location}</h4>
              <p style={{ marginTop: '20px' }}>
                {config.about.description}
              </p>
              <div className="about-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
