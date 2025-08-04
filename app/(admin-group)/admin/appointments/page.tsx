"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateAppointmentDialog } from "@/app/(admin-group)/admin/components/CreateAppointmentDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
import { RefreshCw } from "lucide-react"

type AppointmentType = {
  id: number
  client: string
  phone: string
  service: string
  employee: string
  date: string
  time: string
  duration: string
  price: string
  status: string
  notes?: string
}





const appointments = [
  {
    id: 1,
    client: "Marie Dubois",
    phone: "06 12 34 56 78",
    service: "Coupe + Brushing",
    employee: "Sophie Martin",
    date: "2024-01-15",
    time: "09:00",
    duration: "1h30",
    status: "confirmed",
    price: "65€",
    notes: "Première visite",
  },
  {
    id: 2,
    client: "Jean Martin",
    phone: "06 98 76 54 32",
    service: "Barbe + Moustache",
    employee: "Pierre Durand",
    date: "2024-01-15",
    time: "10:30",
    duration: "45min",
    status: "pending",
    price: "35€",
    notes: "",
  },
  {
    id: 3,
    client: "Anna Leroy",
    phone: "06 11 22 33 44",
    service: "Coloration complète",
    employee: "Marie Rousseau",
    date: "2024-01-15",
    time: "14:00",
    duration: "2h30",
    status: "completed",
    price: "120€",
    notes: "Couleur châtain clair",
  },
  {
    id: 4,
    client: "Paul Durand",
    phone: "06 55 66 77 88",
    service: "Coupe Homme",
    employee: "Sophie Martin",
    date: "2024-01-15",
    time: "16:00",
    duration: "30min",
    status: "cancelled",
    price: "25€",
    notes: "Annulé par le client",
  },
]

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    completed: "Terminé",
    cancelled: "Annulé",
    modified: "Modifié",
    rescheduled: "Reporté",
  }
  return labels[status] || "Inconnu"
}


const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmé", className: "bg-green-100 text-green-800" },
    completed: { label: "Terminé", className: "bg-blue-100 text-blue-800" },
    cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
    modified: { label: "Modifié", className: "bg-purple-100 text-purple-800" },
    rescheduled: { label: "Reporté", className: "bg-orange-100 text-orange-800" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  return <Badge className={config.className}>{config.label}</Badge>
}

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openConfirmStatusDialog, setOpenConfirmStatusDialog] = useState(false)
  const [selectedAppointmentForStatus, setSelectedAppointmentForStatus] = useState<AppointmentType | null>(null)
  const [nextStatus, setNextStatus] = useState<string>("")






  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getNextStatus = (current: string) => {
    const order = ["pending", "confirmed", "completed", "cancelled"]
    const index = order.indexOf(current)
    return order[(index + 1) % order.length] || "pending"
  }


  const handleDeleteClick = (id: number) => {
    setSelectedAppointmentId(id)
    setOpenDeleteDialog(true)
  }

  const handleStatusClick = (appointment: AppointmentType) => {
    setSelectedAppointmentForStatus(appointment)

    // Exemple logique simple : toggle entre "pending" et "confirmed"
    let newStatus = "confirmed"
    if (appointment.status === "confirmed") newStatus = "completed"
    if (appointment.status === "completed") newStatus = "cancelled"

    setNextStatus(newStatus)
    setOpenConfirmStatusDialog(true)
  }



  const handleConfirmStatusChange = async () => {
    if (!selectedAppointmentForStatus) return

    try {
      const newStatus = getNextStatus(selectedAppointmentForStatus.status)
      console.log(`Changer statut de ${selectedAppointmentForStatus.id} → ${newStatus}`)

      // 👉 Appelle ton API ici

      setOpenConfirmStatusDialog(false)
      setSelectedAppointmentForStatus(null)
      // Revalider la liste si besoin
    } catch (error) {
      console.error("Erreur lors du changement de statut", error)
    }
  }


  const handleConfirmDelete = async () => {
    if (selectedAppointmentId === null) return
    try {
      // 🔥 Appel API ici
      console.log("Supprimer rendez-vous avec ID:", selectedAppointmentId)

      // TODO: revalidation/mutation/refresh

      setOpenDeleteDialog(false)
      setSelectedAppointmentId(null)
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous", error)
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
          <p className="text-gray-600 mt-1">Gérez tous les rendez-vous de votre salon</p>
        </div>
        <CreateAppointmentDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par client ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Rendez-vous</CardTitle>
          <CardDescription>{filteredAppointments.length} rendez-vous trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.client}</p>
                        <p className="text-sm text-gray-500">{appointment.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.employee}</TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(appointment.date).toLocaleDateString("fr-FR")}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell className="font-medium">{appointment.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusClick(appointment)}
                        >
                          <RefreshCw className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(appointment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ConfirmDeleteDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
              onConfirm={handleConfirmDelete}
              title="Supprimer ce rendez-vous ?"
              description="Cette action est irréversible. Voulez-vous vraiment supprimer ce rendez-vous ?"
              toastMessage="Rendez-vous supprimé avec succès."
            />
            <ConfirmToggleDialog
              open={openConfirmStatusDialog}
              onOpenChange={setOpenConfirmStatusDialog}
              onConfirm={handleConfirmStatusChange}
              title="Changer le statut du rendez-vous"
              description={`Voulez-vous vraiment changer le statut vers "${getStatusLabel(nextStatus)}" ?`}
              confirmLabel="Oui, changer"
            />


          </div>
        </CardContent>
      </Card>
    </div>
  )
}
