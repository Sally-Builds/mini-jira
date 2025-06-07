import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "../types";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "@/api/auth.api";

import { AuthResponse } from "@/api/auth.api";
import { RegisterDto } from "@/dto/auth.dto";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        token: storedToken,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        token: undefined,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response: AuthResponse | null = await loginApi({ email, password });
    if (response && response.access_token && response.user) {
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        token: response.access_token,
      });
      return true;
    }
    setAuthState({ user: null, isAuthenticated: false });
    return false;
  };

  const register = async (data: RegisterDto): Promise<boolean> => {
    const response: AuthResponse | null = await registerApi(data);
    if (response && response.access_token && response.user) {
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        token: response.access_token,
      });
      return true;
    }
    setAuthState({ user: null, isAuthenticated: false });
    return false;
  };

  const logout = async () => {
    await logoutApi();
    localStorage.clear();
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  if (loading) {
    // You can customize this loader as you wish
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
