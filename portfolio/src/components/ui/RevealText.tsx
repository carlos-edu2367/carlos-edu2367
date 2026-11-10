import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  splitWords?: boolean;
}

export function RevealText({
  text,
  className = '',
  delay = 0,
  splitWords = false,
}: RevealTextProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  if (!splitWords) {
    return (
      <span className={`inline-block overflow-hidden align-bottom ${className}`.trim()}>
        <motion.span
          initial={{ y: '108%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.72,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block will-change-transform"
        >
          {text}
        </motion.span>
      </span>
    );
  }

  const words = text.split(' ');

  return (
    <span aria-label={text} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.62,
              delay: delay + index * 0.038,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block will-change-transform"
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
