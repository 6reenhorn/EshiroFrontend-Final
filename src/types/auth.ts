export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginFormState {
    username: string;
    password: string;
    error: string | null;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }
  
  export interface User {
    id: string;
    username: string;
  }