// app/(admin)/layout.tsx
import type { Metadata } from "next"
import "../(client)/globals.css" 

export const metadata: Metadata = {
  title: "Espace Admin | Beauty Salon",
  description: "Interface de gestion de votre salon de beauté.",
}

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
