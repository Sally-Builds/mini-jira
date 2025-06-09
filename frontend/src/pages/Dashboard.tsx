import React, { useState } from "react";
import { useTask } from "../hooks/use-task";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { Task, TaskStatus } from "../types";
import { toast } from "../hooks/use-toast";
import {
  DragDropContext,
  Droppable,
  DropResult,
  DraggableLocation,
} from "@hello-pangea/dnd";

const Dashboard: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    filters,
    setFilters,
    handleDragEnd,
  } = useTask();
  const [isModalOpen, setIsModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    createTask(taskData)
      .then(() => setIsModal(false))
      .catch(() => {
        /* Error handled by provider */
      });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModal(true);
  };

  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
        .then(() => setIsModal(false))
        .catch(() => {
          /* Error handled by provider */
        });
    } else {
      console.error("Update called without editingTask being set.");
      setIsModal(false);
    }
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
    setEditingTask(undefined);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    handleDragEnd(source.droppableId, destination.droppableId, draggableId);
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const applyFiltersToColumnTasks = (tasks: Task[]): Task[] => {
    const { search, priority } = filters;
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = !priority || task.priority === priority;
      return matchesSearch && matchesPriority;
    });
  };

  const renderColumn = (status: TaskStatus, title: string) => {
    const tasksInStatus = getTasksByStatus(status);
    const filteredTasksInStatus = applyFiltersToColumnTasks(tasksInStatus);

    return (
      <div className="flex flex-col rounded-lg glass-card p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">{title}</h2>
          {/* Show count of *filtered* tasks in this status */}
          <span
            className={`px-2 py-0.5 rounded-full text-sm ${
              status === TaskStatus.IN_PROGRESS
                ? "bg-blue-100 text-blue-800"
                : status === TaskStatus.DONE
                ? "bg-green-100 text-green-800"
                : status === TaskStatus.TODO
                ? "bg-slate-100 text-slate-800"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {filteredTasksInStatus.length} / {tasksInStatus.length}
          </span>
        </div>
        <Droppable droppableId={status} type="task">
          {(provided, snapshot) => (
            <React.Fragment>
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 space-y-3 min-h-[200px] rounded-lg p-3 transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50/50 border-2 border-dashed border-blue-300/50 scale-[1.01]"
                    : "border-2 border-dashed border-transparent"
                }`}
              >
                {filteredTasksInStatus.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
                {filteredTasksInStatus.length === 0 && (
                  <div
                    className={`text-center py-8 text-muted-foreground transition-colors ${
                      snapshot.isDraggingOver ? "text-blue-600" : ""
                    }`}
                  >
                    <p>
                      {tasksInStatus.length > 0 &&
                      filteredTasksInStatus.length === 0
                        ? "No tasks match filters"
                        : `No ${title.toLowerCase()} tasks`}
                    </p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            </React.Fragment>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Project Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your tasks and track project progress
            </p>
          </div>

          <Button
            onClick={openCreateModal}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>

        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {renderColumn(TaskStatus.TODO, "To Do")}
            {renderColumn(TaskStatus.IN_PROGRESS, "In Progress")}
            {renderColumn(TaskStatus.DONE, "Done")}
            {renderColumn(TaskStatus.CANCELLED, "Cancelled")}
          </div>
        </DragDropContext>
      </div>

      {/* TaskModal */}
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
