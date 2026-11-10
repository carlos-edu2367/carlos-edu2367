import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { ALL_SECTIONS } from './game/achievements';

describe('App Phase A Shell', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.setItem('ce.booted', '1');
  });

  it('renders all DESIGN.md section anchors', () => {
    render(<App />);
    for (const id of ALL_SECTIONS) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(document.getElementById('footer')).toBeInTheDocument();
  });

  it('switches language between EN and PT-BR and updates html[lang]', () => {
    window.localStorage.setItem('ce.locale', 'en');
    render(<App />);

    expect(document.documentElement.lang).toBe('en');
    const ptBtn = screen.getByRole('button', { name: 'PT-BR' });
    fireEvent.click(ptBtn);

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(window.localStorage.getItem('ce.locale')).toBe('pt-BR');
  });

  it('opens command palette on Ctrl+K', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
