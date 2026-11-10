import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../../game/GameProvider';
import { I18nProvider } from '../../i18n/I18nProvider';
import { ProjectsSection } from './ProjectsSection';

function renderProjects() {
  return render(
    <I18nProvider>
      <GameProvider>
        <ProjectsSection />
      </GameProvider>
    </I18nProvider>,
  );
}

describe('ProjectsSection & ProjectOverlay', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('ce.locale', 'en');
  });

  it('renders flagship systems and extended arsenal items', () => {
    renderProjects();

    expect(document.getElementById('projects')).toBeInTheDocument();
    expect(screen.getAllByText('Orin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Auryly').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Marketfy (SGM)').length).toBeGreaterThan(0);
    expect(screen.getByText('Billing Core')).toBeInTheDocument();
    expect(screen.getByText('Ashy')).toBeInTheDocument();
    expect(screen.getByText('Neectify & Engify')).toBeInTheDocument();
    expect(screen.getByText('AgentDesk')).toBeInTheDocument();
  });

  it('opens project detail overlay on click, unlocks achievement, and closes on Escape', () => {
    renderProjects();

    const orinTrigger = screen.getByTestId('inspect-project-orin');
    fireEvent.click(orinTrigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Architecture & Engineering Notes')).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem('ce.game') || '{}') as {
      unlocked?: string[];
      inspectedProjects?: string[];
    };
    expect(stored.unlocked).toContain('curious');
    expect(stored.inspectedProjects).toContain('orin');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
