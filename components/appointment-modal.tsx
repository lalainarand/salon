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
  paymentMethods: { id: number; nom: string }[];
}

interface ClientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  note: string
}

export default function AppointmentModal({
  isOpen,
  onClose,
  initialService,
  initialStep,
  services = [],
  paymentMethods,
}: AppointmentModalProps & { initialService?: Service | null }) {

  if (!isOpen) return null;

  return (
    <AppointmentModalContent
      onClose={onClose}
      initialService={initialService}
      initialStep={initialStep}
      services={services}
      paymentMethods={paymentMethods}
    />
  );
}

function formatDateForApi(date?: Date | string): string | null {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Mois commence à 0
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function AppointmentModalContent({
  onClose,
  initialService,
  initialStep,
  services = [],
  paymentMethods,
}: {
  onClose: () => void;
  initialService?: Service | null;
  initialStep?: number;
  services: any[];
  paymentMethods: { id: number; nom: string }[];
}) {
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

  const handleNext = () => { if (step < 4) setStep(step + 1) }
  const handlePrevious = () => { if (step > 1) setStep(step - 1) }

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

    if (paymentMethod.toLowerCase() === "stripe") {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        showError("Impossible de trouver le champ de carte.");
        return;
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
        });

        if (error) {
          showError(`Erreur de paiement : ${error.message}`);
          setIsConfirmed(false);
          setIsisshowbtn(true);
          return;
        }

        console.log('date', formatDateForApi(selectedDate));

        await api.post("/api/appointments", {
          service_id: selectedService?.id,
          client_id: user?.id,
          date: formatDateForApi(selectedDate),
          heure: selectedTime,
          mode_paiement: "stripe",
          stripe_payment_method_id: stripePaymentMethod.id,
          note: clientInfo.note,
          status: "en_attente",
          paye: 1,
          price: selectedService?.prix,
        });
      } catch (err: any) {
        const message = err.response?.data?.message || "Erreur lors du paiement.";
        showError(message);
        setIsConfirmed(false);
        setIsisshowbtn(true);
        return;
      }
    } else {
      try {
        console.log('date', formatDateForApi(selectedDate));
        console.log('date1', selectedDate);

        await api.post("/api/appointments", {
          service_id: selectedService?.id,
          client_id: user?.id,
          date: formatDateForApi(selectedDate),
          heure: selectedTime,
          mode_paiement: paymentMethod,
          note: clientInfo.note,
          status: "en_attente",
          paye: 0,
        });
      } catch (err: any) {
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
    if (initialStep) setStep(initialStep);
    if (initialService) setSelectedService(initialService);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setClientInfo(prev => ({
          ...prev,
          firstName: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        }));
      } catch {
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

        <div className="space-y-6">
          {/* Étapes progressives */}
          {isshowbtn && (
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-sage text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {i}
                  </div>
                  {i < 4 && <div className={`w-16 h-1 mx-2 ${i < step ? "bg-sage" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Étape 1 : service */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Choisissez votre service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${selectedService?.id === service.id ? "ring-2 ring-sage bg-sage/5" : "hover:shadow-md"}`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-charcoal">{service.nom}</h4>
                      <p className="text-sm text-gray-600">{service.duree_minutes} min</p>
                      <p className="text-lg font-bold text-sage">{service.prix} Ar</p>
                      <p className="text-xs text-gray-500 mt-1">{service.categorie?.nom}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2 : date & heure */}
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

          {/* Étape 3 : infos client */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Vos informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nom et prénom</Label>
                  <Input value={clientInfo.firstName} readOnly />
                </div>
                <div>
                  <Label>Identifiant</Label>
                  <Input value="SERV-0010-BT" readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={clientInfo.email} readOnly />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input value={clientInfo.phone} readOnly />
                </div>
              </div>
              <div>
                <Label>Notes (optionnel)</Label>
                <Textarea
                  value={clientInfo.note}
                  onChange={(e) => setClientInfo({ ...clientInfo, note: e.target.value })}
                  placeholder="Informations supplémentaires..."
                />
              </div>
            </div>
          )}

          {/* Étape 4 : paiement */}
          {step === 4 && !isConfirmed && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Récapitulatif et paiement</h3>

              {/* Résumé */}
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3"><User className="h-5 w-5 text-sage" /><span>{selectedService?.nom}</span></div>
                  <div className="flex items-center space-x-3"><CalendarDays className="h-5 w-5 text-sage" /><span>{selectedDate?.toLocaleDateString("fr-FR")}</span></div>
                  <div className="flex items-center space-x-3"><Clock className="h-5 w-5 text-sage" /><span>{selectedTime}</span></div>
                  <div className="border-t pt-3 mt-3 flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-sage">{selectedService?.prix} Ar</span>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Mode de paiement dynamique */}
              <div className="space-y-4">
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


              {/* Stripe */}
              {paymentMethod === "stripe" && (
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
                                "::placeholder": { color: "#aab7c4" },
                              },
                              invalid: { color: "#e53e3e", iconColor: "#e53e3e" },
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

          {/* Confirmation */}
          {step === 4 && isConfirmed && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-semibold text-green-800">Réservation confirmée !</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">Votre rendez-vous pour <strong>{selectedService?.nom}</strong></p>
                <p className="text-green-700">le {selectedDate?.toLocaleDateString("fr-FR")} à {selectedTime}</p>
                <p className="text-green-600 mt-2">Un email de confirmation vous a été envoyé à {clientInfo.email}</p>
              </div>
              <Button onClick={handleClose} className="bg-sage hover:bg-green-800 text-white w-full">Fermer</Button>
            </div>
          )}

          {/* Navigation */}
          {isshowbtn && (
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>Précédent</Button>
              {step < 4 ? (
                <Button onClick={handleNext} disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!selectedDate || !selectedTime)) ||
                  (step === 3 && (!clientInfo.firstName || !clientInfo.email))
                } className="bg-sage hover:bg-sage/90">
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmReservation}
                  disabled={!paymentMethod || (paymentMethod === "stripe" && (!stripe || !elements))}
                  className="bg-sage hover:bg-sage/90"
                >
                  {paymentMethod === "stripe" ? "Payer et confirmer" : "Confirmer le rendez-vous"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <ErrorNotification show={notification.show} message={notification.message} onClose={hideNotification} duration={4000} />
    </Dialog>
  )
}
