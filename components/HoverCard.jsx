"use client";

import { motion } from "framer-motion";

export default function HoverCard({ children, className = "" }) {
  return (
    <motion.div
      className={`relative block h-full w-full cursor-pointer ${className}`}
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
