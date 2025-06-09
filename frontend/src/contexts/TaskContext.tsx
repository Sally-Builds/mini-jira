import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { Task, TaskStatus } from "../types";
import * as taskApi from "../api/task.api";
import { toast } from "../hooks/use-toast";
import { TaskContext, TaskContextType } from "./base/TaskContext";

const formatStatus = (status: string) => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const statusOrder: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFiltersState] = useState<{
    search: string;
    status: string;
    priority: string;
  }>({
    search: "",
    status: "",
    priority: "",
  });

  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      taskApi
        .fetchTasks()
        .then(setTasks)
        .catch((error) => {
          console.error("Failed to fetch tasks:", error);
          toast({
            title: "Failed to load tasks",
            description: "Could not fetch tasks from the server.",
            variant: "destructive",
          });
        });
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, user]);

  const filteredTasks = useMemo(() => {
    const { search, status, priority } = filters;
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !status || task.status === status;

      const matchesPriority = !priority || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Failed to create task",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Task>
  ): Promise<void> => {
    try {
      const updated = await taskApi.updateTask(id, updates);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Failed to update task",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic deletion
    const originalTasks = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your project.",
    });

    try {
      await taskApi.deleteTask(id);
      // UI is already updated
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Revert UI on error
      setTasks(originalTasks);
      toast({
        title: "Failed to delete task",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (
    sourceDroppableId: string,
    destinationDroppableId: string | null | undefined,
    draggableId: string,
    sourceIndex?: number,
    destinationIndex?: number | null | undefined
  ) => {
    if (!destinationDroppableId) {
      return;
    }

    // Convert droppable IDs to TaskStatus enum values
    const sourceStatus = statusOrder.find(
      (status) => status === sourceDroppableId
    );
    const destinationStatus = statusOrder.find(
      (status) => status === destinationDroppableId
    );

    if (!sourceStatus || !destinationStatus) {
      console.error("Invalid source or destination status", {
        sourceDroppableId,
        destinationDroppableId,
      });
      return;
    }

    if (
      sourceStatus === destinationStatus &&
      sourceIndex === destinationIndex
    ) {
      return;
    }

    // Optimistically update the UI state
    setTasks((prevTasks) => {
      const newTasks = Array.from(prevTasks);

      // Find the task being dragged using its ID
      const draggedTask = newTasks.find((task) => task.id === draggableId);
      if (!draggedTask) {
        console.error(`Task with ID ${draggableId} not found.`);
        return prevTasks; // Return original tasks if task not found
      }

      const globalSourceIndex = newTasks.findIndex(
        (task) => task.id === draggableId
      );
      if (globalSourceIndex === -1) {
        console.error(
          `Task with ID ${draggableId} not found at expected global index.`
        );
        return prevTasks;
      }
      const [removedTask] = newTasks.splice(globalSourceIndex, 1); // Remove using global index

      if (sourceStatus !== destinationStatus) {
        removedTask.status = destinationStatus;
      }

      let globalInsertIndex = 0;
      const destStatusOrderIndex = statusOrder.indexOf(destinationStatus);

      for (let i = 0; i < destStatusOrderIndex; i++) {
        const status = statusOrder[i];
        globalInsertIndex += newTasks.filter(
          (task) => task.status === status
        ).length;
      }

      const actualDestinationIndex = destinationIndex ?? 0;
      globalInsertIndex += actualDestinationIndex;

      globalInsertIndex = Math.min(globalInsertIndex, newTasks.length);

      newTasks.splice(globalInsertIndex, 0, removedTask);

      return newTasks;
    });

    try {
      const newStatus = statusOrder.find(
        (status) => status === destinationDroppableId
      );
      if (newStatus) {
        await taskApi.updateTask(draggableId, { status: newStatus });
        toast({
          title: "Task moved",
          description: `Task moved to ${formatStatus(newStatus)}`,
        });
      }
    } catch (error) {
      console.error("Failed to update task status on backend:", error);
      // Revert optimistic update on error
      const originalStatus = statusOrder.find(
        (status) => status === sourceDroppableId
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggableId ? { ...task, status: originalStatus } : task
        )
      );

      toast({
        title: "Move failed",
        description:
          "Failed to update task status on the server. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contextValue: TaskContextType = {
    tasks,
    filteredTasks,
    filters,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    handleDragEnd,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
