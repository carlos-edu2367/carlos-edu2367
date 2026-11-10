import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Layers } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Magnetic } from '../../components/Magnetic';
import { useGame } from '../../game/GameProvider';
import { useSectionVisit } from '../../game/useSectionVisit';
import { useLenis } from '../../hooks/useLenis';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';
import { isWebGLAvailable } from '../../three/webglSupport';
import { CanvasErrorBoundary, HeroBackdrop } from './HeroBackdrop';
import { KineticHeadline } from './KineticHeadline';
import { OperatorPortraitCard } from './OperatorPortraitCard';

const HeroCanvas = lazy(() => import('../../three/HeroCanvas'));

function isSessionAlreadyBooted(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    return window.sessionStorage.getItem('ce.booted') === '1';
  } catch {
    return true;
  }
}

export function Hero() {
  const { locale, t } = useI18n();
  const { state, levelInfo } = useGame();
  const { scrollTo } = useLenis();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useSectionVisit('hero');

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isNearHero, setIsNearHero] = useState<boolean>(true);
  const [canvasDeferredReady, setCanvasDeferredReady] = useState<boolean>(false);
  const [webglAvailable] = useState<boolean>(() => isWebGLAvailable());
  const [eventKonami, setEventKonami] = useState<boolean>(false);
  const [fallbackBootReady, setFallbackBootReady] = useState<boolean>(() => isSessionAlreadyBooted());

  const konamiActive = state.unlocked.includes('konami') || eventKonami;
  const bootReady = state.unlocked.includes('boot') || fallbackBootReady || reducedMotion;

  useEffect(() => {
    if (!webglAvailable || typeof window === 'undefined') {
      return;
    }
    let activated = false;
    const activate = () => {
      if (activated) return;
      activated = true;
      setCanvasDeferredReady(true);
    };
    const timer = window.setTimeout(activate, 750);
    window.addEventListener('pointermove', activate, { once: true, passive: true });
    window.addEventListener('pointerdown', activate, { once: true, passive: true });
    window.addEventListener('keydown', activate, { once: true });
    window.addEventListener('wheel', activate, { once: true, passive: true });
    window.addEventListener('touchstart', activate, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', activate);
      window.removeEventListener('pointerdown', activate);
      window.removeEventListener('keydown', activate);
      window.removeEventListener('wheel', activate);
      window.removeEventListener('touchstart', activate);
    };
  }, [webglAvailable]);

  useEffect(() => {
    if (bootReady || typeof window === 'undefined') {
      return;
    }
    const timer = window.setTimeout(() => {
      setFallbackBootReady(true);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [bootReady]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const onKonami = () => setEventKonami(true);
    window.addEventListener('ce:konami', onKonami);
    return () => window.removeEventListener('ce:konami', onKonami);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const visObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.01 },
    );
    const nearObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          window.setTimeout(() => setIsNearHero(entry.isIntersecting), 0);
        }
      },
      { rootMargin: '600px 0px', threshold: 0 },
    );
    visObserver.observe(el);
    nearObserver.observe(el);
    return () => {
      visObserver.disconnect();
      nearObserver.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -88]);
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.08]);

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.12]);

  const domainItems = t.hero.domains.split('·').map((item) => item.trim());

  const handlePrimaryCta = () => {
    playSound('click');
    scrollTo('#contact');
  };

  const handleSecondaryCta = () => {
    playSound('click');
    scrollTo('#projects');
  };

  const handleScrollCue = () => {
    playSound('click');
    scrollTo('#about');
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[calc(100dvh-6.5rem)] w-full flex-col justify-between overflow-hidden border-b border-primary/20 md:min-h-[calc(100dvh-4rem)]"
    >
      {/* Ambient Radial Crimson Glow & Architectural Grid */}
      <HeroBackdrop konamiActive={konamiActive} />

      {/* Lazy-Loaded 3D R3F Scene (vendor-three chunk; unmounts far offscreen so <=1 WebGL context active) */}
      {webglAvailable ? (
        canvasDeferredReady && isNearHero ? (
          <CanvasErrorBoundary fallback={null}>
            <Suspense fallback={<HeroBackdrop konamiActive={konamiActive} pulse />}>
              <HeroCanvas
                konamiActive={konamiActive}
                reducedMotion={reducedMotion}
                isVisible={isVisible}
                isMobile={isMobile}
                fallbackLabel={t.hero.webglFallback}
              />
            </Suspense>
          </CanvasErrorBoundary>
        ) : null
      ) : (
        <div
          data-testid="hero-webgl-fallback"
          className="pointer-events-none absolute right-4 bottom-4 z-10 rounded border border-primary/25 bg-surface/80 px-2.5 py-1 font-mono text-[10px] tracking-widest text-dim uppercase backdrop-blur-sm sm:right-8"
        >
          {t.hero.webglFallback}
        </div>
      )}

      {/* Main 12-Column Asymmetric Editorial Grid */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-4 pb-5 sm:px-6 sm:pt-8 sm:pb-6 lg:px-8 lg:pt-10">
        <div className="grid w-full grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (Cols 1-7): Kinetic Headline, Domains & CTAs */}
          <motion.div
            style={
              reducedMotion
                ? undefined
                : { y: headlineY, scale: headlineScale, opacity: headlineOpacity }
            }
            className="lg:col-span-7"
          >
            <KineticHeadline
              availableBadge={t.hud.availableBadge}
              role={t.hero.role}
              line1={t.hero.headlineLine1}
              accent={t.hero.headlineAccent}
              line2={t.hero.headlineLine2}
              bootReady={bootReady}
              reducedMotion={reducedMotion}
              konamiActive={konamiActive}
            />

            <p className="mt-3.5 max-w-xl font-sans text-sm leading-relaxed text-muted sm:mt-5 sm:text-[1.08rem]">
              {t.hero.description}
            </p>

            <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
              {domainItems.map((domain) => (
                <span
                  key={domain}
                  className="rounded border border-primary/20 bg-surface/80 px-2 py-0.5 font-mono text-[10px] tracking-wider text-ink/85 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[11px]"
                >
                  {domain}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3.5">
              <Magnetic strength={0.26}>
                <button
                  type="button"
                  onClick={handlePrimaryCta}
                  className="btn-crimson group inline-flex items-center gap-1.5 rounded-lg px-4 py-3 font-mono text-[11px] font-bold tracking-wider uppercase transition sm:gap-2 sm:px-6 sm:py-3.5 sm:text-xs sm:tracking-widest"
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                </button>
              </Magnetic>

              <Magnetic strength={0.22}>
                <button
                  type="button"
                  onClick={handleSecondaryCta}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-surface/90 px-4 py-3 font-mono text-[11px] font-bold tracking-wider text-ink uppercase backdrop-blur-md transition hover:border-primary hover:bg-elevated sm:gap-2 sm:px-6 sm:py-3.5 sm:text-xs sm:tracking-widest"
                >
                  <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>{t.hero.secondaryCta}</span>
                </button>
              </Magnetic>
            </div>
          </motion.div>

          {/* Right Column (Cols 8-12): Character-Select 4:5 Portrait Card */}
          <motion.div
            style={
              reducedMotion
                ? undefined
                : { y: portraitY, scale: portraitScale, opacity: portraitOpacity }
            }
            className="lg:col-span-5"
          >
            <OperatorPortraitCard
              locale={locale}
              caption={t.hero.portraitCaption}
              role={t.hero.role}
              levelPrefix={t.hud.levelPrefix}
              xpSuffix={t.hud.xpSuffix}
              level={levelInfo.level}
              xp={state.xp}
              levelProgress={levelInfo.progress}
              reducedMotion={reducedMotion}
              konamiActive={konamiActive}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Cue Indicator */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pb-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleScrollCue}
          className="group inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition hover:text-ink"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/35 bg-surface/80 text-primary transition group-hover:border-hot group-hover:text-hot">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
          </span>
          <span>{t.hero.scrollHint}</span>
        </button>

        <div
          aria-hidden="true"
          className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-dim uppercase sm:flex"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <span>SYS.CORE // 01</span>
        </div>
      </div>
    </section>
  );
}
