export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskCategory =
  | "Sport"
  | "Work"
  | "Health"
  | "Learning"
  | "Social"
  | "Leisure"
  | "Other";

export type RoutineFrequency = "daily" | "weekly" | "custom";

export type RoutineTimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Routine {
  id: string;
  name: string;
  description?: string;
  frequency: RoutineFrequency;
  timeOfDay: RoutineTimeOfDay;
  startTime?: string; // HH:MM format
  estimatedDuration: number; // in minutes
  taskIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineCompletion {
  id: string;
  routineId: string;
  completedAt: Date;
  completedTasks: string[]; // task IDs that were completed
  notes?: string;
}

export interface RoutineStreak {
  routineId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date | null;
  totalCompletions: number;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  duration: number; // in minutes
  priority: TaskPriority;
  tags: string[];
  status: TaskStatus;
  reminder?: Date;
  note?: string;
  routineId?: string;
  journalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  id: string;
  userId: string;
  text: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalWithTasks extends Journal {
  tasks: Task[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface DashboardStats {
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  totalTime: number;
  currentStreak: number;
}
