import React, { useEffect, useState } from "react";
import { TaskFilters } from "../types";
import * as taskApi from "../api/task.api";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Search, Filter, X } from "lucide-react";

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);

  useEffect(() => {
    taskApi.fetchStatuses().then(setStatuses);
    taskApi.fetchPriorities().then(setPriorities);
  }, []);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : value,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priority: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/20 shadow-xl">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200"
          />
        </div>

        <div className="flex gap-3">
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-40 bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30">
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace(/-/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="w-40 bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30">
              <SelectItem value="all">All Priority</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() +
                    priority.slice(1).replace(/-/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            size="icon"
            className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFiltersComponent;
