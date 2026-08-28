"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  id: string;
}

export interface SpotlightNavbarProps {
  items: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  activeIndex?: number;
}

export function SpotlightNavbar({
  items,
  className,
  onItemClick,
  activeIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    onItemClick?.(item, index);
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow",
        "relative h-11 rounded-full transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Content */}
      <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
        {items.map((item, idx) => (
          <li key={idx} className="relative h-full flex items-center justify-center">
            <button
              data-index={idx}
              onClick={() => handleItemClick(item, idx)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/30",
                activeIndex === idx
                  ? "text-black dark:text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* 1. The Moving Spotlight (Follows Mouse) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
        style={{
          opacity: hoverX !== null ? 1 : 0,
          background: `
            radial-gradient(
              120px circle at var(--spotlight-x) 100%,
              var(--spotlight-color) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* 2. The Active State Ambience (Stays on Active) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
        style={{
          background: `
            radial-gradient(
              60px circle at var(--ambience-x) 0%,
              var(--ambience-color) 0%,
              transparent 100%
            )
          `,
        }}
      />
    </nav>
  );
}
