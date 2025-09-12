'use client'

import api from "@/lib/api";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Elements } from "@stripe/react-stripe-js";
import { Service } from "@/app/(client)/Types/service";
import { loadStripe } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"
import AppointmentModal from "@/components/appointment-modal"

export default function ContactPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([]);

  const phoneNumber = "+33123456789" 

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Lot II BIS", "Ankadindramamy, Tananarive"],
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: ["034 85 146 92", "032 62 641 88"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@beautysalon.fr", "rdv@beautysalon.fr"],
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lun - Ven: 9h - 19h", "Sam: 9h - 17h", "Dim: Fermé"],
    },
  ]

  const socialLinks = [
    { icon: Instagram, name: "Instagram", handle: "@beautysalon_paris" },
    { icon: Facebook, name: "Facebook", handle: "Beauty Salon Paris" },
  ]

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cream to-beige-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-6">Contactez-nous</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre parcours beauté.
              N'hésitez pas à nous contacter !
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-full">
                    <info.icon className="h-8 w-8 text-sage" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-charcoal">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input id="firstName" placeholder="Votre prénom" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input id="lastName" placeholder="Votre nom" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="01 23 45 67 89" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input id="subject" placeholder="Objet de votre message" required />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Décrivez votre demande..." rows={6} required />
                  </div>

                  <Button type="submit" className="w-full bg-sage hover:bg-sage/90 text-white py-3 rounded-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-charcoal">Trouvez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                    <p className="text-gray-500">Carte interactive - 123 Rue de la Beauté, Paris</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Situé au cœur de Paris, notre salon est facilement accessible en métro, bus ou en voiture. Un
                      parking est disponible à proximité.
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold text-charcoal">Transports :</p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Métro : Ligne 1, 4, 7 - Station Châtelet</li>
                        <li>• Bus : Lignes 21, 27, 38, 85</li>
                        <li>• Parking : Parking Rivoli (2 min à pied)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-charcoal">Suivez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Restez connectée avec nous sur les réseaux sociaux pour découvrir nos dernières créations et
                    conseils beauté.
                  </p>
                  <div className="space-y-3">
                    {socialLinks.map((social, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-sage/5 rounded-lg hover:bg-sage/10 transition-colors cursor-pointer"
                      >
                        <social.icon className="h-6 w-6 text-sage" />
                        <div>
                          <p className="font-medium text-charcoal">{social.name}</p>
                          <p className="text-sm text-gray-600">{social.handle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-sage text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold mb-6">Prête pour votre transformation ?</h2>
          <p className="text-xl mb-8 opacity-90">Contactez-nous dès maintenant pour planifier votre moment beauté</p>
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
              onClick={handleCall}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-sage px-8 py-3 rounded-full bg-transparent"
            >
              Appeler maintenant
            </Button>
          </div>
        </div>
      </section>
      {/* 🧠 Ce composant doit absolument être monté ici aussi */}
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
