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
    id: 'web-basics',
    title: 'Web Basics',
    description: 'Build pages with HTML and CSS.',
    status: 'coming-soon',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Make web pages interactive.',
    status: 'coming-soon',
  },
  {
    id: 'command-line',
    title: 'Command Line & Git',
    description: 'Drive your computer with the terminal and track your work.',
    status: 'coming-soon',
  },
];
