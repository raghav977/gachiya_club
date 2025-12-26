"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingOverlay - A reusable overlay component for loading/fetching states
 * 
 * @param {boolean} isLoading - Whether to show the overlay
 * @param {string} message - Optional message to display
 * @param {boolean} fullScreen - If true, covers the entire viewport; otherwise, covers the parent container
 * @param {string} variant - "spinner" | "dots" | "pulse" - animation style
 * @param {string} className - Additional classes for customization
 */
export default function LoadingOverlay({
  isLoading = false,
  message = "Loading...",
  fullScreen = false,
  variant = "spinner",
  className = "",
  blur = true,
}) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            ${fullScreen ? "fixed inset-0" : "absolute inset-0"}
            z-50 flex items-center justify-center
            ${blur ? "bg-white/60 backdrop-blur-sm" : "bg-white/80"}
            ${className}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            {variant === "spinner" && <Spinner />}
            {variant === "dots" && <Dots />}
            {variant === "pulse" && <Pulse />}
            {message && (
              <p className="text-sm text-gray-600 font-medium animate-pulse">
                {message}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Spinner - Classic spinning circle
// ─────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dots - Bouncing dots animation
// ─────────────────────────────────────────────────────────────
function Dots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-yellow-500 rounded-full"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pulse - Pulsing circle animation
// ─────────────────────────────────────────────────────────────
function Pulse() {
  return (
    <div className="relative w-12 h-12">
      <motion.div
        className="absolute inset-0 rounded-full bg-yellow-400"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.7, 0.2, 0.7],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-2 rounded-full bg-yellow-500" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// InlineLoader - Small inline loading indicator
// ─────────────────────────────────────────────────────────────
export function InlineLoader({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// ButtonLoader - Loader specifically for button states
// ─────────────────────────────────────────────────────────────
export function ButtonLoader({ size = "sm" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-3",
  };

  return (
    <div className={`relative ${sizeClasses[size] || sizeClasses.sm}`}>
      <div className="absolute inset-0 rounded-full border-current opacity-25" style={{ borderWidth: 'inherit' }} />
      <div
        className="absolute inset-0 rounded-full border-transparent border-t-current animate-spin"
        style={{ borderWidth: 'inherit' }}
      />
    </div>
  );
}
