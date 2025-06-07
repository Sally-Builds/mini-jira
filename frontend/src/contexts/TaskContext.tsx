import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Task, TaskFilters } from "../types";
import * as taskApi from "../api/task.api";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});

  // Listen to auth changes
  const { isAuthenticated, user } = useAuth();

  // Clear tasks when user logs out or changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTasks([]);
    } else {
      // Optionally, refetch tasks for the new user
      const fetch = async () => {
        try {
          const data = await taskApi.fetchTasks(filters);
          setTasks(data);
        } catch (e) {
          setTasks([]);
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Refetch tasks if filters change and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetch = async () => {
        try {
          const data = await taskApi.fetchTasks(filters);
          setTasks(data);
        } catch (e) {
          setTasks([]);
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Backend already filters, so just use tasks
  const filteredTasks = tasks;

  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const newTask = await taskApi.createTask(taskData);
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = await taskApi.updateTask(id, updates);
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
  };

  const deleteTask = async (id: string) => {
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filters,
        createTask,
        updateTask,
        deleteTask,
        setFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
