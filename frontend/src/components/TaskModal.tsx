import React, { useState, useEffect } from "react";
import * as taskApi from "../api/task.api";
import { Task, TaskStatus, TaskPriority } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Plus, Edit3 } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  task?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TaskStatus.TODO as TaskStatus,
    priority: TaskPriority.MEDIUM as TaskPriority,
  });
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);

  useEffect(() => {
    taskApi.fetchStatuses().then(setStatuses);
    taskApi.fetchPriorities().then(setPriorities);
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: TaskStatus.TODO as TaskStatus,
        priority: TaskPriority.MEDIUM as TaskPriority,
      });
    }
  }, [task, isOpen]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-white/30">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-2">
            {task ? (
              <Edit3 className="h-5 w-5 text-purple-600" />
            ) : (
              <Plus className="h-5 w-5 text-purple-600" />
            )}
            <DialogTitle className="gradient-text">
              {task ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title..."
              required
              className="bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200"
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description..."
              rows={3}
              required
              className="bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 resize-none"
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30">
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status as TaskStatus}>
                      {status.charAt(0) +
                        status.slice(1).toLowerCase().replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
                {errors.status && (
                  <span className="text-xs text-red-500">{errors.status}</span>
                )}
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700"
              >
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData({ ...formData, priority: value })
                }
                required
              >
                <SelectTrigger className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30">
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority as TaskPriority}>
                      {priority.charAt(0) +
                        priority.slice(1).toLowerCase().replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
                {errors.priority && (
                  <span className="text-xs text-red-500">
                    {errors.priority}
                  </span>
                )}
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200"
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
