"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, Scissors, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarComponent } from "./components/calendar-component"
import { StatsChart } from "./components/stats-chart"

const stats = [
  {
    title: "RDV Aujourd'hui",
    value: "12",
    change: "+2",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clients Total",
    value: "1,234",
    change: "+15",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "CA du Mois",
    value: "€12,450",
    change: "+8%",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Services Actifs",
    value: "24",
    change: "+3",
    icon: Scissors,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const recentAppointments = [
  {
    id: 1,
    client: "Marie Dubois",
    service: "Coupe + Brushing",
    time: "09:00",
    employee: "Sophie",
    status: "confirmed",
  },
  {
    id: 2,
    client: "Jean Martin",
    service: "Barbe",
    time: "10:30",
    employee: "Pierre",
    status: "pending",
  },
  {
    id: 3,
    client: "Anna Leroy",
    service: "Coloration",
    time: "14:00",
    employee: "Marie",
    status: "completed",
  },
  {
    id: 4,
    client: "Paul Durand",
    service: "Coupe Homme",
    time: "16:00",
    employee: "Sophie",
    status: "cancelled",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmé
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          En attente
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminé
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Annulé
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre salon de beauté</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              <SelectItem value="sophie">Sophie</SelectItem>
              <SelectItem value="marie">Marie</SelectItem>
              <SelectItem value="pierre">Pierre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-[rgb(135,169,107)] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[rgb(135,169,107)]" />
                Planning des Rendez-vous
              </CardTitle>
              <CardDescription>Gérez vos rendez-vous avec le calendrier interactif</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent />
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[rgb(135,169,107)]" />
                RDV Récents
              </CardTitle>
              <CardDescription>Derniers rendez-vous de la journée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{appointment.client}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                    <p className="text-xs text-gray-500">
                      {appointment.time} - {appointment.employee}
                    </p>
                  </div>
                  <div>{getStatusBadge(appointment.status)}</div>
                </div>
              ))}
              <Button className="w-full mt-4 bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
                Voir tous les RDV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
            <CardDescription>Revenus des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart type="revenue" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Services</CardTitle>
            <CardDescription>Services les plus demandés</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart type="services" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
