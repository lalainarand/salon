'use client'

import Link from "next/link"
import api from "@/lib/api";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Award, Users, Clock } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import { Navigation, Pagination } from 'swiper/modules'
import AppointmentModal from "@/components/appointment-modal"
import { useState, useEffect } from "react"
import 'swiper/css'
import 'swiper/css/navigation'
import { Service } from "@/app/(client)/Types/service";

import 'swiper/css/pagination'
import React, { createContext } from 'react'


export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);


  useEffect(() => {

    const fetchServices = async () => {
      try {
        ;
        const token = localStorage.getItem("token");

        const { data } = await api.get("/api/services");

        console.log("Services from API:", data);
        setServices(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
      }
    };

    fetchServices();
  }, []);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

  const testimonials = [
    {
      name: "Mialy",
      rating: 5,
      comment: "Un service exceptionnel ! L'équipe est très professionnelle et l'ambiance est relaxante.",
    },
    {
      name: "Stephanie Ranto",
      rating: 5,
      comment: "Je recommande vivement ce salon. Ma coupe de cheveux était parfaite !",
    },
    {
      name: "Narindra Ran",
      rating: 5,
      comment: "Le soin du visage était incroyable. Je me sens complètement détendue.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cream to-beige-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
                Révélez votre
                <span className="text-sage block">beauté naturelle</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Découvrez notre salon de beauté où l'élégance rencontre l'expertise. Nos professionnels vous offrent des
                soins personnalisés dans un cadre luxueux et apaisant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="bg-sage hover:bg-sage/90 text-white px-6 py-2 rounded-full transition-all duration-200"
                >
                  Prendre rendez-vous
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-sage text-sage hover:bg-sage/10 px-8 py-3 rounded-full bg-transparent"
                >
                  Découvrir nos services
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="test.jpg"
                alt="Salon de beauté élégant"
                width={400}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-12">
            Nos engagements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🌿",
                title: "Nature & Éthique",
                desc: "Nous utilisons des produits naturels, cruelty-free et écoresponsables.",
              },
              {
                icon: "🧘‍♀️",
                title: "Bien-être global",
                desc: "Chaque soin est pensé pour détendre le corps et apaiser l’esprit.",
              },
              {
                icon: "🛡️",
                title: "Hygiène irréprochable",
                desc: "Protocole strict, matériel stérilisé à chaque prestation.",
              },
              {
                icon: "💬",
                title: "Écoute & Conseil",
                desc: "Un diagnostic personnalisé pour répondre exactement à vos besoins.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-beige-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Services Preview */}
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-4">Nos services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des soins d'exception pour sublimer votre beauté naturelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Coiffure & Styling",
                description: "Coupes tendance, colorations et soins capillaires personnalisés",
                image: "2.png",
              },
              {
                title: "Soins du visage",
                description: "Traitements anti-âge, hydratation et purification de la peau",
                image: "3.png",
              },
              {
                title: "Manucure & Pédicure",
                description: "Soins des ongles et des mains dans les règles de l'art",
                image: "4.png",
              },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-charcoal mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href="/services" className="text-sage font-medium hover:underline">
                    En savoir plus →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-6">
            Avant / Après
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            Des transformations sublimes grâce à nos soins personnalisés
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {[
              { before: '/beaute1.jpg', after: '/beaute2.jpg' },
              { before: '/beaute3.jpg', after: '/beaute4.jpg' },
              { before: '/beaute5.jpg', after: '/beaute6.jpg' },
            ].map((item, i) => (
              <SwiperSlide key={i}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <Image
                      src={item.before}
                      alt={`Avant ${i + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-64 md:h-80 lg:h-[400px] object-cover"

                    />

                    <p className="mt-2 text-charcoal font-medium">Avant</p>
                  </div>
                  <div>
                    <Image
                      src={item.after}
                      alt={`Après ${i + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-64 md:h-80 lg:h-[400px] object-cover"

                    />

                    <p className="mt-2 text-charcoal font-medium">Après</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-4">
              Ce que disent nos clientes
            </h2>
            <p className="text-lg text-gray-600">Découvrez les témoignages de nos clientes satisfaites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold text-charcoal">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-6">Prête à vous faire chouchouter ?</h2>
          <p className="text-xl mb-8 opacity-90">Réservez dès maintenant votre moment de détente et de beauté</p>
          <Button onClick={() => setIsAppointmentModalOpen(true)} size="lg" variant="secondary" className="bg-white text-sage hover:bg-gray-100 px-8 py-3 rounded-full">
            Prendre rendez-vous maintenant
          </Button>
        </div>
      </section>

      {isAppointmentModalOpen && (
        <Elements stripe={stripePromise}>
          <AppointmentModal
            isOpen={true} 
            onClose={() => setIsAppointmentModalOpen(false)}
            services={services}
          />
        </Elements>
      )}

    </div>
  )
}
