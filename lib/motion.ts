export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.25,
    normal: 0.55,
    slow: 0.9,
  },
};

export const revealVariants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.ease },
  },
};

export const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};
