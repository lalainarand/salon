"use client"

import api from "@/lib/api";
import { useState, useEffect } from "react";
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

// 🔹 Types pour Opening Hours
type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

type OpeningHours = Record<string, DayHours>;

type PaymentMethods = Record<string, boolean>;

type Notifications = {
  emailReminders: boolean;
  smsReminders: boolean;
  confirmationEmails: boolean;
  cancellationNotifications: boolean;
  reminderHours: number;
};

type CancellationPolicy = {
  freeHours: number;
  penaltyPercentage: number;
  description: string;
};

type SettingsState = {
  salonName: string;
  address: string;
  phone: string;
  email: string;
  description: string,
  website: string;
  openingHours: OpeningHours;
  paymentMethods: PaymentMethods;
  notifications: Notifications;
  cancellationPolicy: CancellationPolicy;
};

export default function SettingsPage() {
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  const [settings, setSettings] = useState<SettingsState>({
    salonName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    openingHours: {},
    paymentMethods: {},
    notifications: {
      emailReminders: true,
      smsReminders: true,
      confirmationEmails: true,
      cancellationNotifications: true,
      reminderHours: 24,
    },
    cancellationPolicy: {
      freeHours: 24,
      penaltyPercentage: 50,
      description: "",
    },
  });

  // 🔹 Récupération des settings depuis l'API
  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/api/settings");
      console.log('resulatats de settings',data)
      const mappedOpeningHours: OpeningHours = {};
      data.horaireOuverture.forEach((h: any) => {
        mappedOpeningHours[h.jour.toLowerCase()] = {
          open: h.heure_ouverture.slice(0, 5),
          close: h.heure_fermeture.slice(0, 5),
          closed: h.ouvert === 0,
        };
      });

      const mappedPaymentMethods: PaymentMethods = {};
      data.mode_payement.forEach((m: any) => {
        const key = m.nom.toLowerCase().replace(/\s+/g, "");
        mappedPaymentMethods[key] = m.statut === 1;
      });

      setSettings({
        salonName: data.settings.nom_salon,
        address: data.settings.address,
        phone: data.settings.telephone,
        email: data.settings.email,
        description: data.settings.description,
        website: data.settings.site_web,
        openingHours: mappedOpeningHours,
        paymentMethods: mappedPaymentMethods,
        notifications: {
          emailReminders: true,
          smsReminders: true,
          confirmationEmails: true,
          cancellationNotifications: true,
          reminderHours: data.condition?.heures || 24,
        },
        cancellationPolicy: {
          freeHours: data.condition?.heures || 24,
          penaltyPercentage: Number(data.condition?.penalite) || 50,
          description: data.condition?.description || "",
        },
      });
    } catch (error) {
      console.error("Erreur lors du fetch des settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 🔹 Sauvegarde des settings
  const handleSave = async () => {
    try {
      const payload = {
        settings: {
          nom_salon: settings.salonName,
          site_web: settings.website,
          telephone: settings.phone,
          email: settings.email,
          description: settings.description,
        },
        openingHours: Object.entries(settings.openingHours).map(([jour, h]) => ({
          jour,
          heure_ouverture: h.open + ":00",
          heure_fermeture: h.close + ":00",
          ouvert: !h.closed ? 1 : 0,
        })),
        paymentMethods: Object.entries(settings.paymentMethods).map(([key, statut]) => ({
          nom: key,
          statut: statut ? 1 : 0,
        })),
        cancellationPolicy: {
          heures: settings.cancellationPolicy.freeHours,
          penalite: settings.cancellationPolicy.penaltyPercentage,
          description: settings.cancellationPolicy.description,
        },
      };

      console.log('informations de settings a sauvegarder', payload)
      await api.put("/api/settings", payload);
      showSuccess("Paramètres sauvegardés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

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

        {/* Général */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informations du Salon
              </CardTitle>
              <CardDescription>Informations générales de votre établissement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom du salon */}
                <div className="space-y-2">
                  <Label htmlFor="salonName">Nom du salon</Label>
                  <Input
                    id="salonName"
                    value={settings.salonName}
                    onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                  />
                </div>

                {/* Site web */}
                <div className="space-y-2 relative">
                  <Label htmlFor="website">Site web</Label>
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2 relative">
                <Label htmlFor="address">Adresse</Label>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="pl-10"
                />
              </div>

              {/* Description du salon */}
              <div className="space-y-2 relative">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={4}
                  className="pl-3 pt-2"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Téléphone */}
                <div className="space-y-2 relative">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 relative">
                  <Label htmlFor="email">Email</Label>
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>

          </Card>
        </TabsContent>

        {/* Horaires */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horaires d'Ouverture
              </CardTitle>
              <CardDescription>Définissez les horaires d'ouverture de votre salon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.openingHours).map(([jour, h]) => (
                <div key={jour} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="font-medium">{jour.charAt(0).toUpperCase() + jour.slice(1)}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!h.closed}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          openingHours: {
                            ...settings.openingHours,
                            [jour]: { ...h, closed: !checked },
                          },
                        })
                      }
                    />
                    <Label className="text-sm">Ouvert</Label>
                  </div>

                  {!h.closed && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={h.open}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            openingHours: {
                              ...settings.openingHours,
                              [jour]: { ...h, open: e.target.value },
                            },
                          })
                        }
                        className="w-32"
                      />
                      <span>à</span>
                      <Input
                        type="time"
                        value={h.close}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            openingHours: {
                              ...settings.openingHours,
                              [jour]: { ...h, close: e.target.value },
                            },
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  )}

                  {h.closed && <span className="text-gray-500 italic">Fermé</span>}
                </div>
              ))}
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
            <CardContent className="space-y-4">
              {Object.entries(settings.paymentMethods).map(([method, enabled]) => (
                <div key={method} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">{method.charAt(0).toUpperCase() + method.slice(1)}</Label>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, [method]: checked },
                      })
                    }
                  />
                </div>
              ))}
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
              {Object.entries(settings.notifications).map(([key, value]) => {
                if (key === "reminderHours") return null;
                return (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">{key}</Label>
                    </div>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [key]: checked },
                        })
                      }
                    />
                  </div>
                );
              })}

              <div className="space-y-2">
                <Label htmlFor="reminderHours">Délai de rappel (heures avant le RDV)</Label>
                <Select
                  value={settings.notifications.reminderHours.toString()}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reminderHours: parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 6, 12, 24, 48].map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h} heure{h > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeHours">Annulation gratuite (heures)</Label>
                  <Select
                    value={settings.cancellationPolicy.freeHours.toString()}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        cancellationPolicy: { ...settings.cancellationPolicy, freeHours: parseInt(value) },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 6, 12, 24, 48].map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h} heures
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penalty">Pénalité (%)</Label>
                  <Select
                    value={settings.cancellationPolicy.penaltyPercentage.toString()}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        cancellationPolicy: { ...settings.cancellationPolicy, penaltyPercentage: parseInt(value) },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 25, 50, 75, 100].map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyDescription">Description de la politique</Label>
                <Textarea
                  id="policyDescription"
                  value={settings.cancellationPolicy.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cancellationPolicy: { ...settings.cancellationPolicy, description: e.target.value },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  )
}
