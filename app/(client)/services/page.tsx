'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import AppointmentModal from "@/components/appointment-modal"

const serviceCategories = [
  {
    title: "Coiffure & Styling",
    description: "Des coupes tendance aux colorations sophistiquées",
    services: [
      {
        id: 1,
        name: "Coupe femme",
        price: "45€",
        duration: "1h",
        description: "Coupe personnalisée selon votre style",
        image: "coiffure1.jpg"
      },
      {
        id: 2,
        name: "Coupe + Brushing",
        price: "55€",
        duration: "1h30",
        description: "Coupe et mise en forme professionnelle",
        image: "coiffure6.jpg"
      },
      {
        id: 3,
        name: "Coloration",
        price: "80€",
        duration: "2h",
        description: "Coloration complète avec produits haut de gamme",
        image: "coiffure2.jpg"
      },
      {
        id: 4,
        name: "Mèches",
        price: "90€",
        duration: "2h30",
        description: "Mèches ou balayage pour illuminer vos cheveux",
        image: "coiffure3.jpg"
      },
      {
        id: 5,
        name: "Soin capillaire",
        price: "35€",
        duration: "45min",
        description: "Soin réparateur et nourrissant",
        image: "coiffure8.jpg"
      },
    ],
  },
  {
    title: "Soins du visage",
    description: "Traitements personnalisés pour une peau éclatante",
    services: [
      {
        id: 6,
        name: "Soin hydratant",
        price: "60€",
        duration: "1h",
        description: "Hydratation profonde pour tous types de peau",
        image: "coiffure4.jpg"
      },
      {
        id: 7,
        name: "Soin anti-âge",
        price: "85€",
        duration: "1h30",
        description: "Traitement raffermissant et lissant",
        image: "coiffure7.jpg"
      },
      {
        id: 8,
        name: "Nettoyage de peau",
        price: "70€",
        duration: "1h15",
        description: "Purification et extraction des impuretés",
        image: "coiffure5.jpg"
      },
      {
        id: 9,
        name: "Soin éclat",
        price: "65€",
        duration: "1h",
        description: "Illumine et unifie le teint",
        image: "coiffure1.jpg"
      },
    ],
  },
  {
    title: "Manucure & Pédicure",
    description: "Soins des ongles et beauté des mains et pieds",
    services: [
      {
        id: 10,
        name: "Manucure classique",
        price: "35€",
        duration: "45min",
        description: "Soin complet des ongles et des mains",
        image: "coiffure6.jpg"
      },
      {
        id: 11,
        name: "Manucure semi-permanent",
        price: "45€",
        duration: "1h",
        description: "Vernis longue tenue jusqu'à 3 semaines",
        image: "coiffure7.jpg"
      },
      {
        id: 12,
        name: "Pédicure",
        price: "40€",
        duration: "1h",
        description: "Soin complet des pieds et des ongles",
        image: "coiffure4.jpg"
      },
    ],
  },
  {
    title: "Bien-être & Relaxation",
    description: "Moments de détente et de relaxation",
    services: [
      {
        id: 13,
        name: "Massage relaxant",
        price: "70€",
        duration: "1h",
        description: "Massage corps complet pour se détendre",
        image: "coiffure8.jpg"
      },
      {
        id: 14,
        name: "Massage du visage",
        price: "45€",
        duration: "30min",
        description: "Massage anti-stress du visage et du crâne",
        image: "coiffure5.jpg"
      },
      {
        id: 15,
        name: "Épilation sourcils",
        price: "25€",
        duration: "30min",
        description: "Mise en forme parfaite des sourcils",
        image: "coiffure2.jpg"
      },
      {
        id: 16,
        name: "Teinture sourcils/cils",
        price: "30€",
        duration: "45min",
        description: "Intensification du regard",
        image: "coiffure3.jpg"
      },
    ],
  },
];

type ServiceType = {
  id: number
  name: string
  price: number
  duration: string
}


export default function ServicesPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [preSelectedService, setPreSelectedService] = useState<ServiceType | null>(null)
  const [initialStep, setInitialStep] = useState<number>(1)



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
          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">{category.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, serviceIndex) => (
                  <Card key={serviceIndex} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={400}
                      height={250}
                      className="w-full h-52 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="text-lg text-charcoal">{service.name}</span>
                        <span className="text-xl font-bold text-sage">{service.price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      <Button
                        className="w-full bg-sage hover:bg-sage/90 text-white rounded-full"
                        onClick={() => {
                          setPreSelectedService({
                            id: service.id,
                            name: service.name,
                            price: Number(service.price),
                            duration: service.duration,
                          })
                          setInitialStep(2)
                          setIsAppointmentModalOpen(true)
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
                name: "Forfait Détente",
                price: "120€",
                originalPrice: "140€",
                services: ["Soin du visage hydratant", "Massage relaxant 30min", "Manucure classique"],
                popular: false,
              },
              {
                name: "Forfait Glamour",
                price: "180€",
                originalPrice: "210€",
                services: ["Coupe + Brushing", "Soin du visage éclat", "Manucure semi-permanent", "Teinture sourcils"],
                popular: true,
              },
              {
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

    </div>
  )
}
