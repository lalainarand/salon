"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, CreditCard, User } from "lucide-react"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  initialService?: {
    id: number
    name: string
    price: number
    duration: string
  } | null 
  initialStep?: number
}


export default function AppointmentModal({
  isOpen,
  onClose,
  initialService,
  initialStep,
}: AppointmentModalProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState<{
    id: number
    name: string
    price: number
    duration: string
  } | null>(initialService ?? null)



  const [paymentMethod, setPaymentMethod] = useState("")

  const services = [
    { id: 1, name: "Coupe femme", price: 45, duration: "1h" },
    { id: 2, name: "Coupe + Brushing", price: 80, duration: "2h" },
    { id: 3, name: "Coloration", price: 60, duration: "1h30" },
    { id: 4, name: "Mèches", price: 35, duration: "45min" },
    { id: 5, name: "Soin capillaire", price: 40, duration: "1h" },
    { id: 6, name: "Soin hydratant", price: 70, duration: "1h" },
  ];


  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleClose = () => {
    setStep(1)
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedService(null)
    setPaymentMethod("")
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 1)
      setSelectedService(initialService ?? null)
    }
  }, [isOpen, initialStep, initialService])



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-charcoal">Prendre rendez-vous</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-sage text-white" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {i}
                </div>
                {i < 4 && <div className={`w-16 h-1 mx-2 ${i < step ? "bg-sage" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Choisissez votre service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card
                    key={service.name}
                    className={`${selectedService?.id === service.id ? "ring-2 ring-sage bg-sage/5" : "hover:shadow-md"}`}

                    onClick={() => setSelectedService(service)}

                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-charcoal">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                      <p className="text-lg font-bold text-sage">{service.price}€</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Choisissez la date et l'heure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-charcoal mb-2 block">Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-charcoal mb-2 block">Heure</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "bg-sage hover:bg-sage/90" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Vos informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Votre prénom" />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Votre nom" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="01 23 45 67 89" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea id="notes" placeholder="Informations supplémentaires..." />
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Récapitulatif et paiement</h3>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Récapitulatif de votre rendez-vous</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* ID du service */}
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-muted-foreground">Identifiant :</span>
                    <span>{selectedService?.id}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-sage" />
                    <span>{selectedService?.name}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5 text-sage" />
                    <span>{selectedDate?.toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-sage" />
                    <span>{selectedTime}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-sage">{selectedService?.price}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Mode de paiement</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="online"
                      name="payment"
                      value="online"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="online">Payer en ligne maintenant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="salon"
                      name="payment"
                      value="salon"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="salon">Payer au salon</Label>
                  </div>
                </div>
              </div>

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
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              Précédent
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={(step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime))}
                className="bg-sage hover:bg-sage/90"
              >
                Suivant
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Handle final submission
                  alert("Rendez-vous confirmé!")
                  handleClose()
                }}
                disabled={!paymentMethod}
                className="bg-sage hover:bg-sage/90"
              >
                {paymentMethod === "online" ? "Payer et confirmer" : "Confirmer le rendez-vous"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
