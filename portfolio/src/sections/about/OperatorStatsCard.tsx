import { Shield, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { TiltCard } from '../../components/ui/TiltCard';
import { PROFILE } from '../../config/profile';
import { useGame } from '../../game/GameProvider';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';

export function OperatorStatsCard() {
  const { t } = useI18n();
  const { state, levelInfo } = useGame();
  const reducedMotion = usePrefersReducedMotion();

  const rows = [
    { label: t.about.stats.classLabel, value: t.about.stats.classValue, highlight: true },
    { label: t.about.stats.specLabel, value: t.about.stats.specValue, highlight: false },
    { label: t.about.stats.baseLabel, value: t.about.stats.baseValue, highlight: false },
    { label: t.about.stats.degreeLabel, value: t.about.stats.degreeValue, highlight: false },
    { label: t.about.stats.langLabel, value: t.about.stats.langValue, highlight: false },
    { label: t.about.stats.statusLabel, value: t.about.stats.statusValue, highlight: true },
  ];

  return (
    <TiltCard maxTilt={5} className="border-primary/35 bg-surface/95 p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/45 bg-primary/15 text-primary">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[10px] tracking-widest text-hot uppercase">
              ID // {PROFILE.monogram}-2367
            </p>
            <h3 className="font-display text-lg font-extrabold text-ink">{PROFILE.fullName}</h3>
          </div>
        </div>

        <div className="rounded-lg border border-primary/40 bg-void px-3 py-1.5 text-right font-mono">
          <span className="block text-[10px] font-bold tracking-widest text-primary">
            {t.hud.levelPrefix} {levelInfo.level}
          </span>
          <span className="text-[11px] text-muted">
            {state.xp} {t.hud.xpSuffix}
          </span>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-primary/15">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <dt className="font-mono text-[10px] font-semibold tracking-[0.14em] text-dim uppercase">
              {row.label}
            </dt>
            <dd
              className={`font-mono text-xs sm:text-right ${
                row.highlight ? 'font-semibold text-hot' : 'text-ink'
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-primary/20 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-widest text-ink uppercase">
            <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{t.about.attributesTitle}</span>
          </h4>
          <span className="font-mono text-[10px] tracking-wider text-dim uppercase">
            {t.about.attributesNote}
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {t.about.attributes.map((attr, idx) => (
            <div key={attr.code}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-xs">
                <span className="text-ink">
                  <span className="mr-2 text-[10px] text-primary">[{attr.code}]</span>
                  {attr.label}
                </span>
                <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-hot">
                  {attr.tier}
                </span>
              </div>

              <div className="relative h-2 overflow-hidden rounded-full border border-primary/20 bg-void">
                <motion.div
                  initial={reducedMotion ? false : { width: '0%' }}
                  whileInView={{ width: `${attr.fill}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={reducedMotion ? { width: `${attr.fill}%` } : undefined}
                  className="h-full rounded-full bg-gradient-to-r from-crimson via-primary to-hot shadow-[0_0_14px_rgba(255,31,61,0.5)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
