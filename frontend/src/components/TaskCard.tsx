import React, { useState } from "react";
import { Task } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete(task.id);
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            // Apply styles based on dragging state for visual feedback
            className={`transition-transform duration-200 ${
              snapshot.isDragging ? "rotate-2 scale-105" : ""
            }`}
          >
            <Card
              className={`hover:shadow-md transition-shadow duration-200 w-full max-w-full ${
                snapshot.isDragging ? "shadow-lg ring-2 ring-blue-300" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-0">
                  <div className="flex items-start gap-2">
                    {/* Drag handle */}
                    <div
                      {...provided.dragHandleProps} // Apply drag handle props here
                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
                      aria-label="Drag task" // Add ARIA label for accessibility
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2 break-words max-w-full">
                      {task.title}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-1 ml-0 xs:ml-2 flex-shrink-0">
                    {" "}
                    {/* Added flex-shrink-0 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="h-8 w-8 p-0"
                      aria-label={`Edit task "${task.title}"`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      aria-label={`Delete task "${task.title}"`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {task.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 break-words">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {formatStatus(task.status)}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}{" "}
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

                {task.createdAt && (
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] glass-card border-white/30">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="hover:bg-red-700 transition-colors"
            >
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
