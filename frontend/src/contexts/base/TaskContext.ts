import { createContext } from "react";
import { Task, TaskFilters } from "../../types";

export interface TaskContextType {
    tasks: Task[];
    filteredTasks: Task[];
    filters: TaskFilters;
    createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    setFilters: (filters: TaskFilters) => void;
    handleDragEnd: (source: string, destination: string, taskId: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
