export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  AwaitingApproval = 'Awaiting Approval',
}

export enum TaskCategory {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Database = 'Database',
  Authentication = 'Authentication',
  Deployment = 'Deployment',
  Testing = 'Testing',
  General = 'General',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  confidence: number;
}
