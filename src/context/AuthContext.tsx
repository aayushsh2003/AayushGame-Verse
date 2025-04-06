// This file is now deprecated as we're using Clerk directly.
// Keeping a minimal implementation to avoid breaking existing imports.
import { createContext, useContext } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';

// Minimal context to avoid breaking existing imports
export const AuthContext = createContext(null);

export const useAuth = () => {
  return useClerkUser();
};

export const useUser = () => {
  return useClerkUser();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const SignInButton = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const UserButton = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
