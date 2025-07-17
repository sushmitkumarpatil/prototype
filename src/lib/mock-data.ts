export type User = {
  id: number;
  role: 'alumnus' | 'student';
  name: string;
  email: string;
  avatar: string;
  course: string;
  batch: number;
  usn?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  linkedin?: string;
  followedAlumni?: number[];
};

export type Job = {
  id: number;
  authorId: number;
  title: string;
  company: string;
  location: string;
  description: string;
  type: 'Full-time' | 'Internship' | 'Part-time';
  experienceLevel: string;
  postedAt: string;
};

export type Event = {
  id: number;
  authorId: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  rsvpLink: string;
};

export type Post = {
  id: number;
  authorId: number;
  title?: string;
  content: string;
  postedAt: string;
};

export const users: User[] = [
  {
    id: 1,
    role: 'alumnus',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    avatar: 'https://placehold.co/100x100/EAD3F8/9434A3',
    course: 'Computer Science',
    batch: 2015,
    location: 'Bengaluru',
    company: 'Innovate Corp',
    jobTitle: 'Senior Software Engineer',
    linkedin: 'https://linkedin.com/in/priyasharma',
  },
  {
    id: 2,
    role: 'alumnus',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    avatar: 'https://placehold.co/100x100/D3E4F8/3476A3',
    course: 'Mechanical Engineering',
    batch: 2012,
    location: 'Mumbai',
    company: 'BuildIt Solutions',
    jobTitle: 'Project Manager',
    linkedin: 'https://linkedin.com/in/rajeshkumar',
  },
  {
    id: 3,
    role: 'student',
    name: 'Anjali Singh',
    email: 'anjali.singh@example.com',
    avatar: 'https://placehold.co/100x100/F8D3D3/A33434',
    course: 'Computer Science',
    batch: 2025,
    usn: '123456789',
    followedAlumni: [1, 2],
  },
  {
    id: 4,
    role: 'alumnus',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    avatar: 'https://placehold.co/100x100/D3F8D3/34A334',
    course: 'Electronics & Communication',
    batch: 2018,
    location: 'Pune',
    company: 'Circuitry Inc.',
    jobTitle: 'Hardware Engineer',
    linkedin: 'https://linkedin.com/in/vikrammehta',
  },
];

export const jobs: Job[] = [
  {
    id: 1,
    authorId: 1,
    title: 'Frontend Developer (React)',
    company: 'Innovate Corp',
    location: 'Remote',
    description: 'Looking for a skilled React developer to join our dynamic team. Experience with Next.js and TypeScript is a plus.',
    type: 'Full-time',
    experienceLevel: 'Mid-Level',
    postedAt: '2 days ago',
  },
  {
    id: 2,
    authorId: 2,
    title: 'Mechanical Design Intern',
    company: 'BuildIt Solutions',
    location: 'Mumbai',
    description: 'Exciting internship opportunity for final year Mechanical Engineering students to work on real-world projects.',
    type: 'Internship',
    experienceLevel: 'Internship',
    postedAt: '1 week ago',
  },
];

export const events: Event[] = [
  {
    id: 1,
    authorId: 1,
    title: 'Alumni Networking Meetup',
    date: '2024-08-15T18:00:00Z',
    location: 'Online',
    description: 'A virtual meetup for all alumni to connect, network, and share experiences. Special focus on career growth in tech.',
    image: 'https://placehold.co/600x400',
    rsvpLink: '#',
  },
  {
    id: 2,
    authorId: 4,
    title: 'Workshop on Embedded Systems',
    date: '2024-08-20T10:00:00Z',
    location: 'College Auditorium',
    description: 'A hands-on workshop covering the fundamentals of embedded systems and IoT. Open to all students.',
    image: 'https://placehold.co/600x400',
    rsvpLink: '#',
  },
];

export const posts: Post[] = [
  {
    id: 1,
    authorId: 1,
    content: "Just hit a major milestone in our project! It's incredible to see how the principles we learned in our Data Structures class still apply every day. To all the students, never underestimate the fundamentals!",
    postedAt: '4 hours ago',
  },
  {
    id: 2,
    authorId: 2,
    title: 'Advice for Aspiring Project Managers',
    content: "The key to successful project management isn't just about tools and charts; it's about communication. Learn to listen to your team and stakeholders. That's the real secret sauce.",
    postedAt: '3 days ago',
  },
];

export const getAuthor = (authorId: number) => users.find((user) => user.id === authorId);

export const currentUser: User = users[2]; // Simulating logged-in user as Anjali Singh (student)
// export const currentUser: User = users[0]; // To test as an Alumnus
