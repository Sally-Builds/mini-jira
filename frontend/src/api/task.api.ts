export const fetchStatuses = async (): Promise<string[]> => {
    const response = await API.get('/tasks/statuses', { headers: getAuthHeader() });
    return response.data;
};

export const fetchPriorities = async (): Promise<string[]> => {
    const response = await API.get('/tasks/priorities', { headers: getAuthHeader() });
    return response.data;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import API from './index';
import { Task, TaskFilters } from '../types';

// Helper to get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTasks = async (filters: TaskFilters = {}): Promise<Task[]> => {
    const params: any = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    const response = await API.get('/tasks', {
        params,
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await API.post('/tasks', task, { headers: getAuthHeader() });
    return response.data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await API.patch(`/tasks/${id}`, updates, { headers: getAuthHeader() });
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await API.delete(`/tasks/${id}`, { headers: getAuthHeader() });
};
