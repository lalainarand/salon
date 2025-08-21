"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api, { getCsrfCookie } from "@/lib/api";
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Cookies from "js-cookie"
import AppointmentModal from "./appointment-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) setIsLoggedIn(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name);
      } catch {
        setUserName(null);
      }
    }
  }, []);


  const handleLogout = async () => {
    try {
      // Récupérer le token côté client
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Aucun token trouvé côté client");
        return;
      }

      // Initialiser le cookie CSRF (Sanctum)
      await getCsrfCookie();

      // Appel à l'API logout avec le token dans l'en-tête Authorization
      await api.post(
        "/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Supprimer le token et l'utilisateur côté client
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("token"); // si tu l'as mis dans les cookies

      // Mettre à jour l'état dans React
      setIsLoggedIn(false);
      setIsDropdownOpen(false);

      // Redirection vers l'accueil
      window.location.href = "/";
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion :", error.response?.data || error.message);
    }
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Services", href: "/services" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-playfair font-bold text-charcoal">
                Beauty Salon
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-charcoal hover:text-sage transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-sage hover:bg-sage/90 text-white px-4 py-2 rounded-full transition-all duration-200"
                  >
                    <span className="w-6 h-6 bg-white text-sage font-bold flex items-center justify-center rounded-full">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                    <span>{userName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-charcoal hover:bg-beige-100 rounded-md"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-sage hover:bg-sage/90 text-white px-6 py-2 rounded-full transition-all duration-200"
                >
                  Connexion
                </Link>
              )}

              <Button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-sage hover:bg-sage/90 text-white px-6 py-2 rounded-full transition-all duration-200"
              >
                Prendre rendez-vous
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-beige-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-charcoal hover:text-sage transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-sage hover:bg-sage/90 text-white rounded-full px-6 py-2 transition-all duration-200"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="block w-full bg-sage hover:bg-sage/90 text-white rounded-full px-6 py-2 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                )}

                <Button
                  onClick={() => {
                    setIsAppointmentModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-sage hover:bg-sage/90 text-white rounded-full px-6 py-2 transition-all duration-200"
                >
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </>
  )
}
