import React, { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function LiquidMetalButton({
  icon,
  size = "md",
  children,
  className,
  ...props
}: LiquidMetalButtonProps) {
  const filterId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4 text-lg font-semibold",
  };

  const handleMouseMove = (e: any) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    // @ts-ignore - motion/react conflicting types
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer group",
        "text-white font-medium bg-black",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* SVG Liquid Distortion Filter */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id={`liquid-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.015;0.025;0.015"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                values="2;8;2"
                dur="6s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Animated liquid shimmer layer on top of black */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          filter: `url(#liquid-${filterId})`,
          background: `
            radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%),
            linear-gradient(
              120deg,
              transparent 0%,
              rgba(255,255,255,0.05) 25%,
              rgba(255,255,255,0.12) 50%,
              rgba(255,255,255,0.05) 75%,
              transparent 100%
            )
          `,
          backgroundSize: "300% 100%",
          animation: "liquid-shift 3s ease-in-out infinite",
        }}
      />

      {/* Chrome reflection sweep on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700"
        style={{
          background: `
            linear-gradient(
              105deg,
              transparent 30%,
              rgba(255,255,255,0.15) 45%,
              rgba(255,255,255,0.35) 50%,
              rgba(255,255,255,0.15) 55%,
              transparent 70%
            )
          `,
          backgroundSize: "200% 100%",
          animation: "shimmer-sweep 2s ease-in-out infinite",
        }}
      />

      {/* Subtle top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-20 group-hover:opacity-40 transition-opacity"
        style={{
          background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)",
        }}
      />

      {/* Mouse-following spot highlight */}
      <div
        className="absolute w-20 h-20 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>

      {/* Subtle border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes liquid-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.button>
  );
}
