import React, { createContext, useCallback, useState } from 'react';

import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gobarber:token');
    const user = localStorage.getItem('@gobarber:user');

    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@gobarber:token', token);
      localStorage.setItem('@gobarber:user', JSON.stringify(user));

      setData({ token, user });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
