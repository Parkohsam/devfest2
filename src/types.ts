import { Timestamp } from 'firebase/firestore';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'health'
  | 'finance'
  | 'general';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  userId: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt: Timestamp | { seconds: number; nanoseconds: number };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt: Timestamp | { seconds: number; nanoseconds: number };
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption =
  | 'newest'
  | 'oldest'
  | 'dueDate'
  | 'priority'
  | 'alphabetical';
