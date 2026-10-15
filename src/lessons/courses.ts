export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'coming-soon' | 'planned';
}

export const COURSES: readonly Course[] = [
  {
    id: 'python',
    title: 'Programming 101 with Python',
    description: 'Learn to program by writing Python in your browser, from first print to classes.',
    status: 'available',
  },
  {
    id: 'python-102',
    title: 'Programming 102 with Python',
    description:
      'Organize larger programs: modules, error handling, testing and objects that work together.',
    status: 'planned',
  },
  {
    id: 'c-cpp',
    title: 'C and C++',
    description: 'See how programs really work: memory, pointers and compiled code.',
    status: 'coming-soon',
  },
  {
    id: 'pico-8',
    title: 'Game Dev with PICO-8',
    description: 'PICO-8 is a tiny fantasy console. Make small games with its built-in editor.',
    status: 'coming-soon',
  },
];
