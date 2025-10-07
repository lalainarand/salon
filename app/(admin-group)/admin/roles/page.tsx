"use client"

import api from "@/lib/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Shield, Users, Key, Plus, Search } from "lucide-react"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import AddRoleDialog from "@/app/(admin-group)/admin/components/AddRoleDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  // 🔥 Données dynamiques
  const [roles, setRoles] = useState<any[]>([])
  const [allPermissions, setAllPermissions] = useState<any[]>([])


  // 🔹 Récupérer les permissions regroupées
  const fetchPermissions = async () => {
    try {
      const { data } = await api.get(`/api/specialite/fetch`);
      if (data.success) {
        const formatted = Object.entries(data.data).map(([group, perms]: any) => ({
          groupe: group,
          permissions: perms.map((p: any) => ({
            key: p.id.toString(),
            label: p.nom,
            description: p.description,
          }))
        }))
        console.log('tous les permissions groupes', data)
        setAllPermissions(formatted)
      }
    } catch (error) {
      console.error("Erreur lors du fetch des permissions :", error);
    }
  };

  // 🔹 Récupérer les rôles
  const fetchRoles = async () => {
    try {
      const { data } = await api.get(`/api/role`);
      console.log('Données reçues roles:', data);
      setRoles(data)
    } catch (error) {
      console.error("Erreur lors du fetch des rôles:", error);
    }
  };

  useEffect(() => {
    fetchPermissions()
    fetchRoles()
  }, [])

  // 🔹 Créer ou modifier un rôle
  const handleCreateOrUpdateRole = async (roleData: any) => {
    try {
      if (roleData.id) {
        await api.put(`/api/role/${roleData.id}`, roleData)
        console.log('informations roles a modifier', roleData)

        showSuccess("Rôle modifié avec succès.")
      } else {
        await api.post(`/api/role`, roleData)
        console.log('informations roles a envoyer', roleData)
        showSuccess("Rôle créé avec succès.")
      }
      fetchRoles()
    } catch (error) {
      console.error("Erreur création/modification rôle:", error);
    }
  }

  // 🔹 Supprimer un rôle
  const handleConfirmDelete = async () => {
    if (!selectedRole) return
    try {
      await api.delete(`/api/role/${selectedRole.id}`)
      console.log('informations roles a supprimer', selectedRole.id)

      showSuccess("Rôle supprimé avec succès.")
      setOpenDeleteDialog(false)
      fetchRoles()
    } catch (error) {
      console.error("Erreur suppression rôle:", error);
    }
  }

  // 🔹 Filtrer par recherche
  const filteredRoles = roles.filter(
    (role) =>
      role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Rôles & Permissions</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rôle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm">Total Rôles</p>
            <p className="text-2xl font-bold">{roles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm">Permissions Total</p>
            <p className="text-2xl font-bold">
              {allPermissions.reduce((acc, cat) => acc + cat.permissions.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un rôle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: role.couleur }}></div>
                <CardTitle className="text-lg">{role.nom}</CardTitle>
                <Badge variant="outline">{'100'} utilisateur(s)</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Permissions :</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 6).map((perm: any) => (
                  <Badge key={perm.id} variant="secondary" className="text-xs">
                    {perm.nom}
                  </Badge>
                ))}
                {role.permissions.length > 6 && (
                  <Badge variant="secondary" className="text-xs">
                    +{role.permissions.length - 6} autres
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRole(role)
                    setIsCreateDialogOpen(true)
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedRole(role)
                    setOpenDeleteDialog(true)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ Dialogs et notifications */}
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce rôle ?"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer ce rôle et ses permissions associées ?"
        toastMessage="Rôle supprimé avec succès."
      />

      <AddRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) setSelectedRole(null)
        }}
        onSubmit={handleCreateOrUpdateRole}
        allPermissions={allPermissions}
        initialData={selectedRole}
        mode={selectedRole ? "edit" : "add"}
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  )
}
