export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt?: string;
    updatedAt?: string;
    assignee?: User | string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token?: string;
}

export interface TaskFilters {
    status?: string;
    priority?: string;
    search?: string;
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}
