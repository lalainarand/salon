
"use client";

import { useState } from "react";
import api, { getCsrfCookie } from "@/lib/api";

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

  async function register(payload: RegisterPayload): Promise<AuthResponse | undefined> {
    setLoading(true);
    setError(null);
    try {

      await getCsrfCookie();
      const { data } = await api.post("/api/register", payload);

      if (data.token) localStorage.setItem("token", data.token);

      return data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        // Récupérer directement "message" de Laravel
        setError(err.response.data.message);
      } else {
        setError(err.message || "Erreur lors de l'inscription");
      }
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  async function login(payload: LoginPayload): Promise<AuthResponse | undefined> {
    setLoading(true);
    setError(null);
    try {
      await getCsrfCookie(); // init CSRF
      const { data } = await api.post("/api/login", payload);

      if (data.token) localStorage.setItem("token", data.token);

      return data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Erreur lors de la connexion");
      }
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  return { register, login, loading, error };
}
