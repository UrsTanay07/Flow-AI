import React from "react";
import { motion } from "motion/react";

export function CyberGrid() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#f4f4f5] dark:bg-[#050505] transition-colors duration-500">
      {/* Dynamic ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[400px] bg-purple-400/20 dark:bg-purple-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
      
      {/* Perspective Grid */}
      <div 
        className="absolute bottom-0 w-[200%] h-[50vh] left-[-50%] [perspective:1000px] [transform-style:preserve-3d]"
        style={{ maskImage: "linear-gradient(to top, white 20%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, white 20%, transparent 100%)" }}
      >
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] transition-colors duration-500"
          style={{ transformOrigin: "bottom center" }}
          initial={{ transform: "rotateX(75deg) translateY(0)" }}
          animate={{ transform: "rotateX(75deg) translateY(4rem)" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
        />
      </div>

      {/* Tiny floating data particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-black/20 dark:bg-white/30 rounded-full transition-colors duration-500"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: Math.random() * 0.5,
          }}
          animate={{
            y: [null, `${Math.random() * 100}vh`],
            opacity: [null, Math.random() * 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
