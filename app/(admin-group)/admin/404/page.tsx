// app/(admin-group)/admin/404/page.tsx
"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mx-auto mb-4 w-16 h-16 text-[rgb(150,180,125)]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AlertCircle className="w-16 h-16" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Oups ! La page que vous recherchez n'existe pas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-[rgb(150,180,125)] text-white font-semibold rounded-lg shadow hover:bg-[rgb(150,180,125)]/90 transition-all duration-200"
          >
            Retour au tableau de bord
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Vérifiez l’URL ou contactez l’administrateur si nécessaire.
      </motion.div>
    </div>
  );
}
