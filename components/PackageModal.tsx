"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { CalendarDays, Clock, CreditCard, User } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface PackageType {
  id: number
  nom: string
  prix: string
  originalPrice: string
  services: string[]
}

interface PackageModalProps {
  isOpen: boolean
  onClose: () => void
  initialPackage: PackageType | null
  initialStep?: number
}

interface ClientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  note: string
}

export default function PackageModal({
  isOpen,
  onClose,
  initialPackage,
  initialStep = 1,
}: PackageModalProps) {
  const [step, setStep] = useState(initialStep)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    note: ""
  })
  const [paymentMethod, setPaymentMethod] = useState<"online" | "onsite" | "">("")
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleClose = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime("")
    setClientInfo({ firstName: "", lastName: "", email: "", phone: "", note: "" })
    setPaymentMethod("")
    setIsConfirmed(false)
    onClose()
  }

  const times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const isClientInfoValid = () => {
    return clientInfo.firstName && clientInfo.lastName && clientInfo.email && clientInfo.phone
  }

  const handleConfirmReservation = () => {
    setIsConfirmed(true)
    // Ici vous pouvez ajouter la logique pour envoyer les données au serveur
    console.log("Réservation confirmée:", {
      package: initialPackage,
      date: selectedDate,
      time: selectedTime,
      client: clientInfo,
      paymentMethod
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-charcoal">Prendre rendez-vous</DialogTitle>
        </DialogHeader>

        {/* ÉTAPE 1 - Choix de la date et heure */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-green-800 mb-2 block">Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate ?? undefined}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800 mb-2 block">Heure</Label>
                <div className="grid grid-cols-3 gap-2">
                  {times.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-sage hover:bg-green-800" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>

              </div>
              <div className="flex justify-between pt-6">
                <Button
                  className="w-full bg-sage hover:bg-green-800 text-white"
                  size="sm"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 - Informations client */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={clientInfo.firstName}
                      onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={clientInfo.lastName}
                      onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea id="notes"
                    onChange={(e) => setClientInfo({ ...clientInfo, note: e.target.value })}
                    placeholder="Informations supplémentaires..." />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Précédent
              </Button>
              <Button
                className="w-full bg-sage hover:bg-green-800 text-white"
                disabled={!isClientInfoValid()}
                onClick={() => setStep(3)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 - Récapitulatif et paiement */}
        {step === 3 && !isConfirmed && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Récapitulatif */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800 text-lg">Récapitulatif de votre rendez-vous</CardTitle>
              </CardHeader>



              <CardContent className="space-y-3">
                {/* ID du service */}
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-muted-foreground">Identifiant :</span>
                  <span>{initialPackage?.id}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-sage" />
                  <span>{initialPackage?.nom}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-sage" />
                  <span>{selectedDate?.toLocaleDateString("fr-FR")} - {selectedTime}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-sage" />
                  <span>{selectedTime}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-sage">{initialPackage?.prix} Ar</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Choix du mode de paiement */}
            <div>
              <h3 className="text-lg font-medium text-green-800 mb-3">Mode de paiement</h3>
              <div className="flex gap-4">
                <Button
                  variant={paymentMethod === "online" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full ${paymentMethod === "online" ? "bg-sage hover:bg-green-800" : ""}`}
                >
                  Payer en ligne maintenant
                </Button>
                <Button
                  variant={paymentMethod === "onsite" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("onsite")}
                  className={`w-full ${paymentMethod === "onsite" ? "bg-sage hover:bg-green-800" : ""}`}
                >
                  Payer sur place
                </Button>
              </div>
            </div>

            {/* Formulaire de paiement si paiement en ligne */}
            {paymentMethod === "online" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Informations de paiement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input id="cardName" placeholder="Nom complet" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between gap-4 sticky bottom-0 bg-white pt-4 mt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Précédent
              </Button>
              <Button
                className="w-full bg-sage hover:bg-green-800 text-white"
                onClick={handleConfirmReservation}
                disabled={!paymentMethod}
              >
                Confirmer la réservation
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 - Confirmation */}
        {step === 3 && isConfirmed && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-800">Réservation confirmée !</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                Votre rendez-vous pour <strong>{initialPackage?.nom}</strong>
              </p>
              <p className="text-green-700">
                le {selectedDate?.toLocaleDateString("fr-FR")} à {selectedTime}
              </p>
              <p className="text-green-600 mt-2">
                Un email de confirmation vous a été envoyé à {clientInfo.email}
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-sage hover:bg-green-800 text-white w-full"
            >
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}