// app/(admin-group)/admin/403/page.tsx
"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center">
        <AlertTriangle className="mx-auto mb-4 w-16 h-16 text-[rgb(150,180,125)]" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">403</h1>
        <p className="text-gray-600 mb-6">
          Oups ! Vous n'avez pas la permission d'accéder à cette page.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-[rgb(150,180,125)] text-white font-semibold rounded-lg shadow hover:bg-[rgb(150,180,125)]/90 transition-all duration-200"
        >
          Retour au tableau de bord
        </Link>
      </div>
      <div className="mt-6 text-gray-400 text-sm">
        Si vous pensez que c'est une erreur, contactez l'administrateur.
      </div>
    </div>
  );
}
