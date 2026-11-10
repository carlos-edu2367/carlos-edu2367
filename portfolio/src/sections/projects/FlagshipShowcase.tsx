import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Layers, Lock } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { TiltCard } from '../../components/ui/TiltCard';
import type { ProjectItem } from '../../data/projects';
import { useLenis } from '../../hooks/useLenis';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';
import { FlagshipVisual } from './FlagshipVisual';

export interface FlagshipShowcaseProps {
  projects: ProjectItem[];
  onSelect: (project: ProjectItem) => void;
}

export function FlagshipShowcase({ projects, onSelect }: FlagshipShowcaseProps) {
  const { t } = useI18n();
  const { scrollTo } = useLenis();
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isJsdom = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
  const horizontalEnabled = isDesktop && !reducedMotion && !isJsdom;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const trackSectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackSectionRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.35,
  });

  const panelCount = Math.max(1, projects.length);
  const endShift = -((panelCount - 1) / panelCount) * 100;
  const xPercent = useTransform(smoothProgress, [0, 1], ['0%', `${endShift}%`]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(panelCount - 1, Math.max(0, Math.round(latest * (panelCount - 1))));
    setActiveIndex(idx);
  });

  useEffect(() => {
    if (!horizontalEnabled) {
      setActiveIndex(0);
    }
  }, [horizontalEnabled]);

  const jumpToPanel = (idx: number) => {
    const track = trackSectionRef.current;
    if (!track || typeof window === 'undefined') {
      return;
    }
    playSound('click');
    const rect = track.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollable = Math.max(0, track.offsetHeight - window.innerHeight);
    const ratio = panelCount > 1 ? idx / (panelCount - 1) : 0;
    scrollTo(trackTop + scrollable * ratio, { offset: 0 });
  };

  const renderPanel = (project: ProjectItem, idx: number) => {
    const copy = t.projects.items[project.i18nKey];
    const indexStr = String(idx + 1).padStart(2, '0');
    const statusLabel =
      project.status === 'public'
        ? t.projects.statusPublic
        : project.status === 'private'
          ? t.projects.statusPrivate
          : t.projects.statusHybrid;

    return (
      <motion.article
        key={project.id}
        layoutId={reducedMotion || isJsdom ? undefined : `project-card-${project.id}`}
        aria-label={copy.name}
        data-cursor-label={t.projects.inspectCta}
        onClick={() => {
          playSound('click');
          onSelect(project);
        }}
        className={`group relative grid cursor-pointer grid-cols-1 items-center gap-6 rounded-2xl border border-primary/25 bg-surface/90 p-5 shadow-[0_18px_60px_rgba(7,4,10,0.75)] transition hover:border-primary/60 sm:p-8 lg:grid-cols-12 lg:gap-8 ${
          horizontalEnabled ? 'w-[86vw] max-w-6xl shrink-0' : 'w-full'
        }`}
      >
        <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase">
              <span className="font-display text-3xl leading-none font-extrabold text-primary sm:text-4xl">
                {indexStr}
              </span>
              <span className="rounded border border-primary/45 bg-primary/15 px-2 py-0.5 font-bold text-ink">
                {t.projects.flagshipBadge}
              </span>
              <span className="rounded border border-primary/25 bg-void px-2 py-0.5 text-muted">
                {statusLabel}
              </span>
              <span className="text-dim">{copy.version}</span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-extrabold tracking-tight text-ink transition group-hover:text-hot">
              {copy.name}
            </h3>
            <p className="mt-2 text-base font-medium text-muted sm:text-lg">{copy.tagline}</p>
          </div>

          {(project.isPrivate || project.status === 'hybrid') && (
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/30 bg-elevated/90 px-3 py-1.5 font-mono text-[11px] text-hot">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {project.isPrivate ? t.projects.caseStudyNotice : t.projects.hybridNotice}
              </span>
            </div>
          )}

          <ul className="space-y-2 text-sm leading-relaxed text-muted">
            {copy.features.slice(0, 3).map((feat, fIdx) => (
              <li key={fIdx} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                <span className="line-clamp-2">{feat}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.stack.slice(0, 8).map((tech) => (
              <span
                key={tech}
                className="rounded border border-primary/20 bg-void/85 px-2 py-0.5 font-mono text-[10px] text-muted"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 8 ? (
              <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-hot">
                +{project.stack.length - 8}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              data-testid={`inspect-project-${project.id}`}
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                onSelect(project);
              }}
              className="btn-crimson inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition"
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.projects.inspectCta}</span>
            </button>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('click');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-void px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-ink uppercase transition hover:border-primary hover:text-hot"
              >
                <span>{t.projects.viewRepo}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-5">
          <TiltCard cursorLabel={t.projects.inspectCta} className="border-primary/35 bg-elevated/70">
            <FlagshipVisual projectId={project.id} />
          </TiltCard>
        </div>
      </motion.article>
    );
  };

  if (!horizontalEnabled) {
    return (
      <div
        ref={trackSectionRef}
        className="mx-auto mt-12 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8"
      >
        {projects.map((p, idx) => renderPanel(p, idx))}
      </div>
    );
  }

  return (
    <div ref={trackSectionRef} className="relative mt-10 h-[300vh]">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden py-6">
        <div className="mx-auto mb-5 flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] tracking-[0.16em] text-hot uppercase">
            {t.projects.scrollHint}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" role="group" aria-label={t.projects.title}>
              {projects.map((proj, idx) => {
                const isCurrent = activeIndex === idx;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    aria-pressed={isCurrent}
                    onClick={() => jumpToPanel(idx)}
                    className={`rounded-md border px-2 py-0.5 font-mono text-[11px] transition ${
                      isCurrent
                        ? 'btn-crimson font-bold'
                        : 'border-primary/25 bg-surface/85 text-muted hover:border-primary/50 hover:text-ink'
                    }`}
                  >
                    0{idx + 1} · {t.projects.items[proj.i18nKey].name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-elevated xl:w-36">
              <motion.div
                style={{ scaleX: smoothProgress }}
                className="h-full origin-left bg-gradient-to-r from-primary to-hot"
              />
            </div>
          </div>
        </div>

        <div className="pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <motion.div
            style={{ x: xPercent }}
            className="flex w-max items-stretch gap-8 pr-16 will-change-transform"
          >
            {projects.map((p, idx) => renderPanel(p, idx))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
