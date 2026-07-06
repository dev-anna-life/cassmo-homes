"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImage({ children, speed = 0.15, className = "" }) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <motion.div 
      ref={ref} 
      className={`overflow-hidden relative cursor-pointer ${className}`}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        style={{ y }} 
        className="absolute top-[-25%] bottom-[-25%] left-0 right-0 will-change-transform pointer-events-none"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
