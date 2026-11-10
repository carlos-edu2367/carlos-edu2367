import { useRef } from 'react';
import { Counter } from '../../components/ui/Counter';
import { useSectionPolish } from '../../components/ui/gsapScroll';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { PROFILE } from '../../config/profile';
import { useSectionVisit } from '../../game/useSectionVisit';
import { useI18n } from '../../i18n/I18nProvider';
import { OperatorStatsCard } from './OperatorStatsCard';
import { QuestsTimeline } from './QuestsTimeline';

export function AboutSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement | null>(null);

  useSectionVisit('about');
  useSectionPolish(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label={t.about.title}
      className="relative overflow-x-clip border-b border-primary/15 py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        data-parallax="36"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-blood/20 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          rightSlot={
            <div className="flex items-center gap-5 rounded-xl border border-primary/25 bg-surface/80 px-4 py-2.5 font-mono text-xs">
              <div>
                <span className="block text-[10px] tracking-widest text-dim uppercase">ADS</span>
                <Counter
                  value={PROFILE.degreeCompletionYear}
                  className="font-bold text-ink"
                />
              </div>
              <div className="h-6 w-px bg-primary/20" />
              <div>
                <span className="block text-[10px] tracking-widest text-dim uppercase">EN</span>
                <span className="font-bold text-primary">{PROFILE.englishLevel}</span>
              </div>
              <div className="h-6 w-px bg-primary/20" />
              <div>
                <span className="block text-[10px] tracking-widest text-dim uppercase">ZONE</span>
                <span className="font-bold text-hot">{PROFILE.timezone}</span>
              </div>
            </div>
          }
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <OperatorStatsCard />
          </div>

          <div className="lg:col-span-7">
            <QuestsTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
