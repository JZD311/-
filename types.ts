
export enum TaskStatus {
  NEW = 'NEW', // White
  DONE = 'DONE', // Green
  REPLACED = 'REPLACED', // Yellow
  CANCELLED = 'CANCELLED' // Red
}

export enum TaskType {
  CONNECTION = 'CONNECTION',
  TECH_SUPPORT = 'TECH_SUPPORT'
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  address: string;
  clientName: string;
  description: string;
  replacementForId?: string; // If this task was added to replace a 'REPLACED' one
}

export interface WorkOrderType {
  id: string;
  name: string;
  quotas: {
    [key in TaskType]: number;
  };
  allowedTaskTypes: TaskType[];
  creatorRoles: string[];
}

export interface Performer {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface WorkOrder {
  id: string;
  number: string;
  date: string;
  typeId: string;
  performerId?: string;
  tasks: Task[];
}

export type AppTab = 'schedule' | 'admin' | 'stats';
