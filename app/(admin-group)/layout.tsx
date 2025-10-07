// app/(admin)/layout.tsx
import type { Metadata } from "next";
import "../(client)/globals.css";
import { UserProvider } from "@/lib/UserContext";

export const metadata: Metadata = {
  title: "Espace Admin | Beauty Salon",
  description: "Interface de gestion de votre salon de beauté.",
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
