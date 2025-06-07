import { LoginDto, RegisterDto } from '@/dto/auth.dto';
import API from './index';


export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export const login = async (data: LoginDto): Promise<AuthResponse | null> => {
    try {
        const response = await API.post('/auth/login', data);
        if (response.data && response.data.access_token && response.data.user) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
};


export const register = async (data: RegisterDto): Promise<AuthResponse | null> => {
    try {
        const response = await API.post('/auth/register', data);
        if (response.data && response.data.access_token && response.data.user) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Registration failed:', error);
        return null;
    }
};

export const logout = async (): Promise<boolean> => {
    try {
        await API.post('/auth/logout');
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
};