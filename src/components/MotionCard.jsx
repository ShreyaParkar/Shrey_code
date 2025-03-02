"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MotionCard({ title, description, href, bgColor }) {
  const cardVariants = {
    initial: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.05, opacity: 1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <Link href={href}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`${bgColor} p-8 text-black text-center rounded-xl shadow-lg cursor-pointer`}
      >
        <h2 className="text-2xl font-semibold text-black">{title}</h2>
        <p className="mt-2 text-sm text-black opacity-80">{description}</p>
      </motion.div>
    </Link>
  );
}
