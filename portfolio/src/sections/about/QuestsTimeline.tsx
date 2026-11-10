import { useRef } from 'react';
import { Award, CheckCircle2, Cpu } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

export function QuestsTimeline() {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const spineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
  });

  return (
    <div className="space-y-10">
      {/* Bio & Arcaika Field Record */}
      <div className="rounded-2xl border border-primary/25 bg-surface/80 p-6 sm:p-7">
        <p className="text-base leading-relaxed font-medium text-ink sm:text-lg">{t.about.lead}</p>
        <p className="mt-3.5 text-sm leading-relaxed text-muted sm:text-base">{t.about.bio}</p>

        {/* Traits / Perks Chips */}
        <div className="mt-6 border-t border-primary/15 pt-5">
          <h3 className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-primary uppercase">
            <Award className="h-4 w-4" aria-hidden="true" />
            <span>{t.about.perksTitle}</span>
          </h3>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {t.about.perks.map((perk) => (
              <span
                key={perk}
                onMouseEnter={() => playSound('hover')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-elevated/90 px-3 py-1.5 font-mono text-[11px] font-medium text-ink transition hover:border-hot hover:bg-primary/15 hover:text-hot"
              >
                <span className="h-1.5 w-1.5 rotate-45 bg-primary" aria-hidden="true" />
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architectural Doctrine Pillars */}
      <div>
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-hot uppercase">
          <Cpu className="h-4 w-4" aria-hidden="true" />
          <span>{t.about.pillarsTitle}</span>
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {t.about.pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-primary/20 bg-surface/85 p-5 transition hover:border-primary/50"
            >
              <span className="font-mono text-[10px] font-bold tracking-widest text-primary">
                0{idx + 1}
              </span>
              <h4 className="mt-1.5 font-display text-base font-bold text-ink">{pillar.title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                {pillar.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quests Completed Timeline */}
      <div ref={timelineRef}>
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-primary uppercase">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>{t.about.questsTitle}</span>
        </h3>

        <div className="relative mt-5 space-y-5 pl-7">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-2.5 w-px bg-primary/20"
          />
          {!reducedMotion ? (
            <motion.div
              aria-hidden="true"
              style={{ scaleY: spineScale }}
              className="absolute top-2 bottom-2 left-2.5 w-px origin-top bg-gradient-to-b from-primary via-hot to-primary shadow-[0_0_10px_#ff1f3d]"
            />
          ) : null}

          {t.about.quests.map((quest, idx) => (
            <motion.article
              key={quest.code}
              initial={reducedMotion ? false : { opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.48, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-xl border border-primary/20 bg-surface/90 p-5 transition hover:border-primary/50"
            >
              <span
                aria-hidden="true"
                className="absolute top-6 -left-[23px] h-3 w-3 rounded-full border-2 border-primary bg-void shadow-[0_0_10px_#ff1f3d]"
              />
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
                <span className="rounded bg-primary/15 px-2 py-0.5 font-bold text-primary">
                  {quest.code}
                </span>
                <span className="text-hot">{quest.tag}</span>
              </div>
              <h4 className="mt-2 font-display text-lg font-bold text-ink">{quest.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted">{quest.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
