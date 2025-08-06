"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Clock, MapPin, CreditCard, Bell, Shield, Save, Phone, Mail, Globe } from "lucide-react"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

export default function SettingsPage() {
  const { notification, showSuccess, hideNotification } = useSuccessNotification()
  const [settings, setSettings] = useState({
    // Informations générales
    salonName: "Beauty Salon",
    address: "123 Rue de la Beauté, 75001 Paris",
    phone: "01 23 45 67 89",
    email: "contact@beautysalon.fr",
    website: "www.beautysalon.fr",

    // Horaires
    openingHours: {
      monday: { open: "09:00", close: "19:00", closed: false },
      tuesday: { open: "09:00", close: "19:00", closed: false },
      wednesday: { open: "09:00", close: "19:00", closed: false },
      thursday: { open: "09:00", close: "19:00", closed: false },
      friday: { open: "09:00", close: "19:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },

    // Paiements
    paymentMethods: {
      cash: true,
      card: true,
      check: false,
      online: true,
    },

    // Notifications
    notifications: {
      emailReminders: true,
      smsReminders: true,
      confirmationEmails: true,
      cancellationNotifications: true,
      reminderHours: 24,
    },

    // Conditions d'annulation
    cancellationPolicy: {
      freeHours: 24,
      penaltyPercentage: 50,
      description: "Annulation gratuite jusqu'à 24h avant le rendez-vous. Au-delà, 50% du montant sera facturé.",
    },
  })

  const days = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ]

  const handleSave = () => {
    // Logique de sauvegarde
    console.log("Paramètres sauvegardés:", settings)
    showSuccess(`Paramètres sauvegardés avec succès`)

  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configurez les paramètres de votre salon</p>
        </div>
        <Button onClick={handleSave} className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="hours">Horaires</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="policies">Conditions</TabsTrigger>
        </TabsList>

        {/* Informations Générales */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Informations du Salon
                </CardTitle>
                <CardDescription>Informations générales de votre établissement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salonName">Nom du salon</Label>
                    <Input
                      id="salonName"
                      value={settings.salonName}
                      onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Horaires d'ouverture */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horaires d'Ouverture
              </CardTitle>
              <CardDescription>Définissez les horaires d'ouverture de votre salon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <Label className="font-medium">{day.label}</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!settings.openingHours[day.key as keyof typeof settings.openingHours].closed}
                        onCheckedChange={(checked) => {
                          setSettings({
                            ...settings,
                            openingHours: {
                              ...settings.openingHours,
                              [day.key]: {
                                ...settings.openingHours[day.key as keyof typeof settings.openingHours],
                                closed: !checked,
                              },
                            },
                          })
                        }}
                      />
                      <Label className="text-sm">Ouvert</Label>
                    </div>

                    {!settings.openingHours[day.key as keyof typeof settings.openingHours].closed && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={settings.openingHours[day.key as keyof typeof settings.openingHours].open}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              openingHours: {
                                ...settings.openingHours,
                                [day.key]: {
                                  ...settings.openingHours[day.key as keyof typeof settings.openingHours],
                                  open: e.target.value,
                                },
                              },
                            })
                          }}
                          className="w-32"
                        />
                        <span>à</span>
                        <Input
                          type="time"
                          value={settings.openingHours[day.key as keyof typeof settings.openingHours].close}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              openingHours: {
                                ...settings.openingHours,
                                [day.key]: {
                                  ...settings.openingHours[day.key as keyof typeof settings.openingHours],
                                  close: e.target.value,
                                },
                              },
                            })
                          }}
                          className="w-32"
                        />
                      </div>
                    )}

                    {settings.openingHours[day.key as keyof typeof settings.openingHours].closed && (
                      <span className="text-gray-500 italic">Fermé</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modes de paiement */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Modes de Paiement
              </CardTitle>
              <CardDescription>Activez les modes de paiement acceptés dans votre salon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Espèces</Label>
                    <p className="text-sm text-gray-600">Paiement en liquide</p>
                  </div>
                  <Switch
                    checked={settings.paymentMethods.cash}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, cash: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Carte Bancaire</Label>
                    <p className="text-sm text-gray-600">CB, Visa, Mastercard</p>
                  </div>
                  <Switch
                    checked={settings.paymentMethods.card}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, card: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Chèque</Label>
                    <p className="text-sm text-gray-600">Paiement par chèque</p>
                  </div>
                  <Switch
                    checked={settings.paymentMethods.check}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, check: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Paiement en ligne</Label>
                    <p className="text-sm text-gray-600">PayPal, Stripe, etc.</p>
                  </div>
                  <Switch
                    checked={settings.paymentMethods.online}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, online: checked },
                      })
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configuration des Notifications
              </CardTitle>
              <CardDescription>Gérez les rappels et confirmations automatiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Rappels par email</Label>
                    <p className="text-sm text-gray-600">Envoyer des rappels par email aux clients</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailReminders}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailReminders: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Rappels par SMS</Label>
                    <p className="text-sm text-gray-600">Envoyer des rappels par SMS aux clients</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsReminders}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsReminders: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Confirmations par email</Label>
                    <p className="text-sm text-gray-600">Confirmer les RDV par email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.confirmationEmails}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, confirmationEmails: checked },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Notifications d'annulation</Label>
                    <p className="text-sm text-gray-600">Notifier les annulations</p>
                  </div>
                  <Switch
                    checked={settings.notifications.cancellationNotifications}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, cancellationNotifications: checked },
                      })
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderHours">Délai de rappel (heures avant le RDV)</Label>
                <Select
                  value={settings.notifications.reminderHours.toString()}
                  onValueChange={(value) => {
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reminderHours: Number.parseInt(value) },
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 heure</SelectItem>
                    <SelectItem value="2">2 heures</SelectItem>
                    <SelectItem value="6">6 heures</SelectItem>
                    <SelectItem value="12">12 heures</SelectItem>
                    <SelectItem value="24">24 heures</SelectItem>
                    <SelectItem value="48">48 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conditions d'annulation */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Conditions d'Annulation
              </CardTitle>
              <CardDescription>Définissez votre politique d'annulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeHours">Annulation gratuite (heures)</Label>
                  <Select
                    value={settings.cancellationPolicy.freeHours.toString()}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        cancellationPolicy: { ...settings.cancellationPolicy, freeHours: Number.parseInt(value) },
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 heures</SelectItem>
                      <SelectItem value="6">6 heures</SelectItem>
                      <SelectItem value="12">12 heures</SelectItem>
                      <SelectItem value="24">24 heures</SelectItem>
                      <SelectItem value="48">48 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penalty">Pénalité (%)</Label>
                  <Select
                    value={settings.cancellationPolicy.penaltyPercentage.toString()}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        cancellationPolicy: {
                          ...settings.cancellationPolicy,
                          penaltyPercentage: Number.parseInt(value),
                        },
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyDescription">Description de la politique</Label>
                <Textarea
                  id="policyDescription"
                  value={settings.cancellationPolicy.description}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      cancellationPolicy: { ...settings.cancellationPolicy, description: e.target.value },
                    })
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Composant de notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000} // 4 secondes
      />
    </div>
  )
}
