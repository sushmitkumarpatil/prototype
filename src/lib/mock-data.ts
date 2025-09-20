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
  phone?: string;
  website?: string;
  bio?: string;
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
    phone: '+91 98765 43211',
    website: 'https://priyasharma.dev',
    bio: 'Passionate software engineer with expertise in full-stack development and cloud technologies.',
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
    phone: '+91 98765 43213',
    website: 'https://anjalisingh.dev',
    bio: 'Computer Science student passionate about web development and machine learning.',
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
    phone: '+91 98765 43212',
    website: 'https://vikrammehta.dev',
    bio: 'Hardware engineer specializing in embedded systems and IoT solutions.',
  },
];

// Jobs are now fetched from the backend API - see /lib/api/content.ts
export const jobs: Job[] = [];

// Events are now fetched from the backend API - see /lib/api/content.ts
export const events: Event[] = [];

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

//export const currentUser: User = users[2]; // Simulating logged-in user as Anjali Singh (student)
 export const currentUser: User = {
  ...users[1],
  phone: '+91 98765 43210',
  website: 'https://rajeshkumar.dev',
  bio: 'Experienced Project Manager with a passion for delivering innovative solutions and leading cross-functional teams to success.'
}; // To test as an Alumnus
