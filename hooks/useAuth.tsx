"use client";

import { useState } from "react";
import api from "@/lib/api";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token?: string;
  [key: string]: any;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToken = (token: string) => localStorage.setItem("token", token);

  const register = async (payload: RegisterPayload, onSuccess?: (data: AuthResponse) => void) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/register", payload);
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        saveToken(data.token);
        onSuccess?.(data);
      }
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  const login = async (payload: LoginPayload, onSuccess?: (data: AuthResponse) => void) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/login", payload);
      if (data.token) {
        // Stockage côté client pour les appels API depuis React
        localStorage.setItem("user", JSON.stringify(data.user));
        saveToken(data.token);

        // Stockage côté cookie pour le middleware (Next.js)
        document.cookie = `token=${data.token}; path=/; max-age=86400; Secure; SameSite=Lax`;

        onSuccess?.(data);
      }
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/logout");

      // Suppression du token dans le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Suppression du cookie (doit correspondre au nom et au path utilisés à la création)
      document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Lax";
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  };


  return { register, login, logout, loading, error };
}
