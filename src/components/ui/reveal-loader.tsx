import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type StaggerType = "left-to-right" | "right-to-left" | "center-out" | "edges-in";
export type MovementType = "top-down" | "bottom-up" | "fade-out" | "scale-vertical";

interface RevealLoaderProps {
  /** Text to display */
  text?: string;
  /** CSS font-size (e.g., "80px", "5rem") */
  textSize?: string;
  /** CSS color or hex code */
  textColor?: string;
  /** Array of colors for background (1 for solid, >1 for gradient) */
  bgColors?: string[];
  /** Gradient angle in degrees */
  angle?: number;
  /** Order in which bars animate out */
  staggerOrder?: StaggerType;
  /** Direction/Style of the exit animation */
  movementDirection?: MovementType;
  /** Delay (seconds) before text fades out relative to bars start */
  textFadeDelay?: number;
  className?: string;
  onComplete?: () => void;
}

const RevealLoader = ({
  text = "FlowAI",
  textSize = "100px",
  textColor = "white",
  bgColors = ["#000000"],
  angle = 0,
  staggerOrder = "left-to-right",
  movementDirection = "top-down",
  textFadeDelay = 0.5,
  className,
  onComplete,
}: RevealLoaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    if (bgColors.length === 0) return { backgroundColor: "black" };
    if (bgColors.length === 1) return { backgroundColor: bgColors[0] };
    return {
      backgroundImage: `linear-gradient(${angle}deg, ${bgColors.join(", ")})`,
    };
  };

  const getStaggerFrom = (type: StaggerType): string | number => {
    switch (type) {
      case "right-to-left": return "end";
      case "center-out": return "center";
      case "edges-in": return "edges";
      case "left-to-right":
      default: return "start";
    }
  };

  const getAnimationProperties = (type: MovementType) => {
    switch (type) {
      case "bottom-up":
        return { y: "-100%", ease: "power2.inOut" };
      case "fade-out":
        return { autoAlpha: 0, ease: "power2.inOut" };
      case "scale-vertical":
        return { scaleY: 0, transformOrigin: "center", ease: "power2.inOut" };
      case "top-down":
      default:
        return { y: "100%", ease: "power2.inOut" };
    }
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      const moveProps = getAnimationProperties(movementDirection);
      const staggerConfig = {
        each: 0.1,
        from: getStaggerFrom(staggerOrder) as any,
      };

      tl.to(".name-text span", {
        y: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: "power2.out",
      });

      tl.to(".preloader-item", {
        delay: 1,
        duration: 0.5,
        stagger: staggerConfig,
        ...moveProps,
      })
        .to(".name-text span", { autoAlpha: 0, duration: 0.3 }, `<${textFadeDelay}`)
        .to(preloaderRef.current, { autoAlpha: 0, duration: 0.1 }, "+=0.1");
    },
    { scope: preloaderRef, dependencies: [staggerOrder, movementDirection, textFadeDelay] },
  );

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex overflow-hidden bg-transparent",
        className,
      )}
      ref={preloaderRef}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="preloader-item h-full w-[10%]"
          style={getBackgroundStyle()}
        ></div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="overflow-hidden">
          <p
            className="name-text flex leading-none tracking-tighter"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: textSize,
              color: textColor,
              fontWeight: "400",
              textTransform: "uppercase",
              zIndex: 10,
              position: "relative",
            }}
          >
            {text.split("").map((char, index) => (
              <span key={index} className="inline-block translate-y-full">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevealLoader;
