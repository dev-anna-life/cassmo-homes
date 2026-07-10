"use client";

import { motion } from "framer-motion";

const VARIANTS = {
  up:    { hidden: { opacity: 0, y: 50 },        visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -40 },       visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -80 },       visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 80 },        visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.90 },  visible: { opacity: 1, scale: 1 } },
  flip:  { hidden: { opacity: 0, rotateX: 25 },  visible: { opacity: 1, rotateX: 0 } },
  fade:  { hidden: { opacity: 0 },               visible: { opacity: 1 } },
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  type = "up",
  duration = 0.7,
}) {
  const variant = VARIANTS[type] || VARIANTS.up;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={variant}
      transition={{
        duration: duration,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={type === "flip" ? { transformOrigin: "top center", perspective: 700 } : {}}
    >
      {children}
    </motion.div>
  );
}
