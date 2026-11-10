import { useCallback, useRef, useState } from 'react';
import { LayoutGroup } from 'motion/react';
import { useSectionPolish } from '../../components/ui/gsapScroll';
import { SectionHeading } from '../../components/ui/SectionHeading';
import {
  FLAGSHIP_PROJECTS,
  SECONDARY_PROJECTS,
  type ProjectItem,
} from '../../data/projects';
import { useGame } from '../../game/GameProvider';
import { useSectionVisit } from '../../game/useSectionVisit';
import { useI18n } from '../../i18n/I18nProvider';
import { FlagshipShowcase } from './FlagshipShowcase';
import { ProjectOverlay } from './ProjectOverlay';
import { SecondaryBento } from './SecondaryBento';

export function ProjectsSection() {
  const { t } = useI18n();
  const { inspectProject } = useGame();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useSectionVisit('projects');
  useSectionPolish(sectionRef);

  const handleSelect = useCallback(
    (project: ProjectItem) => {
      inspectProject(project.id);
      setSelectedProject(project);
    },
    [inspectProject],
  );

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label={t.projects.title}
      className="relative border-b border-primary/15 py-24 sm:py-32"
    >
      <LayoutGroup>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            index="02"
            eyebrow={t.projects.eyebrow}
            title={t.projects.title}
            subtitle={t.projects.subtitle}
          />
        </div>

        <FlagshipShowcase projects={FLAGSHIP_PROJECTS} onSelect={handleSelect} />
        <SecondaryBento projects={SECONDARY_PROJECTS} onSelect={handleSelect} />
        <ProjectOverlay project={selectedProject} onClose={handleClose} />
      </LayoutGroup>
    </section>
  );
}
