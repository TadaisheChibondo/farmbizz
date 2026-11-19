import { motion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0, stagger = false }) {
  // If stagger is true, this wrapper orchestrates its children.
  // We use "whileInView" with "viewport={{ once: true, margin: '-100px' }}"
  // This means the animation only triggers once when the element is 100px inside the viewport.

  if (stagger) {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15, // Delay between each child card animating in
        },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {children}
      </motion.div>
    );
  }

  // Standard Fade-Up for single elements (like Headers or single buttons)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
