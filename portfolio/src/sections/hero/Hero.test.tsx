import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../../game/GameProvider';
import { I18nProvider } from '../../i18n/I18nProvider';
import { resetWebGLCacheForTests } from '../../three/webglSupport';
import { Hero } from './Hero';

function renderHero() {
  return render(
    <I18nProvider>
      <GameProvider>
        <Hero />
      </GameProvider>
    </I18nProvider>,
  );
}

describe('Hero Section (Phase B1)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('ce.locale', 'en');
    window.sessionStorage.setItem('ce.booted', '1');
    resetWebGLCacheForTests();
  });

  it('renders #hero anchor, kinetic accessible h1, availability pill, and CTAs', () => {
    renderHero();

    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'ARCHITECTING RELENTLESS SOFTWARE SYSTEMS.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE FOR FREELANCE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start a Project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore Flagships/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SCROLL TO INSPECT/i })).toBeInTheDocument();
  });

  it('renders 4:5 operator portrait picture with AVIF, WebP, JPG sources and telemetry', () => {
    const { container } = renderHero();

    const card = screen.getByTestId('operator-portrait-card');
    expect(card).toBeInTheDocument();

    const sources = container.querySelectorAll('picture source');
    expect(sources.length).toBeGreaterThanOrEqual(2);
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[1]).toHaveAttribute('type', 'image/webp');

    const img = screen.getByAltText(/Editorial portrait illustration for Carlos Eduardo/i);
    expect(img).toHaveAttribute('src', expect.stringContaining('images/portrait.jpg'));
    expect(screen.getByText(/OPERATOR \/\/ CARLOS EDUARDO DA SILVA/i)).toBeInTheDocument();
  });

  it('renders graceful WebGL fallback notice in non-WebGL environments and activates Konami overdrive', async () => {
    renderHero();

    await waitFor(() => {
      expect(screen.getByTestId('hero-webgl-fallback')).toBeInTheDocument();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent('ce:konami'));
    });

    expect(screen.getByText('OVERDRIVE // KONAMI')).toBeInTheDocument();
    expect(screen.getByText('OVERDRIVE')).toBeInTheDocument();

    const card = screen.getByTestId('operator-portrait-card');
    fireEvent.pointerEnter(card);
    fireEvent.pointerLeave(card);
  });
});
