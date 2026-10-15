export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'coming-soon';
}

export const COURSES: readonly Course[] = [
  {
    id: 'python',
    title: 'Python',
    description: 'Write and run Python in your browser, from first print to classes.',
    status: 'available',
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
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    description: 'Sorting, searching, lists, trees and graphs, and how to think about speed.',
    status: 'coming-soon',
  },
];
