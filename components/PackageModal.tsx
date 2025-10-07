"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import api from "@/lib/api";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, CreditCard, User } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import ErrorNotification, { useErrorNotification } from "@/app/(admin-group)/admin/components/ErrorNotification"

interface ModePaiement {
  id: number
  nom: string
  statut: number
}

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
  paymentMethods: ModePaiement[]
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
  paymentMethods,
}: PackageModalProps) {
  const [step, setStep] = useState(initialStep)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [user, setUser] = useState<any | null>(null)
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    note: ""
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setClientInfo(prev => ({
          ...prev,
          firstName: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        }))
      } catch (error) {
        console.error("Erreur parsing user:", error)
        setUser(null)
      }
    }
  }, [])

  const stripe = useStripe()
  const elements = useElements()
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { showError } = useErrorNotification()

  const times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const formatDateForApi = (date?: Date | string): string | null =>
    date ? new Date(date).toISOString().split("T")[0] : null

  const isClientInfoValid = () =>
    clientInfo.firstName && clientInfo.email && clientInfo.phone

  const handleClose = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime("")
    setClientInfo({ firstName: "", lastName: "", email: "", phone: "", note: "" })
    setPaymentMethod("")
    setIsConfirmed(false)
    onClose()
  }

  const handleConfirmReservation = async () => {
    const apiDate = selectedDate ? formatDateForApi(selectedDate) : null

    if (paymentMethod.toLowerCase() === "stripe") {
      if (!stripe || !elements) {
        showError("Le paiement n'est pas prêt. Veuillez réessayer.")
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        showError("Impossible de trouver le champ de carte.")
        return
      }

      try {
        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${user.nom}`,
            email: user.email,
            phone: user.phone,
          },
        })

        if (error) {
          showError(`Erreur de paiement : ${error.message}`)
          return
        }

        await api.post("/api/appointments/forfaits", {
          package: initialPackage,
          client_id: user?.id,
          date: apiDate,
          heure: selectedTime,
          mode_paiement: "paiement_en_ligne",
          stripe_payment_method_id: stripePaymentMethod.id,
          note: clientInfo.note,
          status: "confirmé",
          paye: 1,
          price: initialPackage?.prix,
        })

      } catch (err: any) {
        showError(err.response?.data?.message || "Une erreur est survenue.")
        return
      }
    } else {
      try {
        await api.post("/api/appointments/forfaits", {
          package: initialPackage,
          client_id: user?.id,
          date: apiDate,
          heure: selectedTime,
          mode_paiement: paymentMethod,
          note: clientInfo.note,
          status: "confirmé",
          paye: 0,
        })
      } catch (err: any) {
        showError(err.response?.data?.message || "Erreur lors de la réservation.")
        return
      }
    }

    setIsConfirmed(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-charcoal">
            Prendre rendez-vous
          </DialogTitle>
        </DialogHeader>

        {/* ------------------ ETAPE 1 ------------------ */}
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

        {/* ------------------ ETAPE 2 ------------------ */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nom et Prénom </Label>
                    <Input
                      id="firstName"
                      value={clientInfo.firstName}
                      onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                      placeholder="Votre prénom"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Identifiant unique</Label>
                    <Input
                      id="lastName"
                      value="FOR-221-BT"
                      onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      placeholder="Votre nom"
                      readOnly
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="votre.email@exemple.com"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    onChange={(e) => setClientInfo({ ...clientInfo, note: e.target.value })}
                    placeholder="Informations supplémentaires..."
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-between gap-4">
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
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

        {/* ------------------ ETAPE 3 ------------------ */}
        {step === 3 && !isConfirmed && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Récapitulatif */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800 text-lg">Récapitulatif de votre rendez-vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-sage" />
                  <span>{initialPackage?.nom}</span>
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
                    <span className="text-sage">{initialPackage?.prix} Ar</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ------------------ Paiement dynamique ------------------ */}
            <div>
              <Label className="text-base font-medium">Mode de paiement</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {paymentMethods?.length > 0 ? (
                  paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`payment-${method.id}`}
                        name="payment"
                        value={method.nom.toLowerCase()}
                        checked={paymentMethod === method.nom.toLowerCase()}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor={`payment-${method.id}`}>{method.nom}</Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Aucun mode de paiement disponible</p>
                )}
              </div>
            </div>



            {/* Stripe uniquement si sélectionné */}
            {paymentMethod.toLowerCase() === "stripe" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Informations de paiement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!stripe || !elements ? (
                    <div className="p-3 border rounded-md bg-yellow-50">
                      <p className="text-yellow-800">⏳ Chargement de Stripe...</p>
                    </div>
                  ) : (
                    <div className="p-3 border rounded-md">
                      <CardElement
                        options={{
                          style: {
                            base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#aab7c4" } },
                            invalid: { color: "#e53e3e" },
                          },
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between gap-4 sticky bottom-0 bg-white pt-4 mt-4 border-t">
              <Button variant="outline" className="w-full" onClick={() => setStep(2)}>Précédent</Button>
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

        {/* ------------------ Confirmation ------------------ */}
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
