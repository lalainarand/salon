"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import api from "@/lib/api"

interface Settings {
  nom_salon?: string
  description?: string
  adresse?: string
  telephone?: string
  email?: string
  logo?: string
}

interface Horaire {
  id: number
  jour: string
  heure_ouverture: string
  heure_fermeture: string
  ouvert: number
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [horaires, setHoraires] = useState<Horaire[]>([])

  const fetchFooterData = async () => {
    try {
      const { data } = await api.get("/api/var")
      setSettings(data.settings)
      setHoraires(data.horaireOuverture)
    } catch (err) {
      console.error("Erreur lors de la récupération du footer:", err)
    }
  }

  useEffect(() => {
    fetchFooterData()
  }, [])

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Bloc 1 - Présentation */}
          <div>
            {settings?.logo && (
              <img
                src={settings.logo}
                alt={settings.nom_salon || "Logo salon"}
                className="w-24 h-24 mb-4 object-contain"
              />
            )}
            <h3 className="text-2xl font-playfair font-bold mb-4">
              {settings?.nom_salon || "Beauty Salon"}
            </h3>
            <p className="text-gray-300">
              {settings?.description ||
                "Votre beauté, notre passion. Découvrez nos services professionnels dans un cadre élégant et relaxant."}
            </p>
          </div>

          {/* Bloc 2 - Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-sage" />
                <span>{settings?.adresse || "Adresse non disponible"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-sage" />
                <span>{settings?.telephone || "—"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-sage" />
                <span>{settings?.email || "—"}</span>
              </div>
            </div>
          </div>

          {/* Bloc 3 - Horaires (compact) */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-sage" />
              Horaires
            </h4>

            {horaires.length > 0 ? (
              <div className="text-sm text-gray-300 leading-relaxed space-y-1">
                {/* Ligne 1 : Lun - Sam */}
                <p>
                  {horaires
                    .filter((h) => h.jour !== "dimanche")
                    .map((h, i) => (
                      <span key={h.id}>
                        {h.jour.charAt(0).toUpperCase() + h.jour.slice(1)} :{" "}
                        {h.ouvert
                          ? `${h.heure_ouverture.slice(0, 5)} - ${h.heure_fermeture.slice(0, 5)}`
                          : "Fermé"}
                        {i < horaires.length - 2 ? " | " : ""}
                      </span>
                    ))}
                </p>

                {/* Ligne 2 : Dimanche */}
                {horaires.some((h) => h.jour === "dimanche") && (
                  <p>
                    Dimanche :{" "}
                    <span className="text-red-400 italic">
                      {horaires.find((h) => h.jour === "dimanche")?.ouvert ? "Ouvert" : "Fermé"}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Chargement...</p>
            )}
          </div>

          {/* Bloc 4 - Liens utiles */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/services" className="hover:underline">
                  Nos services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} {settings?.nom_salon || "Beauty Salon"}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
