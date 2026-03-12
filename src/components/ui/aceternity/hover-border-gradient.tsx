"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverBorderGradientProps<T extends React.ElementType> = {
  as?: T;
  containerClassName?: string;
  className?: string;
  duration?: number;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function HoverBorderGradient<T extends React.ElementType = "button">({
  as,
  containerClassName,
  className,
  duration = 1,
  children,
  ...props
}: HoverBorderGradientProps<T>) {
  const Component = as || "button";
  
  return (
    <Component
      className={cn(
        "relative flex rounded-full text-white items-center justify-center overflow-hidden bg-transparent p-[1px]",
        containerClassName
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration * 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 180deg, #3f3f46 180deg, #3f3f46 360deg)",
          }}
        />
      </motion.div>
      <div
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full bg-zinc-950 px-6 py-2 font-medium text-white",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
}
