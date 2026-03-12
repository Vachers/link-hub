"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, controls]);

  const renderWords = () => {
    return (
      <motion.div ref={ref}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="inline-block"
            >
              {word.split("").map((char, index) => (
                <motion.span
                  key={char + index}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 10,
                      filter: "blur(10px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    },
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      {renderWords()}
    </div>
  );
};
