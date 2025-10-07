"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

// Typage TypeScript
interface User {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user");
      console.log("Données utilisateur récupérées:", data);
      setUser(data);
    } catch (err) {
      console.error("Erreur récupération user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser doit être utilisé dans un <UserProvider>");
  return context;
};
