import type { Tint } from '../../design-system';

export type Shelf = 'reading' | 'read' | 'want' | 'dnf';
export type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
  genre: string;
  tint: Tint;
  shelf: Shelf;
  progress?: number; // pages read, for shelf = reading
  finished?: string; // ISO date, for shelf = read
  rating?: number; // 1 to 5
  review?: string;
};

export const reader = {
  name: 'Noa Lindqvist',
  handle: 'noa.reads',
  bio: 'Reads slowly, finishes strange books, argues with the endings.',
  since: 2019,
  goal: 20,
};

/** Fixed "today" so pace maths is deterministic in the demo. */
export const TODAY = '2026-10-26';

export const initialBooks: Book[] = [
  { id: 'overstory', title: 'The Overstory', author: 'Richard Powers', pages: 502, genre: 'Literary', tint: 'sage', shelf: 'reading', progress: 311 },
  { id: 'sweetgrass', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', pages: 391, genre: 'Nature', tint: 'butter', shelf: 'reading', progress: 118 },
  { id: 'piranesi', title: 'Piranesi', author: 'Susanna Clarke', pages: 272, genre: 'Fantasy', tint: 'ice', shelf: 'reading', progress: 205 },

  { id: 'hailmary', title: 'Project Hail Mary', author: 'Andy Weir', pages: 476, genre: 'Sci-fi', tint: 'sky', shelf: 'read', finished: '2026-01-14', rating: 5, review: 'Pure joy. The science problem-solving is the plot, and the friendship at its centre earns every tear.' },
  { id: 'remains', title: 'The Remains of the Day', author: 'Kazuo Ishiguro', pages: 258, genre: 'Literary', tint: 'cream', shelf: 'read', finished: '2026-01-29', rating: 4 },
  { id: 'thinking', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', pages: 499, genre: 'Nonfiction', tint: 'stone', shelf: 'read', finished: '2026-02-20', rating: 4 },
  { id: 'klara', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', pages: 303, genre: 'Sci-fi', tint: 'butter', shelf: 'read', finished: '2026-03-08', rating: 4, review: 'Quietly devastating. I wanted more of the world and less of the plot, but the narrator stays with you.' },
  { id: 'gentleman', title: 'A Gentleman in Moscow', author: 'Amor Towles', pages: 462, genre: 'Historical', tint: 'peach', shelf: 'read', finished: '2026-03-30', rating: 5, review: 'A whole life inside one building, and it never feels small. Slow in the best way.' },
  { id: 'everyday', title: 'The Design of Everyday Things', author: 'Don Norman', pages: 368, genre: 'Design', tint: 'lilac', shelf: 'read', finished: '2026-04-19', rating: 4, review: 'Changed how I see doors, and every settings screen since. Dated examples, durable ideas.' },
  { id: 'pachinko', title: 'Pachinko', author: 'Min Jin Lee', pages: 496, genre: 'Historical', tint: 'peach', shelf: 'read', finished: '2026-05-24', rating: 5 },
  { id: 'dune', title: 'Dune', author: 'Frank Herbert', pages: 612, genre: 'Sci-fi', tint: 'butter', shelf: 'read', finished: '2026-06-09', rating: 4 },
  { id: 'educated', title: 'Educated', author: 'Tara Westover', pages: 352, genre: 'Memoir', tint: 'cream', shelf: 'read', finished: '2026-06-27', rating: 3, review: 'Gripping, and I did not trust every scene. Hard to rate a life, so I rated the book.' },
  { id: 'normal', title: 'Normal People', author: 'Sally Rooney', pages: 266, genre: 'Literary', tint: 'ice', shelf: 'read', finished: '2026-07-18', rating: 3 },
  { id: 'dmmt', title: "Don't Make Me Think", author: 'Steve Krug', pages: 216, genre: 'Design', tint: 'lilac', shelf: 'read', finished: '2026-08-12', rating: 4 },
  { id: 'lefthand', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304, genre: 'Sci-fi', tint: 'sky', shelf: 'read', finished: '2026-09-21', rating: 5, review: 'The best thing I read this year. A novel about a world and, quietly, about how we read other people.' },
  { id: 'circe', title: 'Circe', author: 'Madeline Miller', pages: 393, genre: 'Fantasy', tint: 'sage', shelf: 'read', finished: '2026-10-05', rating: 4 },
  { id: 'stationeleven', title: 'Station Eleven', author: 'Emily St. John Mandel', pages: 333, genre: 'Sci-fi', tint: 'sky', shelf: 'read', finished: '2026-10-19', rating: 4, review: 'Read it in two sittings. Gentler than the premise suggests, and better for it.' },

  { id: 'middlemarch', title: 'Middlemarch', author: 'George Eliot', pages: 880, genre: 'Literary', tint: 'cream', shelf: 'want' },
  { id: 'dispossessed', title: 'The Dispossessed', author: 'Ursula K. Le Guin', pages: 387, genre: 'Sci-fi', tint: 'sky', shelf: 'want' },
  { id: 'seeing', title: 'Seeing Like a State', author: 'James C. Scott', pages: 464, genre: 'Nonfiction', tint: 'stone', shelf: 'want' },
  { id: 'master', title: 'The Master and Margarita', author: 'Mikhail Bulgakov', pages: 432, genre: 'Literary', tint: 'lilac', shelf: 'want' },
  { id: 'kindred', title: 'Kindred', author: 'Octavia E. Butler', pages: 287, genre: 'Sci-fi', tint: 'peach', shelf: 'want' },

  { id: 'jest', title: 'Infinite Jest', author: 'David Foster Wallace', pages: 1079, genre: 'Literary', tint: 'stone', shelf: 'dnf', progress: 214, rating: 2 },
];

export const SHELF_LABEL: Record<Shelf, string> = { reading: 'Currently reading', read: 'Read', want: 'Want to read', dnf: 'Did not finish' };
export const SHELVES: Shelf[] = ['reading', 'read', 'want', 'dnf'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Books the reader has not added yet. Feeds Explore. Fictional recommendations engine, real titles, generated covers. */
export const catalogue: Omit<Book, 'shelf'>[] = [
  { id: 'c-hyperion', title: 'Hyperion', author: 'Dan Simmons', pages: 482, genre: 'Sci-fi', tint: 'sky' },
  { id: 'c-three-body', title: 'The Three-Body Problem', author: 'Cixin Liu', pages: 400, genre: 'Sci-fi', tint: 'ice' },
  { id: 'c-parable', title: 'Parable of the Sower', author: 'Octavia E. Butler', pages: 345, genre: 'Sci-fi', tint: 'peach' },
  { id: 'c-earthsea', title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', pages: 183, genre: 'Fantasy', tint: 'sage' },
  { id: 'c-song', title: 'The Song of Achilles', author: 'Madeline Miller', pages: 378, genre: 'Fantasy', tint: 'butter' },
  { id: 'c-giant', title: 'The Buried Giant', author: 'Kazuo Ishiguro', pages: 345, genre: 'Literary', tint: 'cream' },
  { id: 'c-gilead', title: 'Gilead', author: 'Marilynne Robinson', pages: 247, genre: 'Literary', tint: 'stone' },
  { id: 'c-wolf', title: 'Wolf Hall', author: 'Hilary Mantel', pages: 653, genre: 'Historical', tint: 'peach' },
  { id: 'c-name', title: 'The Name of the Rose', author: 'Umberto Eco', pages: 502, genre: 'Historical', tint: 'cream' },
  { id: 'c-entangled', title: 'Entangled Life', author: 'Merlin Sheldrake', pages: 352, genre: 'Nature', tint: 'sage' },
  { id: 'c-wild', title: 'H is for Hawk', author: 'Helen Macdonald', pages: 300, genre: 'Nature', tint: 'butter' },
  { id: 'c-emotional', title: 'Emotional Design', author: 'Don Norman', pages: 280, genre: 'Design', tint: 'lilac' },
  { id: 'c-shape', title: 'The Shape of Design', author: 'Frank Chimero', pages: 128, genre: 'Design', tint: 'lilac' },
  { id: 'c-justkids', title: 'Just Kids', author: 'Patti Smith', pages: 304, genre: 'Memoir', tint: 'cream' },
  { id: 'c-sapiens', title: 'Sapiens', author: 'Yuval Noah Harari', pages: 464, genre: 'Nonfiction', tint: 'stone' },
  { id: 'c-secret', title: 'The Secret History', author: 'Donna Tartt', pages: 559, genre: 'Mystery', tint: 'ice' },
  { id: 'c-rebecca', title: 'Rebecca', author: 'Daphne du Maurier', pages: 449, genre: 'Mystery', tint: 'rose' },
];
