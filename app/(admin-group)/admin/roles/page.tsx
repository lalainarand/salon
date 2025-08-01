"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Shield, Users, Key } from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    usersCount: 1,
    permissions: [
      "users.create",
      "users.read",
      "users.update",
      "users.delete",
      "appointments.create",
      "appointments.read",
      "appointments.update",
      "appointments.delete",
      "services.create",
      "services.read",
      "services.update",
      "services.delete",
      "employees.create",
      "employees.read",
      "employees.update",
      "employees.delete",
      "settings.read",
      "settings.update",
      "reports.read",
      "roles.manage",
    ],
    color: "#DC2626",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Gérant",
    description: "Gestion complète du salon sauf administration système",
    usersCount: 2,
    permissions: [
      "users.create",
      "users.read",
      "users.update",
      "appointments.create",
      "appointments.read",
      "appointments.update",
      "appointments.delete",
      "services.create",
      "services.read",
      "services.update",
      "services.delete",
      "employees.read",
      "employees.update",
      "settings.read",
      "settings.update",
      "reports.read",
    ],
    color: "#7C3AED",
    createdAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Employé",
    description: "Accès limité aux rendez-vous et clients",
    usersCount: 5,
    permissions: ["users.read", "appointments.read", "appointments.update", "services.read"],
    color: "#059669",
    createdAt: "2023-01-01",
  },
  {
    id: 4,
    name: "Réceptionniste",
    description: "Gestion des rendez-vous et accueil clients",
    usersCount: 2,
    permissions: [
      "users.create",
      "users.read",
      "users.update",
      "appointments.create",
      "appointments.read",
      "appointments.update",
      "services.read",
    ],
    color: "#0891B2",
    createdAt: "2023-02-15",
  },
]

const allPermissions = [
  {
    category: "Utilisateurs",
    permissions: [
      { key: "users.create", label: "Créer des clients" },
      { key: "users.read", label: "Voir les clients" },
      { key: "users.update", label: "Modifier les clients" },
      { key: "users.delete", label: "Supprimer les clients" },
    ],
  },
  {
    category: "Rendez-vous",
    permissions: [
      { key: "appointments.create", label: "Créer des RDV" },
      { key: "appointments.read", label: "Voir les RDV" },
      { key: "appointments.update", label: "Modifier les RDV" },
      { key: "appointments.delete", label: "Supprimer les RDV" },
    ],
  },
  {
    category: "Services",
    permissions: [
      { key: "services.create", label: "Créer des services" },
      { key: "services.read", label: "Voir les services" },
      { key: "services.update", label: "Modifier les services" },
      { key: "services.delete", label: "Supprimer les services" },
    ],
  },
  {
    category: "Employés",
    permissions: [
      { key: "employees.create", label: "Créer des employés" },
      { key: "employees.read", label: "Voir les employés" },
      { key: "employees.update", label: "Modifier les employés" },
      { key: "employees.delete", label: "Supprimer les employés" },
    ],
  },
  {
    category: "Paramètres",
    permissions: [
      { key: "settings.read", label: "Voir les paramètres" },
      { key: "settings.update", label: "Modifier les paramètres" },
    ],
  },
  {
    category: "Rapports",
    permissions: [{ key: "reports.read", label: "Voir les rapports" }],
  },
  {
    category: "Administration",
    permissions: [{ key: "roles.manage", label: "Gérer les rôles" }],
  },
]

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission])
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rôles & Permissions</h1>
          <p className="text-gray-600 mt-1">Gérez les rôles et permissions de votre équipe</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Rôle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau rôle</DialogTitle>
              <DialogDescription>Définissez un nouveau rôle avec ses permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Nom du rôle</Label>
                  <Input placeholder="Ex: Manager, Employé..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleColor">Couleur</Label>
                  <Input type="color" className="w-full h-10" defaultValue="#059669" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea placeholder="Description du rôle et de ses responsabilités..." />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Permissions</Label>
                {allPermissions.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700 border-b pb-1">{category.category}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {category.permissions.map((permission) => (
                        <div key={permission.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.key}
                            checked={selectedPermissions.includes(permission.key)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.key, checked as boolean)}
                          />
                          <Label htmlFor={permission.key} className="text-sm font-normal cursor-pointer">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">Créer le rôle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rôles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                <p className="text-2xl font-bold text-gray-900">{roles.reduce((acc, r) => acc + r.usersCount, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPermissions.reduce((acc, cat) => acc + cat.permissions.length, 0)}
                </p>
              </div>
              <Key className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rôle le plus utilisé</p>
                <p className="text-lg font-bold text-gray-900">
                  {roles.reduce((prev, current) => (prev.usersCount > current.usersCount ? prev : current)).name}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">#1</span>
              </div>
            </div>
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
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: role.color }}></div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <Badge variant="outline">{role.usersCount} utilisateur(s)</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Permissions ({role.permissions.length})
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 6).map((permission) => {
                      const permissionLabel =
                        allPermissions.flatMap((cat) => cat.permissions).find((p) => p.key === permission)?.label ||
                        permission
                      return (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permissionLabel}
                        </Badge>
                      )
                    })}
                    {role.permissions.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.permissions.length - 6} autres
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Créé le {new Date(role.createdAt).toLocaleDateString("fr-FR")}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vue Détaillée</CardTitle>
          <CardDescription>{filteredRoles.length} rôle(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.usersCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                    </TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
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
    </div>
  )
}
