import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((p) => (
        <ProjectCard key={p.title} p={p} />
      ))}
    </>
  );
}
