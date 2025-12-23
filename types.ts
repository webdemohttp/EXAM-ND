
export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  color: string;
}

export interface Task {
  id: string;
  examId: string;
  title: string;
  completed: boolean;
}

export interface DailySchedule {
  day: string;
  sessions: {
    time: string;
    subject: string;
    topic: string;
    duration: string;
  }[];
}

export enum Page {
  DASHBOARD = 'dashboard',
  EXAMS = 'exams',
  PLANNER = 'planner',
  TIMER = 'timer'
}
