import { AchievementToasts } from './components/AchievementToasts';
import { BootLoader } from './components/BootLoader';
import { CommandPalette } from './components/CommandPalette';
import { CustomCursor } from './components/CustomCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { Hud } from './components/Hud';
import { SkipLink } from './components/SkipLink';
import { GameProvider, useGame } from './game/GameProvider';
import { useKonami } from './game/useKonami';
import { useLenis } from './hooks/useLenis';
import { I18nProvider } from './i18n/I18nProvider';
import { AboutSection } from './sections/about/AboutSection';
import { ContactSection } from './sections/contact/ContactSection';
import { FooterSection } from './sections/footer/FooterSection';
import { Hero } from './sections/hero/Hero';
import { ProjectsSection } from './sections/projects/ProjectsSection';
import { StackSection } from './sections/stack/StackSection';

function PortfolioShell() {
  const { state, unlock } = useGame();
  useLenis();

  useKonami(() => unlock('konami'));
  const konamiActive = state.unlocked.includes('konami');

  return (
    <div className="relative min-h-dvh bg-void text-ink">
      <SkipLink />
      <BootLoader />
      <CustomCursor />
      <GrainOverlay />
      {konamiActive ? (
        <div
          aria-hidden="true"
          data-testid="arcade-overdrive-frame"
          className="bg-scanlines pointer-events-none fixed inset-0 z-[75] border-2 border-hot/35 shadow-[inset_0_0_90px_rgba(255,31,61,0.22)]"
        />
      ) : null}
      <Hud />
      <CommandPalette />
      <AchievementToasts />

      <main id="main-content" className="relative z-10 pt-[6.5rem] md:pt-16">
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <ContactSection />
      </main>

      <FooterSection />
    </div>
  );
}

export function App() {
  return (
    <I18nProvider>
      <GameProvider>
        <PortfolioShell />
      </GameProvider>
    </I18nProvider>
  );
}

export default App;
