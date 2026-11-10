import { useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Check, Copy, Mail, Radio } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Magnetic } from '../../components/Magnetic';
import { useSectionPolish } from '../../components/ui/gsapScroll';
import { RevealText } from '../../components/ui/RevealText';
import { ScrambleText } from '../../components/ui/ScrambleText';
import { PROFILE } from '../../config/profile';
import { useGame } from '../../game/GameProvider';
import { useSectionVisit } from '../../game/useSectionVisit';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

export function ContactSection() {
  const { t } = useI18n();
  const { unlock } = useGame();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  useSectionVisit('contact');
  useSectionPolish(sectionRef);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  const handleCopyEmail = async () => {
    playSound('click');
    try {
      await navigator.clipboard?.writeText(PROFILE.email);
    } catch {
      // Clipboard fallback ignored cleanly
    }
    unlock('contact');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3200);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label={t.contact.title}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className="relative overflow-hidden border-b border-primary/20 py-28 sm:py-36"
    >
      {/* Subtle Animated Crimson Grid & Noise Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,31,61,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,31,61,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 82%)',
        }}
      />

      {!reducedMotion ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spot.active ? 1 : 0.45,
            background: `radial-gradient(560px circle at ${spot.x.toFixed(1)}% ${spot.y.toFixed(1)}%, rgba(255, 31, 61, 0.2), transparent 68%)`,
          }}
        />
      ) : null}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center justify-center rounded border border-primary/45 bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold tracking-widest text-primary">
            04
          </span>
          <span className="h-px w-6 bg-primary/40" aria-hidden="true" />
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-hot uppercase">
            <ScrambleText text={t.contact.eyebrow} />
          </p>
        </div>

        {/* Giant Kinetic CTA */}
        <h2 className="mt-6 max-w-5xl font-display text-[clamp(2.35rem,6vw,5.25rem)] leading-[0.96] font-extrabold tracking-[-0.03em] text-ink">
          <RevealText text={t.contact.kineticHeadline} splitWords />
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {t.contact.subtitle}
        </p>

        {/* Primary Magnetic Actions */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.28}>
            <a
              href={`mailto:${PROFILE.email}`}
              onClick={() => playSound('click')}
              className="btn-crimson inline-flex items-center gap-3 rounded-xl px-7 py-4 font-mono text-xs font-bold tracking-widest uppercase transition sm:text-sm"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{t.contact.sendEmail}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Magnetic>

          <Magnetic strength={0.22}>
            <button
              type="button"
              onClick={() => void handleCopyEmail()}
              className="inline-flex items-center gap-3 rounded-xl border border-primary/40 bg-surface/95 px-6 py-4 font-mono text-xs font-bold tracking-widest text-ink uppercase transition hover:border-hot hover:bg-elevated sm:text-sm"
            >
              {copied ? (
                <Check className="h-4 w-4 text-hot" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-primary" aria-hidden="true" />
              )}
              <span>{copied ? t.contact.copiedEmail : t.contact.copyEmail}</span>
            </button>
          </Magnetic>
        </div>

        <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted">
          <span className="select-all text-ink/90">{PROFILE.email}</span>
          <AnimatePresence>
            {copied ? (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className="rounded border border-hot/45 bg-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-hot"
              >
                {t.toasts.emailCopied}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Uplinks & Telemetry Strip */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-primary/25 bg-surface/85 p-5 sm:grid-cols-3 md:col-span-8">
            <div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-dim uppercase">
                <Radio className="h-3 w-3 text-primary" aria-hidden="true" />
                {t.contact.availabilityLabel}
              </span>
              <p className="mt-1.5 font-mono text-xs font-semibold text-hot">
                {t.contact.availabilityValue}
              </p>
            </div>
            <div>
              <span className="block font-mono text-[10px] tracking-widest text-dim uppercase">
                {t.contact.timezoneLabel}
              </span>
              <p className="mt-1.5 font-mono text-xs text-ink">
                {PROFILE.location} ({PROFILE.timezone})
              </p>
            </div>
            <div>
              <span className="block font-mono text-[10px] tracking-widest text-dim uppercase">
                {t.contact.commsLabel}
              </span>
              <p className="mt-1.5 font-mono text-xs text-ink">{t.contact.commsValue}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-4">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic=""
              onClick={() => playSound('click')}
              className="group flex flex-col justify-between rounded-2xl border border-primary/25 bg-surface/85 p-5 transition hover:border-primary hover:bg-elevated"
            >
              <span className="font-mono text-[10px] tracking-widest text-dim uppercase">
                {t.contact.githubLabel}
              </span>
              <span className="mt-3 inline-flex items-center justify-between font-mono text-xs font-bold text-ink group-hover:text-hot">
                <span>{PROFILE.githubHandle}</span>
                <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic=""
              onClick={() => playSound('click')}
              className="group flex flex-col justify-between rounded-2xl border border-primary/25 bg-surface/85 p-5 transition hover:border-primary hover:bg-elevated"
            >
              <span className="font-mono text-[10px] tracking-widest text-dim uppercase">
                {t.contact.linkedinLabel}
              </span>
              <span className="mt-3 inline-flex items-center justify-between font-mono text-xs font-bold text-ink group-hover:text-hot">
                <span>LinkedIn</span>
                <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
