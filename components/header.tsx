"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/api";
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Cookies from "js-cookie"
import { useAuth } from "@/hooks/useAuth"
import AppointmentModal from "./appointment-modal"
import MyAppointmentsModal from "./MyAppointmentsModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification";


type Service = {
  id: number;
  name: string;
  price: number;
  duration: string;
};

interface Settings {
  nom_salon?: string
  description?: string
  adresse?: string
  telephone?: string
  email?: string
  logo?: string
  logo_url?: string
}

interface rendezvous {
  id: number;
  service: string | null;
  date: string;
  status: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isAppointmentsModalOpen1, setIsAppointmentsModalOpen1] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { notification, showSuccess, hideNotification } = useSuccessNotification();
  const [services, setServices] = useState<Service[]>([]);
  const [rendezvous, setRendezVous] = useState<rendezvous[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null)
  const [paymentMethods, setPaymentMethods] = useState([])

  const { logout } = useAuth()

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté
    const token = localStorage.getItem("token");
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

    // Récupère les services depuis l'API
    const fetchServices = async () => {
      try {
        ;

        const { data } = await api.get("/api/services");

        console.log("Services from API:", data);
        setServices(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
      }
    };

    // Récupère les services depuis l'API
    const fetchRendezVous = async () => {
      try {
        const { data } = await api.get("/api/my/appointments");
        setRendezVous(data);
        console.log("My rendez-vous from API:", data);
      } catch (err) {
        console.error("Erreur lors de la récupération de mes rendez-vous:", err);
      }
    };

    const fetchPayementsMethods = async () => {
      try {
        const { data } = await api.get("/api/mode-paiements")
        console.log("data payment method", data)
        setPaymentMethods(data)
      } catch (err) {
        console.error("Erreur lors de la methode de payement :", err)
      }
    }


    const fetchFooterData = async () => {
      try {
        const { data } = await api.get("/api/var")
        setSettings(data.settings)
      } catch (err) {
        console.error("Erreur lors de la récupération du footer:", err)
      }
    }

    fetchFooterData()
    fetchServices();
    fetchPayementsMethods();
    fetchRendezVous();
  }, []);



  const handleLogout = async () => {
    try {
      await api.post("/api/logout");

      // Suppression du token dans le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Suppression du cookie (doit correspondre au nom et au path utilisés à la création)
      document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Lax";
      console.log("Déconnexion réussie");
      setIsLoggedIn(false);
      setUserName(null);
      window.location.href = "/";
    } catch (err: any) {
    } finally {
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
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center">
                <img
                  src={settings?.logo_url}
                  alt="Logo Beauty Salon"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-playfair font-bold text-charcoal ml-2">
                  {settings?.nom_salon || "Beauty Salon"}
                </span>
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

            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-sage hover:bg-sage/90 text-white px-3 py-1.5 rounded-full transition-all duration-200 text-sm shadow-sm"
                  >
                    <span className="w-7 h-7 bg-white text-sage font-semibold flex items-center justify-center rounded-full text-sm">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate max-w-[100px] text-sm font-medium">
                      {userName}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-90" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-sm">
                      <button
                        onClick={() => {
                          setIsAppointmentsModalOpen1(true);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-sage/10 text-gray-700 transition"
                      >
                        Mes rendez-vous
                      </button>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-sage hover:bg-sage/90 text-white px-5 py-1.5 rounded-full transition-all duration-200 text-sm shadow-sm"
                >
                  Connexion
                </Link>
              )}

              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    showSuccess("Vous devez être connecté pour prendre un rendez-vous !");
                    return;
                  }
                  setIsAppointmentModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="bg-sage hover:bg-sage/90 text-white px-5 py-1.5 rounded-full transition-all duration-200 text-sm shadow-sm"
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
              <div className="px-4 pt-4 pb-6 space-y-3 bg-white border-t border-beige-200 shadow-lg rounded-b-2xl">
                {/* Liens de navigation */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-charcoal text-[15px] font-medium rounded-lg hover:bg-beige-100 hover:text-sage transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Section utilisateur */}
                {isLoggedIn ? (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <span className="w-9 h-9 bg-sage text-white font-semibold flex items-center justify-center rounded-full">
                        {userName?.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-charcoal text-[15px] font-medium">{userName}</span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => {
                          setIsAppointmentsModalOpen1(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-start px-4 py-2.5 text-charcoal text-[15px] rounded-lg hover:bg-beige-100 transition-all duration-200"
                      >
                        📅 <span className="ml-2">Mes rendez-vous</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full bg-sage hover:bg-sage/90 text-white text-[15px] font-medium rounded-full px-6 py-2.5 transition-all duration-200"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="block w-full bg-sage hover:bg-sage/90 text-white text-[15px] font-medium rounded-full px-6 py-2.5 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                )}

                {/* Bouton prendre rendez-vous */}
                <Button
                  onClick={() => {
                    if (!isLoggedIn) {
                      showSuccess("Vous devez être connecté pour prendre un rendez-vous !");
                      return;
                    }
                    setIsAppointmentModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-sage hover:bg-sage/90 text-white text-[15px] font-medium rounded-full px-6 py-2.5 transition-all duration-200"
                >
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          )}

        </div>
        <SuccessNotification
          show={notification.show}
          message={notification.message}
          onClose={hideNotification}
          duration={6000}
        />

        {isAppointmentsModalOpen1 && (
          <MyAppointmentsModal
            isOpen={isAppointmentsModalOpen1}
            onClose={() => setIsAppointmentsModalOpen1(false)}
            appointments={rendezvous} 
          />
        )}


        {isAppointmentModalOpen && (
          <Elements stripe={stripePromise}>
            <AppointmentModal
              isOpen={true} // Toujours true ici
              onClose={() => setIsAppointmentModalOpen(false)}
              services={services}
              paymentMethods={paymentMethods}

            />
          </Elements>
        )}
      </header>

    </>
  )
}
