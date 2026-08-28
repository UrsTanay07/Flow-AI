import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#4a7c99] dark:text-[#5d9dbf]"
      >
        <defs>
          <path id="textPathTop" d="M 50,40 Q 100,20 150,40" />
        </defs>

        {/* FLOW text */}
        <text
          fontSize="28"
          fontWeight="900"
          fontFamily="sans-serif"
          fill="currentColor"
          letterSpacing="0.1em"
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            FLOW
          </textPath>
        </text>

        {/* Main Arch Group */}
        <g transform="translate(0, 45)">
          {/* Base Semi-circle */}
          <path d="M 10,120 A 90,90 0 0,1 190,120 Z" fill="currentColor" />

          {/* Top Overpass - White/Background */}
          {/* Swoop from middle-left to middle-right */}
          <path
            d="M 10,80 Q 90,40 190,80 L 190,95 Q 90,55 10,95 Z"
            fill="var(--bg-color, white)"
            className="fill-white dark:fill-black"
          />
          {/* Dash line on Top Overpass */}
          <path
            d="M 10,87.5 Q 90,47.5 190,87.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
            fill="none"
          />
          {/* Top railing blocks */}
          <path d="M 20,74 v 6 M 35,68 v 6 M 50,63 v 6 M 65,59 v 6 M 80,55 v 6 M 95,53 v 6 M 110,52 v 6 M 125,52.5 v 6 M 140,54 v 6 M 155,57 v 6 M 170,61 v 6 M 185,67 v 6" stroke="var(--bg-color, white)" strokeWidth="3" className="stroke-white dark:stroke-black" />

          {/* Bottom Overpass - White/Background */}
          {/* Swoop from bottom-left to middle-right */}
          <path
            d="M 10,120 Q 50,80 180,100 L 180,120 L 160,120 Q 50,100 30,120 Z"
            fill="var(--bg-color, white)"
            className="fill-white dark:fill-black"
          />
          {/* Dash line on Bottom Overpass */}
          <path
            d="M 20,120 Q 50,90 170,110"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
            fill="none"
          />
          
          {/* Bridge Pillars for Bottom Overpass */}
          <rect x="110" y="105" width="4" height="15" fill="var(--bg-color, white)" className="fill-white dark:fill-black" />
          <rect x="130" y="107" width="5" height="13" fill="var(--bg-color, white)" className="fill-white dark:fill-black" />
          <rect x="150" y="110" width="6" height="10" fill="var(--bg-color, white)" className="fill-white dark:fill-black" />
          <rect x="170" y="113" width="6" height="7" fill="var(--bg-color, white)" className="fill-white dark:fill-black" />
        </g>

        {/* FIND YOUR FLOW text */}
        <text
          x="100"
          y="190"
          fontSize="16"
          fontWeight="800"
          fontFamily="sans-serif"
          fill="currentColor"
          textAnchor="middle"
          letterSpacing="0.05em"
        >
          FIND YOUR FLOW
        </text>
      </svg>
    </div>
  );
}
