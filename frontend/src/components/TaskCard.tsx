import React from "react";
import { Task } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "DONE":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "CANCELLED":
        return "bg-gray-300 text-gray-700 line-through hover:bg-gray-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {task.title}
          </CardTitle>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(task.status)}>
            {formatStatus(task.status)}
          </Badge>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
            Priority
          </Badge>
        </div>

        {task.assignee && (
          <div className="text-xs text-muted-foreground">
            Assigned to:{" "}
            {typeof task.assignee === "object"
              ? `${task.assignee.firstName || ""} ${
                  task.assignee.lastName || ""
                }`.trim() || task.assignee.email
              : task.assignee}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
