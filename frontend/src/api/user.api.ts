import { User } from "@/types";
import API from ".";


export const getUser = async (userId: string): Promise<User> => {
    try {
        const response = await API.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}

export const getMe = async (): Promise<User> => {
    try {
        const response = await API.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        throw error;
    }
}