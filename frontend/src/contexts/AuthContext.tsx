import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '@/lib/axios';

interface User {
  id: number;
  email: string;
  username: string;
  roles: string[];
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   api
  //     .get('/user', { withCredentials: true })
  //     .then((res) => setUser(res.data.user))
  //     .catch(() => setUser(null))
  //     .finally(() => setIsLoading(false));
  // }, []);

  const login = async (email: string, password: string) => {
    await api.post('/login', { email, password }, { withCredentials: true });
    const res = await api.get('/user', { withCredentials: true });
    setUser(res.data.user);
  };

  const register = async (data: RegisterData) => {
    await api.post('/register', data, { withCredentials: true });
    const res = await api.get('/user', { withCredentials: true });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
        await api.get('/api/logout', { withCredentials: true });
    } catch (error) {
        if (error.response && error.response.status === 302) {
            // Logout successful, session invalidated
        } else {
            console.error('Logout failed', error);
        }
    }
    setUser(null);
};

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
