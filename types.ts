
export enum TaskStatus {
  Pending = 'Pending',
  AwaitingApproval = 'Awaiting Approval',
  GeneratingCode = 'Generating Code',
  Testing = 'Testing',
  Completed = 'Completed',
  Error = 'Error',
  Rejected = 'Rejected',
}

export enum TaskCategory {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Database = 'Database',
  Testing = 'Testing',
  Deployment = 'Deployment',
  Authentication = 'Authentication',
  General = 'General',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: TaskCategory;
  status: TaskStatus;
}
