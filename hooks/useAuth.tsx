"use client";

import { useState } from "react";
import api, { getCsrfCookie } from "@/lib/api";
import Cookies from "js-cookie";

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

  const saveToken = (token: string) => {
    // Stockage dans localStorage
    localStorage.setItem("token", token);


    // Stockage dans un cookie sécurisé accessible côté serveur
    Cookies.set("token", token, {
      expires: 7, // 7 jours
      secure: true, // seulement sur HTTPS
      sameSite: "Strict",
      path: "/", // cookie accessible sur tout le site
    });
  };

  async function register(
    payload: RegisterPayload,
    onSuccess?: (data: AuthResponse) => void
  ): Promise<AuthResponse | undefined> {
    setLoading(true);
    setError(null);

    try {
      await getCsrfCookie();
      const { data } = await api.post("/api/register", payload);

      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user))
        saveToken(data.token);
        if (onSuccess) onSuccess(data);
      }

      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    payload: LoginPayload,
    onSuccess?: (data: AuthResponse) => void
  ): Promise<AuthResponse | undefined> {
    setLoading(true);
    setError(null);

    try {
      await getCsrfCookie();
      const { data } = await api.post("/api/login", payload);

      if (data.token) {
        console.log('user',data.user)
        console.log('token',data.token);
        localStorage.setItem("user", JSON.stringify(data.user))
        saveToken(data.token);
        if (onSuccess) onSuccess(data);
      }

      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la connexion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
  };

  return { register, login, logout, loading, error };
}
