"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddAppointmentDialog from "@/app/(admin-group)/admin/components/AddAppointmentDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import type { AppointmentFormType, User, Employees, Service } from "@/app/(admin-group)/admin/Types/appointment"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
import { RefreshCw } from "lucide-react"


const users = [
  { id: 1, name: "Marie Dubois", phone: 1234567890 },
  { id: 2, name: "Jean Martin", phone: 9876543210 },
  { id: 3, name: "Anna Leroy", phone: 1122334455 },
  { id: 4, name: "Paul Durand", phone: 1122334455 },
]



const services = [
  { id: 1, name: "Coupe + Brushing", price: 100 },
  { id: 2, name: "Barbe + Moustache", price: 900 },
  { id: 3, name: "Coloration complète", price: 100 },
  { id: 4, name: "Coupe Homme", price: 1400 },
]

const employees: Employees[] = [
  {
    id: 1,
    name: "Sophie Martin",
    phone: 1234567890,
    email: "sophie@example.com",
    status: "active",
    createdAt: "2024-01-01",
    poste: "Coiffeuse",
  },
  {
    id: 2,
    name: "Pierre Durand",
    phone: 9876543210,
    email: "pierre@example.com",
    status: "active",
    createdAt: "2024-01-02",
    poste: "Barbier",
  },
  {
    id: 3,
    name: "Marie Rousseau",
    phone: 1122334455,
    email: "marie@example.com",
    status: "active",
    createdAt: "2024-01-03",
    poste: "Coloriste",
  },
]


const appointments: AppointmentFormType[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Marie Dubois",
      phone: 1122334455,
      email: "marie@example.com",
      status: "active",
      createdAt: "2024-01-01",
    },
    service: {
      id: 1,
      name: "Coupe + Brushing",
      description: "",
      price: 65,
      duration: "1h30",
      categoryId: 1,
      status: "active",
    },
    employee: {
      id: 1,
      name: "Sophie Martin",
      phone: 1234567890,
      email: "sophie@example.com",
      status: "active",
      createdAt: "2024-01-01",
      poste: "Coiffeuse",
    },
    date: "2024-01-15",
    time: "09:00",
    duration: "1h30",
    status: "confirmed",
    notes: "Première visite",
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Jean Martin",
      phone: 1122334455,
      email: "jean@example.com",
      status: "active",
      createdAt: "2024-01-02",
    },
    service: {
      id: 2,
      name: "Barbe + Moustache",
      description: "",
      price: 35,
      duration: "45min",
      categoryId: 2,
      status: "active",
    },
    employee: {
      id: 2,
      name: "Pierre Durand",
      phone: 1234567890,
      email: "sophie@example.com",
      status: "active",
      createdAt: "2024-01-01",
      poste: "Coiffeuse",
    }
    ,
    date: "2024-01-15",
    time: "10:30",
    duration: "45min",
    status: "pending",
    notes: "",
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Anna Leroy",
      phone: 1122334455,
      email: "anna@example.com",
      status: "active",
      createdAt: "2024-01-03",
    },
    service: {
      id: 3,
      name: "Coloration complète",
      description: "",
      price: 120,
      duration: "2h30",
      categoryId: 3,
      status: "active",
    },
    employee: {
      id: 3,
      name: "Marie Rousseau",
      phone: 1234567890,
      email: "sophie@example.com",
      status: "active",
      createdAt: "2024-01-01",
      poste: "Coiffeuse",
    },
    date: "2024-01-15",
    time: "14:00",
    duration: "2h30",
    status: "completed",
    notes: "Couleur châtain clair",
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Paul Durand",
      phone: 1122334455,
      email: "paul@example.com",
      status: "active",
      createdAt: "2024-01-04",
    },
    service: {
      id: 4,
      name: "Coupe Homme",
      description: "",
      price: 25,
      duration: "30min",
      categoryId: 4,
      status: "active",
    },
    employee: {
      id: 4,
      name: "Sophie Martin",
      phone: 1234567890,
      email: "sophie@example.com",
      status: "active",
      createdAt: "2024-01-01",
      poste: "Coiffeuse",
    },
    date: "2024-01-15",
    time: "16:00",
    duration: "30min",
    status: "cancelled",
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
  const [selectedAppointmentForStatus, setSelectedAppointmentForStatus] = useState<AppointmentFormType | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentFormType | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()


  const [nextStatus, setNextStatus] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)



  const handleSaveAppointment = async (data: AppointmentFormType) => {
    try {
      if (selectedAppointment) {
        console.log("Mise à jour du rendez-vous :", data)
        // 🔁 appel API pour modifier
        // await updateAppointmentAPI(data)

        // Afficher la notification de succès
        showSuccess(`Rendez-vous de ${data.user?.name} modifié avec succès`)

      } else {
        console.log("Création d'un nouveau rendez-vous :", data)
        // 🔁 appel API pour ajouter
        // await createAppointmentAPI(data)

        // Afficher la notification de succès
        showSuccess(`Nouveau rendez-vous créé pour ${data.user?.name}`)
      }

      setSelectedAppointment(null)

    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error)
      // Ici vous pourriez aussi créer une notification d'erreur
    }
  }





  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter

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



  const handleStatusClick = (appointment: AppointmentFormType) => {
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
        <Button
          onClick={() => {
            setSelectedAppointment(null) // important pour vider le formulaire
            setIsDialogOpen(true)
          }}
          className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rendez-vous
        </Button>

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
                        <p className="font-medium">{appointment.user?.name}</p>
                        <p className="text-sm text-gray-500">{appointment.user?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.service?.name}</TableCell>
                    <TableCell>{appointment.employee?.name}</TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(appointment.date).toLocaleDateString("fr-FR")}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell className="font-medium">
                      {appointment.service?.price}€
                    </TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setIsDialogOpen(true)
                          }}
                        >
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
            <AddAppointmentDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              initialData={selectedAppointment}
              onSubmit={handleSaveAppointment}
              mode={selectedAppointment ? "edit" : "add"}
              services={services}
              users={users}
              employees={employees}
            />
            <div>

              {/* Composant de notification */}
              <SuccessNotification
                show={notification.show}
                message={notification.message}
                onClose={hideNotification}
                duration={4000} // 4 secondes
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
