import { useState, type MouseEvent } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { ProjectItem } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

export interface SecondaryBentoProps {
  projects: ProjectItem[];
  onSelect: (project: ProjectItem) => void;
}

function BentoCard({
  project,
  spanClass,
  onSelect,
}: {
  project: ProjectItem;
  spanClass: string;
  onSelect: (project: ProjectItem) => void;
}) {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  const copy = t.projects.items[project.i18nKey];
  const statusLabel =
    project.status === 'live' ? t.projects.statusLive : t.projects.statusPublic;

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <article
      onMouseMove={handleMove}
      onMouseEnter={() => playSound('hover')}
      onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-surface/85 p-6 transition hover:border-primary/55 sm:p-7 ${spanClass}`}
    >
      {!reducedMotion ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spot.active ? 1 : 0,
            background: `radial-gradient(380px circle at ${spot.x.toFixed(1)}% ${spot.y.toFixed(1)}%, rgba(255, 31, 61, 0.17), transparent 70%)`,
          }}
        />
      ) : null}

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase">
          <span className="rounded border border-primary/35 bg-primary/10 px-2 py-0.5 text-hot">
            {statusLabel}
          </span>
          <span className="text-dim">{copy.version}</span>
        </div>

        <h4 className="mt-3.5 font-display text-2xl font-extrabold tracking-tight text-ink transition group-hover:text-hot">
          {copy.name}
        </h4>
        <p className="mt-1.5 text-sm font-medium text-ink/90">{copy.tagline}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{copy.summary}</p>
      </div>

      <div className="relative z-10 mt-6 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-primary/20 bg-void/80 px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/15 pt-4">
          <button
            type="button"
            data-testid={`inspect-project-${project.id}`}
            onClick={() => {
              playSound('click');
              onSelect(project);
            }}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-primary uppercase transition hover:text-hot"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.projects.inspectCta}</span>
          </button>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-void px-3 py-1.5 font-mono text-[11px] text-ink uppercase transition hover:border-primary hover:text-hot"
            >
              <span>
                {project.status === 'live' ? t.projects.viewLive : t.projects.viewRepo}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function SecondaryBento({ projects, onSelect }: SecondaryBentoProps) {
  const { t } = useI18n();
  const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-b border-primary/15 pb-5">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {t.projects.secondaryEyebrow}
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t.projects.secondaryTitle}
        </h3>
        <p className="mt-1.5 max-w-2xl text-sm text-muted sm:text-base">
          {t.projects.secondarySubtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {projects.map((project, idx) => (
          <BentoCard
            key={project.id}
            project={project}
            spanClass={spans[idx % spans.length]}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
