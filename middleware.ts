import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // On récupère le token depuis le cookie
  const token = request.cookies.get("token")?.value;

  // Si pas de token et que l'utilisateur essaie d'accéder à /dashboard*, on le redirige
  if (!token && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // On peut éventuellement empêcher l'accès à /auth si l'utilisateur est déjà connecté
  if (token && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
