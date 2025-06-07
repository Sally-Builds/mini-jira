import React, { useState } from "react";
import { useTask } from "../contexts/TaskContext";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { Task } from "../types";
import { toast } from "../hooks/use-toast";

const Dashboard: React.FC = () => {
  const {
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    filters,
    setFilters,
  } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    createTask(taskData);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    }
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your project.",
    });
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // Map UI status to backend status values
  const statusMap: Record<string, string> = {
    todo: "TODO",
    "in-progress": "IN_PROGRESS",
    done: "DONE",
    cancelled: "CANCELLED",
  };

  const getTasksByStatus = (uiStatus: string) => {
    const backendStatus = statusMap[uiStatus];
    return filteredTasks.filter((task) => task.status === backendStatus);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Project Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks and track project progress
            </p>
          </div>

          <Button
            onClick={openCreateModal}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>

        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* To Do Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">To Do</h2>
              <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {getTasksByStatus("todo").length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus("todo").map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {getTasksByStatus("todo").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                In Progress
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {getTasksByStatus("in-progress").length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus("in-progress").map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {getTasksByStatus("in-progress").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          {/* Cancelled Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Cancelled
              </h2>
              <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {getTasksByStatus("cancelled").length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus("cancelled").map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {getTasksByStatus("cancelled").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No cancelled tasks</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Done</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {getTasksByStatus("done").length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus("done").map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {getTasksByStatus("done").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </Layout>
  );
};

export default Dashboard;
