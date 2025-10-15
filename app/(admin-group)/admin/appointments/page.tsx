"use client"

import api from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import { can } from "@/lib/permissions";
import { useState, useEffect } from "react"
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


const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    en_attente: "En attente",
    confirmé: "Confirmé",
    terminé: "Terminé",
    annulé: "Annulé",
    // modified: "Modifié",
    // rescheduled: "Reporté",
  }
  return labels[status] || "Inconnu"
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    en_attente: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
    confirmé: { label: "Confirmé", className: "bg-green-100 text-green-800" },
    terminé: { label: "Terminé", className: "bg-blue-100 text-blue-800" },
    annulé: { label: "Annulé", className: "bg-red-100 text-red-800" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente
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
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployes] = useState<Employees[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [nextStatus, setNextStatus] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentFormType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useUser();

  const perPage = 10; // rendez-vous par page

  // Récupération des services
  const fetchServices = async () => {
    try {
      const { data } = await api.get("/api/fusion/serviceforfaits");
      setServices(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des services:", err);
    }
  };

  // Récupération des employés
  const fetchEmployes = async () => {
    try {
      const { data } = await api.get("/api/employes");
      console.log('liste des employes', data);
      setEmployes(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des employés:", err);
    }
  };

  // Récupération des clients
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/clients");
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des clients:", err);
    }
  };

  // Récupération des rendez-vous avec pagination
  const fetchAppointments = async (page: number = 1) => {
    try {
      const { data } = await api.get("/api/appointments", {
        params: { page, perPage },
      });

      console.log('liste des rdv', data)

      // Mapping pour correspondre à AppointmentFormType
      const mappedAppointments: AppointmentFormType[] = data.data.map((a: any) => ({
        id: a.id,
        user: a.client
          ? {
            id: a.client.id,
            name: a.client.name,
            phone: a.client.phone,
            email: a.client.email,
            status: "active",
            createdAt: a.client.created_at,
          }
          : null,
        service: a.service
          ? {
            id: a.service.id,
            nom: a.service.nom,
            description: a.service.description,
            prix: Number(a.service.prix),
            duration: `${a.service.duree_minutes} min`,
            categoryId: a.service.categorie_id,
            status: "active",
          }
          : null,
        employee: a.employe
          ? {
            id: a.employe.id,
            name: a.employe?.user?.name,
            phone: a.employe?.user?.phone,
            email: a.employe?.user?.email,
            poste: a.employe.poste ?? "",
            status: "active",
            createdAt: a.employe.created_at,
          }
          : null,
        date: a.date,
        time: a.heure,
        duration: a.service ? `${a.service.duree_minutes} min` : "60 min",
        status: a.status,
        notes: a.notes || "",
      }));

      setAppointments(mappedAppointments);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
    } catch (err) {
      console.error("Erreur lors de la récupération des rendez-vous:", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchEmployes();
    fetchUsers();
    fetchAppointments(1);
  }, []);



  const handleSaveAppointment = async (data: AppointmentFormType) => {
    try {
      // Préparer uniquement les champs nécessaires pour l'API
      const filteredData = {
        service_id: data.service?.id,
        client_id: data.user?.id,
        employe_id: data.employee?.employe?.id ?? null,
        date: data.date,
        heure: data.time,
        status: data.status ?? 'en_attente',
        notes: data.notes || "",
        mode_paiement: 'especes', // ou data.mode_paiement
      };

      console.log('data', data);
      console.log('filterdata', filteredData);

      if (selectedAppointment) {
        // Mise à jour d'un rendez-vous existant
        await api.put(`/api/appointments/${data.id}`, filteredData);
        showSuccess(`Rendez-vous de ${data.user?.name} modifié avec succès`);
      } else {
        // Création d'un nouveau rendez-vous
        await api.post("/api/appointments", filteredData);
        showSuccess(`Nouveau rendez-vous créé pour ${data.user?.name}`);
      }

      // Réinitialiser la sélection et fermer la modal
      setSelectedAppointment(null);
      setIsDialogOpen(false);

      // Rafraîchir la liste des rendez-vous en conservant la page actuelle
      await fetchAppointments(currentPage);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      // Ici tu peux afficher une notification d'erreur si tu veux
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service?.nom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })


  const getNextStatus = (current: string) => {
    const order = ["en_attente", "confirmé", "terminé", "annulé"]
    const index = order.indexOf(current)
    return order[(index + 1) % order.length] || "en_attente"
  }


  const handleDeleteClick = (id: number) => {
    setSelectedAppointmentId(id)
    setOpenDeleteDialog(true)
  }

  const handleStatusClick = (appointment: AppointmentFormType) => {
    setSelectedAppointmentForStatus(appointment)

    // Exemple logique simple : toggle entre "pending" et "confirmed"
    let newStatus = "confirmé"
    if (appointment.status === "confirmé") newStatus = "terminé"
    if (appointment.status === "en_attente") newStatus = "confirmé"

    setNextStatus(newStatus)
    setOpenConfirmStatusDialog(true)
  }


  const handleConfirmStatusChange = async () => {
    if (!selectedAppointmentForStatus) return

    try {
      const newStatus = getNextStatus(selectedAppointmentForStatus.status)
      console.log(`Changer statut de ${selectedAppointmentForStatus.id} → ${newStatus}`)

      const { data } = await api.post(`/api/events/status/${selectedAppointmentForStatus.id}/${newStatus}`)

      showSuccess(` Statut de rendez-vous changé en → ${newStatus} success`)

      setOpenConfirmStatusDialog(false)
      setSelectedAppointmentForStatus(null)

      // Rafraîchit la liste
      await fetchAppointments(currentPage)
    } catch (error) {
      console.error("Erreur lors du changement de statut", error)
    }
  }


  const handleConfirmDelete = async () => {
    if (selectedAppointmentId === null) return;

    try {
      console.log("Supprimer rendez-vous avec ID:", selectedAppointmentId);

      const { data } = await api.delete(`/api/appointments/${selectedAppointmentId}`);

      // On récupère le message du backend si dispo
      showSuccess(data?.message || "Rendez-vous supprimé avec succès");

      // Rafraîchit la liste
      await fetchAppointments(currentPage);

      // Ferme le dialog + reset l'état
      setOpenDeleteDialog(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous", error);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
          <p className="text-gray-600 mt-1">Gérez tous les rendez-vous de votre salon</p>
        </div>
        {can(user, "Créer Rendez-vous") && (
          <Button
            onClick={() => {
              setSelectedAppointment(null);
              setIsDialogOpen(true);
            }}
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        )}


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
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="confirmé">Confirmé</SelectItem>
                <SelectItem value="terminé">Terminé</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
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
                    <TableCell>{appointment.service?.nom}</TableCell>
                    <TableCell>{appointment.employee?.name}</TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(appointment.date).toLocaleDateString("fr-FR")}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell className="font-medium">
                      {appointment.service?.prix}Ar
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
                        {can(user, "Modifier Rendez-vous") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                          </Button>
                        )}

                        {can(user, "Supprimer Rendez-vous") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(appointment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                disabled={currentPage === 1}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchAppointments(currentPage - 1)}
              >
                ←
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  style={{
                    backgroundColor: page === currentPage ? "rgb(155,183,131)" : "white",
                    color: page === currentPage ? "white" : "black",
                    border: "1px solid rgb(155,183,131)",
                  }}
                  onClick={() => fetchAppointments(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                disabled={currentPage === totalPages}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchAppointments(currentPage + 1)}
              >
                →
              </Button>
            </div>


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
