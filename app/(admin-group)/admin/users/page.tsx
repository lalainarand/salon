"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import AddClientDialog from "@/app/(admin-group)/admin/components/AddClientDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

const initialUsers = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de la Paix, Paris",
    registrationDate: "2023-06-15",
    lastVisit: "2024-01-10",
    totalAppointments: 12,
    totalSpent: "780€",
    status: "active",
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "06 98 76 54 32",
    address: "456 Avenue des Champs, Lyon",
    registrationDate: "2023-08-22",
    lastVisit: "2024-01-08",
    totalAppointments: 8,
    totalSpent: "320€",
    status: "active",
  },
  {
    id: 3,
    name: "Anna Leroy",
    email: "anna.leroy@email.com",
    phone: "06 11 22 33 44",
    address: "789 Boulevard Saint-Michel, Marseille",
    registrationDate: "2023-03-10",
    lastVisit: "2023-12-20",
    totalAppointments: 15,
    totalSpent: "1250€",
    status: "inactive",
  },
  {
    id: 4,
    name: "Paul Durand",
    email: "paul.durand@email.com",
    phone: "06 55 66 77 88",
    address: "321 Rue de Rivoli, Toulouse",
    registrationDate: "2023-11-05",
    lastVisit: "2024-01-12",
    totalAppointments: 5,
    totalSpent: "175€",
    status: "active",
  },
]

const getStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge className="bg-green-100 text-green-800">Actif</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
  )
}

type UserType = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  registrationDate: string
  lastVisit: string
  totalAppointments: number
  totalSpent: string
  status: string // au lieu de "active" | "inactive"
}


export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [userList, setUserList] = useState<UserType[]>(users)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [pendingToggleUser, setPendingToggleUser] = useState<UserType | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleToggleStatus = (user: UserType) => {
    setPendingToggleUser(user)
    setIsConfirmDialogOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!pendingToggleUser) return

    const newStatus = pendingToggleUser.status === "active" ? "inactive" : "active"

    // 🔁 Requête API ici si besoin
    setUserList((prev) =>
      prev.map((u) =>
        u.id === pendingToggleUser.id ? { ...u, status: newStatus } : u
      )
    )

    setPendingToggleUser(null)
  }


  const handleSaveUser = (userData: any) => {
    if (userData.id) {
      try {

        // Modification
        setUsers((prev) =>
          prev.map((u) => (u.id === userData.id ? { ...u, ...userData } : u))
        )
        showSuccess(`Modification des informations de ${userData?.name} succès`)
      } catch (error) {
        console.error("Erreur lors de la modification", error)
      }
    } else {
      try {

        // Ajout
        const newUser = {
          ...userData,
          id: Math.max(...users.map((u) => u.id)) + 1,
          registrationDate: new Date().toISOString().split("T")[0],
          lastVisit: new Date().toISOString().split("T")[0],
          totalAppointments: 0,
          totalSpent: "0€",
        }
        setUsers((prev) => [...prev, newUser])
        showSuccess(`Création de compte pour ${userData?.name} succès`)
      } catch (error) {
        console.error("Erreur lors de creation", error)
      }
    }
    setIsDialogOpen(false)
  }

  // ⛔ suppression logique
  const handleDeleteUser = async () => {
    if (selectedUserId === null) return
    // Suppression côté back (ex: axios.delete(`/api/users/${selectedUserId}`))
    setUserList((prev) => prev.filter((u) => u.id !== selectedUserId))
  }

  const handleClickDelete = (id: number) => {
    setSelectedUserId(id)
    setIsDeleteDialogOpen(true)
  }


  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA Total</p>
                <p className="text-2xl font-bold text-gray-900">2,525€</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">€</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{new Date(user.lastVisit).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-center">{user.totalAppointments}</TableCell>
                    <TableCell className="font-medium">{user.totalSpent}</TableCell>
                    <TableCell>
                      <Switch
                        key={user.id + user.status}
                        checked={user.status === "active"}
                        onCheckedChange={() => handleToggleStatus(user)}
                      />

                    </TableCell>
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

      {/* Dialog ststu */}
      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmToggleStatus}
        title="Changer le statut du client"
        description={`Ce client sera marqué comme ${pendingToggleUser?.status === "active" ? "inactif" : "actif"
          }. Voulez-vous continuer ?`}
        confirmLabel="Oui, changer le statut"
      />

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
