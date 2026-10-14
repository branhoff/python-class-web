import type { Lesson } from './types.ts';

export interface NavLesson {
  id: string;
  title: string;
}

export interface NavSection {
  section: number;
  lessons: NavLesson[];
}

export interface LessonNav {
  sections: NavSection[];
  current: string;
  prev: NavLesson | null;
  next: NavLesson | null;
}

export function buildNav(lessons: Lesson[], currentId: string): LessonNav {
  const order = lessons.map((lesson): NavLesson => ({ id: lesson.id, title: lesson.title }));
  const index = order.findIndex((lesson) => lesson.id === currentId);

  const bySection = new Map<number, NavLesson[]>();
  for (const lesson of lessons) {
    const list = bySection.get(lesson.section) ?? [];
    list.push({ id: lesson.id, title: lesson.title });
    bySection.set(lesson.section, list);
  }
  const sections = [...bySection.entries()]
    .sort(([a], [b]) => a - b)
    .map(([section, sectionLessons]): NavSection => ({ section, lessons: sectionLessons }));

  return {
    sections,
    current: currentId,
    prev: index > 0 ? order[index - 1]! : null,
    next: index >= 0 && index < order.length - 1 ? order[index + 1]! : null,
  };
}
