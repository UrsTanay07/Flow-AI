import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function FlipText({
  children,
  className,
  duration = 0.5,
  delay = 0,
}: FlipTextProps) {
  const words = children.split(" ");

  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            duration: duration,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
          className="inline-block origin-bottom"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
