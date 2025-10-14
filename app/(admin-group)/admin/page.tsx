"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, Scissors, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsChart } from "./components/stats-chart"
import { ServicesChart } from "./components/ServicesChart"
import { CalendarComponent } from "./components/calendar-component"
import api from "@/lib/api"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Stat {
  title: string
  value: string | number
  change: string
  icon: any
  color: string
  bgColor: string
}

interface Rdv {
  id: number
  client: any
  service: any
  forfait: any
  date: string,
  heure: string
  employee?: string
  status: string
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("day")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [statsData, setStatsData] = useState<Stat[]>([])
  const [recentRdv, setRecentRdv] = useState<Rdv[]>([])
  const [caChart, setCaChart] = useState<any[]>([])
  const [serviceChart, setServiceChart] = useState<any[]>([])

  const fetchDashboardStats = async (filter: string, date?: Date) => {
    try {
      const params: any = { filter }
      if (date) {
        params.date = date.toISOString()
      }
      const { data } = await api.get("/api/dashboard/stats", { params })
      console.log("Données du dashboard:", data)

      setStatsData([
        {
          title: "RDV",
          value: data.stats.rdv_today,
          change: "+0",
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Clients Total",
          value: data.stats.clients_total,
          change: "+0",
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "CA",
          value: `${data.stats.ca}Ar`,
          change: "+0%",
          icon: DollarSign,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Services Actifs",
          value: data.stats.services_actifs,
          change: "+0",
          icon: Scissors,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ])

      setRecentRdv(data.recent_rdv)
      setCaChart(data.ca_chart)
      setServiceChart(data.service_chart)
    } catch (err) {
      console.error("Erreur récupération dashboard:", err)
    }
  }

  useEffect(() => {
    fetchDashboardStats(selectedPeriod, selectedDate)
  }, [selectedPeriod, selectedDate])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmé":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case "terminé":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>
      case "annulé":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre salon de beauté</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Journalier</SelectItem>
              <SelectItem value="month">Mensuel</SelectItem>
              <SelectItem value="year">Annuel</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) setSelectedDate(date)
            }}
            dateFormat={
              selectedPeriod === "month"
                ? "MM/yyyy"
                : selectedPeriod === "year"
                  ? "yyyy"
                  : "dd/MM/yyyy"
            }
            showMonthYearPicker={selectedPeriod === "month"}
            showYearPicker={selectedPeriod === "year"}
            className="border rounded px-2 py-1 text-sm"
          />

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
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
              <CardDescription>Derniers rendez-vous</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRdv.map((rdv) => (
                <div key={rdv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{rdv.client.name}</p>
                    <p className="text-sm text-gray-600">
                      {rdv.service ? rdv.service.nom : rdv.forfait ? rdv.forfait.nom : "—"}
                    </p>
                    <p className="text-xs text-gray-500">{rdv.date} / {rdv.heure} {rdv.employee || ""}</p>
                  </div>
                  <div>{getStatusBadge(rdv.status)}</div>
                </div>
              ))}
              <Link href="admin/appointments">
                <Button className="w-full mt-4 bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
                  Voir tous les RDV
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
            <CardDescription>Revenus selon le filtre sélectionné</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart type="revenue" data={caChart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Services</CardTitle>
            <CardDescription>Services les plus demandés</CardDescription>
          </CardHeader>
          <CardContent>
            <ServicesChart data={serviceChart} />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
