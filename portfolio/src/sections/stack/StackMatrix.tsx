import { STACK_CATEGORIES, type StackCategoryKey } from '../../data/stack';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

export interface StackMatrixProps {
  activeCategory: StackCategoryKey | null;
  onSelectCategory: (cat: StackCategoryKey | null) => void;
}

export function StackMatrix({ activeCategory, onSelectCategory }: StackMatrixProps) {
  const { t } = useI18n();

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between border-b border-primary/20 pb-3">
        <h3 className="font-mono text-xs font-bold tracking-[0.16em] text-primary uppercase">
          {t.stack.matrixTitle}
        </h3>
        <span className="font-mono text-[10px] tracking-widest text-dim uppercase">
          01 — 0{STACK_CATEGORIES.length}
        </span>
      </div>

      <div className="divide-y divide-primary/15">
        {STACK_CATEGORIES.map((category, idx) => {
          const isSelected = activeCategory === category.id;
          const dimmed = Boolean(activeCategory && !isSelected);

          return (
            <div
              key={category.id}
              className={`grid grid-cols-1 items-start gap-4 py-5 transition md:grid-cols-12 ${
                dimmed ? 'opacity-50 hover:opacity-90' : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-3 md:col-span-4">
                <span className="font-mono text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onSelectCategory(isSelected ? null : category.id);
                  }}
                  className="text-left font-display text-lg font-bold text-ink transition hover:text-hot"
                >
                  {t.stack.categories[category.id]}
                </button>
                <span className="rounded border border-primary/25 bg-void px-1.5 py-0.5 font-mono text-[10px] text-dim">
                  {category.items.length}
                </span>
              </div>

              <ul className="flex flex-wrap gap-2 md:col-span-8">
                {category.items.map((tech) => (
                  <li
                    key={tech}
                    onMouseEnter={() => playSound('hover')}
                    className={`rounded-lg border px-3 py-1 font-mono text-xs transition ${
                      isSelected
                        ? 'border-primary/55 bg-primary/15 text-ink'
                        : 'border-primary/20 bg-surface/85 text-muted hover:border-primary/45 hover:text-ink'
                    }`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
