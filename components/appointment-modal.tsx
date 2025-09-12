"use client"

import { Service } from "@/app/(client)/Types/service";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie";
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import api from "@/lib/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CalendarDays, Clock, CreditCard, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ErrorNotification, { useErrorNotification } from "@/app/(admin-group)/admin/components/ErrorNotification"

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: Service | null | undefined;
  initialStep?: number;
  services: any[];
}

interface ClientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  note: string
}

// ✅ COMPOSANT WRAPPER (sans hooks Stripe)
export default function AppointmentModal({
  isOpen,
  onClose,
  initialService,
  initialStep,
  services = [], // tableau vide par défaut si pas fourni
}: AppointmentModalProps & { initialService?: Service | null }) {

  // Pas de hooks Stripe ici !
  if (!isOpen) return null;

  return (
    <AppointmentModalContent
      onClose={onClose}
      initialService={initialService}
      initialStep={initialStep}
      services={services} // toujours un tableau
    />
  );
}


function formatDateForApi(date?: Date | string): string | null {
  if (!date) return null; // ou tu peux throw une erreur selon ton cas
  return new Date(date).toISOString().split("T")[0];
}

// ✅ COMPOSANT AVEC HOOKS STRIPE
function AppointmentModalContent({
  onClose,
  initialService,
  initialStep,
  services = [],
}: {
  onClose: () => void;
  initialService?: Service | null;
  initialStep?: number;
  services: any[];
}) {
  // ✅ Maintenant les hooks sont dans le contexte Elements !
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [user, setUser] = useState<any | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isshowbtn, setIsisshowbtn] = useState(true)
  const { notification, showError, hideNotification } = useErrorNotification()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialService ?? null
  )

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    note: "",
  })

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleClose = () => {
    setStep(1)
    setClientInfo({ firstName: "", lastName: "", email: "", phone: "", note: "" })
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedService(null)
    setPaymentMethod("")
    setIsConfirmed(false)
    onClose()
  }

  const handleConfirmReservation = async () => {
    if (!stripe || !elements) {
      console.log("Stripe pas encore prêt:", { stripe, elements });
      showError("Le paiement n'est pas prêt. Veuillez réessayer.");
      return;
    }

    if (paymentMethod === "online") {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("CardElement non trouvé");
        showError("Impossible de trouver le champ de carte. Veuillez réessayer.");
        return;
      }

      try {
        // Crée un PaymentMethod Stripe
        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${user.nom}`,
            email: user.email,
            phone: user.phone,
          },
        });

        if (error) {
          console.error("Erreur Stripe:", error);
          showError(`Erreur de paiement : ${error.message}`);
          setIsConfirmed(false);
          setIsisshowbtn(true);
          return;
        }

        // Envoyer la réservation au serveur
        await api.post("/api/appointments", {
          service_id: selectedService?.id,
          client_id: user?.id,
          date: formatDateForApi(selectedDate),
          heure: selectedTime,
          mode_paiement: "paiement_en_ligne",
          stripe_payment_method_id: stripePaymentMethod.id,
          note: clientInfo.note,
          status: "confirmé",
          paye: 1,
          price: selectedService?.prix,
        });

      } catch (err: any) {
        console.error("Erreur lors du paiement:", err);
        const message = err.response?.data?.message || "Une erreur s'est produite lors du paiement.";
        showError(message);
        setIsConfirmed(false);
        setIsisshowbtn(true);
        return;
      }

    } else {
      try {
        // Paiement en espèces
        await api.post("/api/appointments", {
          service_id: selectedService?.id,
          client_id: user?.id,
          date: formatDateForApi(selectedDate),
          heure: selectedTime,
          mode_paiement: "especes",
          note: clientInfo.note,
          status: "confirmé",
          paye: 0,
        });
      } catch (err: any) {
        console.error("Erreur lors de la réservation:", err);
        const message = err.response?.data?.message || "Erreur lors de la réservation.";
        showError(message);
        setIsConfirmed(false);
        setIsisshowbtn(true);
        return;
      }
    }

    setIsConfirmed(true);
    setIsisshowbtn(false);
  };


  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
    if (initialService) {
      setSelectedService(initialService);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Pré-remplir les infos client avec les données utilisateur
        setClientInfo(prev => ({
          ...prev,
          firstName: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        }));
      } catch (error) {
        console.error("Erreur parsing user:", error);
        setUser(null);
      }
    }
  }, [initialStep, initialService]);

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-charcoal">
            Prendre rendez-vous
          </DialogTitle>
        </DialogHeader>

        {/* Debug Stripe (à supprimer en production) */}
        {/* <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
          <p>🔧 Debug: Stripe: {stripe ? "✅" : "❌"} | Elements: {elements ? "✅" : "❌"}</p>
        </div> */}

        <div className="space-y-6">
          {/* Progress indicator */}
          {isshowbtn && (
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
          )}

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">
                Choisissez votre service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${selectedService?.id === service.id
                      ? "ring-2 ring-sage bg-sage/5"
                      : "hover:shadow-md"
                      }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-charcoal">{service.nom}</h4>
                      <p className="text-sm text-gray-600">
                        {service.duree_minutes} min
                      </p>
                      <p className="text-lg font-bold text-sage">{service.prix} Ar</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {service.categorie?.nom}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">
                Choisissez la date et l'heure
              </h3>
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
                  <Input
                    id="firstName"
                    value={clientInfo.firstName}
                    onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={clientInfo.lastName}
                    onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    placeholder="votre.email@exemple.com"
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
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={clientInfo.note}
                  onChange={(e) => setClientInfo({ ...clientInfo, note: e.target.value })}
                  placeholder="Informations supplémentaires..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && !isConfirmed && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">
                Récapitulatif et paiement
              </h3>

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
                    <span>{selectedService?.nom}</span>
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
                      <span className="text-sage">{selectedService?.prix} Ar</span>
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
                      checked={paymentMethod === "online"}
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
                      checked={paymentMethod === "salon"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="salon">Payer sur place</Label>
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
                    {!stripe || !elements ? (
                      <div className="p-3 border rounded-md bg-yellow-50">
                        <p className="text-yellow-800">⏳ Chargement de Stripe...</p>
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#32325d",
                                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                fontSmoothing: "antialiased",
                                "::placeholder": {
                                  color: "#aab7c4"
                                }
                              },
                              invalid: {
                                color: "#e53e3e",
                                iconColor: "#e53e3e"
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Confirmation Step */}
          {step === 4 && isConfirmed && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-green-800">Réservation confirmée !</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  Votre rendez-vous pour <strong>{selectedService?.nom}</strong>
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

          {/* Navigation buttons */}
          {isshowbtn && (
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                Précédent
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedService) ||
                    (step === 2 && (!selectedDate || !selectedTime)) ||
                    (step === 3 && (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email))
                  }
                  className="bg-sage hover:bg-sage/90"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmReservation}
                  disabled={!paymentMethod || (paymentMethod === "online" && (!stripe || !elements))}
                  className="bg-sage hover:bg-sage/90"
                >
                  {paymentMethod === "online" ? "Payer et confirmer" : "Confirmer le rendez-vous"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <ErrorNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000} // 4 secondes
      />

    </Dialog>
  )
}