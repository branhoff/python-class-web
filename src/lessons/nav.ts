import type { Lesson } from './types.ts';

export interface NavLesson {
  id: string;
  title: string;
}

interface SectionLesson extends NavLesson {
  itemIds: string[];
  project: boolean;
}

export interface NavSection {
  section: number;
  lessons: SectionLesson[];
}

export interface LessonNav {
  sections: NavSection[];
  current: string;
  projects: NavLesson[];
  prev: NavLesson | null;
  next: NavLesson | null;
}

export function progressItemIds(lesson: Lesson): string[] {
  const exercises = lesson.blocks.flatMap((block) =>
    block.type === 'cell' && block.kind === 'exercise' ? [block.id] : [],
  );
  return lesson.after === undefined ? exercises : [...exercises, `project:${lesson.id}`];
}

export function buildNav(lessons: Lesson[], currentId: string): LessonNav {
  const order = lessons.map((lesson): NavLesson => ({ id: lesson.id, title: lesson.title }));
  const index = order.findIndex((lesson) => lesson.id === currentId);

  const bySection = new Map<number, SectionLesson[]>();
  for (const lesson of lessons) {
    const list = bySection.get(lesson.section) ?? [];
    list.push({
      id: lesson.id,
      title: lesson.title,
      itemIds: progressItemIds(lesson),
      project: lesson.after !== undefined,
    });
    bySection.set(lesson.section, list);
  }
  const sections = [...bySection.entries()]
    .sort(([a], [b]) => a - b)
    .map(([section, sectionLessons]): NavSection => ({ section, lessons: sectionLessons }));

  const projects = lessons
    .filter((lesson) => lesson.after === currentId)
    .map((lesson): NavLesson => ({ id: lesson.id, title: lesson.title }));

  return {
    sections,
    current: currentId,
    projects,
    prev: index > 0 ? order[index - 1]! : null,
    next: index >= 0 && index < order.length - 1 ? order[index + 1]! : null,
  };
}
