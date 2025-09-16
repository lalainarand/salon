"use client"

import api from "@/lib/api";
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import AddClientDialog from "@/app/(admin-group)/admin/components/AddClientDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

type UserType = {
  id: number
  name: string
  email: string
  phone: string
  registrationDate: string
  lastVisit: string
  totalAppointments: number
  totalSpent: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchClients = async (page = 1) => {
    try {
      const { data } = await api.get(`/api/list/clients?page=${page}`)
      setUsers(data.data)
      setCurrentPage(data.current_page)
      setTotalPages(data.last_page)
    } catch (err) {
      console.error("Erreur lors de la récupération des clients:", err)
    }
  }

  useEffect(() => {
    fetchClients(currentPage)
  }, [currentPage])

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleSaveUser = async (userData: any) => {
    try {
      if (userData.id) {
        // Modification
        const { data } = await api.put(`/api/users/${userData.id}`, userData);
        console.log("Utilisateur modifié :", data.user);
        showSuccess(`Modification des informations de ${userData?.name} réussie`);
      } else {
        // Création
        const { data } = await api.post("/api/users", userData);
        console.log("Nouvel utilisateur :", data.user);
        showSuccess(`Création de compte pour ${userData?.name} réussie`);
      }

      // Rafraîchit la liste des clients
      fetchClients(currentPage);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    } finally {
      setIsDialogOpen(false);
    }
  };


  const handleDeleteUser = async () => {
    if (selectedUserId === null) return
    try {
      await api.delete(`/api/users/${selectedUserId}`)
      fetchClients(currentPage)
      showSuccess("Client supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression", error)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleClickDelete = (id: number) => {
    setSelectedUserId(id)
    setIsDeleteDialogOpen(true)
  }

  // Correction du filtre (null safe)
  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600 mt-1">Gérez votre base de données clients</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>{filteredUsers.length} client(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Dernière visite</TableHead>
                  <TableHead>RDV Total</TableHead>
                  <TableHead>Dépenses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium">{user.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{new Date(user.lastVisit).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-center">{user.totalAppointments}</TableCell>
                    <TableCell className="font-medium">{user.totalSpent}Ar</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleClickDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              disabled={currentPage === 1}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              disabled={currentPage === totalPages}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Ajout/Modification */}
      <AddClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedUser}
        onSubmit={handleSaveUser}
        mode={selectedUser ? "edit" : "add"}
      />

      {/* Dialog de suppression */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        title="Supprimer ce client ?"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer ce client ?"
        toastMessage="Client supprimé avec succès."
      />

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
