'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api";
import Cookies from "js-cookie"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import Image from "next/image"
import { Service } from "@/app/(client)/Types/service";
import AppointmentModal from "@/components/appointment-modal"
import PackageModal from "@/components/PackageModal"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification";


export default function ServicesPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification();
  const [initialStep, setInitialStep] = useState<number>(1)
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null)
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleOpenModal = (pkg: any) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
  
        const token = Cookies.get("token") || localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
        const { data } = await api.get("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
      }
    };

    fetchCategories();
  }, []);


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cream to-beige-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-6">Nos Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète de services de beauté, conçus pour révéler votre éclat naturel et vous
              offrir des moments de pure détente.
            </p>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">{category.nom}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service: Service, serviceIndex: number) => (
                  <Card key={serviceIndex} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <Image
                      src={`coiffure${Math.floor(Math.random() * 8) + 1}.jpg`} // image aléatoire entre coiffure1.jpg et coiffure8.jpg
                      alt={service.nom}
                      width={400}
                      height={250}
                      className="w-full h-52 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="text-lg text-charcoal">{service.nom}</span>
                        <span className="text-xl font-bold text-sage">{service.prix} Ar</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{service.duree_minutes} min</span>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      <Button
                        className="w-full bg-sage hover:bg-sage/90 text-white rounded-full"
                        onClick={() => {
                          if (!isLoggedIn) {
                            // Affiche la notification
                            showSuccess("Vous devez être connecté pour prendre un rendez-vous !");
                            return;
                          }
                          setPreSelectedService(service);
                          setInitialStep(2);
                          setIsAppointmentModalOpen(true);
                        }}
                      >
                        Réserver ce service
                      </Button>
                    </CardContent>
                  </Card>
                ))}

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">Nos Forfaits Bien-être</h2>
            <p className="text-lg text-gray-600">Profitez de nos forfaits combinés pour une expérience complète</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Forfait Détente",
                price: "120€",
                originalPrice: "140€",
                services: ["Soin du visage hydratant", "Massage relaxant 30min", "Manucure classique"],
                popular: false,
              },
              {
                id: 2,
                name: "Forfait Glamour",
                price: "180€",
                originalPrice: "210€",
                services: ["Coupe + Brushing", "Soin du visage éclat", "Manucure semi-permanent", "Teinture sourcils"],
                popular: true,
              },
              {
                id: 3,
                name: "Forfait Prestige",
                price: "250€",
                originalPrice: "290€",
                services: ["Coloration + Coupe", "Soin anti-âge", "Manucure + Pédicure", "Massage complet 1h"],
                popular: false,
              },
            ].map((package_, index) => (
              <Card key={index} className={`relative ${package_.popular ? "ring-2 ring-sage scale-105" : ""}`}>
                {package_.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-sage text-white px-4 py-1 rounded-full text-sm font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-playfair text-charcoal">{package_.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-sage">{package_.price}</div>
                    <div className="text-sm text-gray-500 line-through">{package_.originalPrice}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {package_.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 text-sage mr-2 flex-shrink-0" />
                        <span className="text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full ${package_.popular
                      ? "bg-sage hover:bg-sage/90 text-white"
                      : "bg-white border-2 border-sage text-sage hover:bg-sage hover:text-white"
                      }`}
                    onClick={() => handleOpenModal(package_)}
                  >
                    Réserver ce forfait
                  </Button>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold mb-6">Besoin de conseils personnalisés ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Nos experts sont là pour vous conseiller et créer un programme de soins sur mesure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsAppointmentModalOpen(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-sage hover:bg-gray-100 px-8 py-3 rounded-full"
            >
              Prendre rendez-vous
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-sage px-8 py-3 rounded-full bg-transparent"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
      {/* 🧠 Ce composant doit absolument être monté ici aussi */}
      <Elements stripe={stripePromise}>
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => {
            setPreSelectedService(null) // Reset à la fermeture
            setInitialStep(1)
            setIsAppointmentModalOpen(false)
          }}
          initialService={preSelectedService}
          initialStep={initialStep}
        />
      </Elements>

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPackage={selectedPackage}
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={6000}
      />

    </div>
  )
}
