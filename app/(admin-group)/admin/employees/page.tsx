"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddEmployeeDialog from "@/app/(admin-group)/admin/components/EmployeeFormDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, UserCheck, Calendar, Star } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"


type EmployeeType = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  specialties: string[]
  hireDate: string
  schedule: string
  rating: number
  appointmentsThisMonth: number
  status: "active" | "inactive"
}


const employees = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie.martin@salon.com",
    phone: "06 12 34 56 78",
    role: "Coiffeuse Senior",
    specialties: ["Coupe", "Brushing", "Coloration"],
    hireDate: "2022-03-15",
    schedule: "Temps plein",
    rating: 4.8,
    appointmentsThisMonth: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Marie Rousseau",
    email: "marie.rousseau@salon.com",
    phone: "06 98 76 54 32",
    role: "Coloriste",
    specialties: ["Coloration", "Mèches", "Balayage"],
    hireDate: "2021-09-10",
    schedule: "Temps plein",
    rating: 4.9,
    appointmentsThisMonth: 38,
    status: "active",
  },
  {
    id: 3,
    name: "Pierre Durand",
    email: "pierre.durand@salon.com",
    phone: "06 11 22 33 44",
    role: "Barbier",
    specialties: ["Barbe", "Coupe Homme", "Rasage"],
    hireDate: "2023-01-20",
    schedule: "Temps partiel",
    rating: 4.7,
    appointmentsThisMonth: 28,
    status: "active",
  },
  {
    id: 4,
    name: "Julie Moreau",
    email: "julie.moreau@salon.com",
    phone: "06 55 66 77 88",
    role: "Esthéticienne",
    specialties: ["Soins visage", "Épilation", "Maquillage"],
    hireDate: "2022-11-05",
    schedule: "Temps plein",
    rating: 4.6,
    appointmentsThisMonth: 32,
    status: "inactive",
  },
]

const roles = ["Coiffeuse Senior", "Coiffeur Junior", "Coloriste", "Barbier", "Esthéticienne", "Réceptionniste"]
const specialties = ["Coupe", "Brushing", "Coloration", "Mèches", "Balayage", "Barbe", "Rasage", "Soins", "Maquillage"]


export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)


  const [employeeList, setEmployeeList] = useState<EmployeeType[]>(
    employees.map((e) => ({
      ...e,
      status: e.status === "active" ? "active" : "inactive",
    }))
  )

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [pendingToggleEmployee, setPendingToggleEmployee] = useState<EmployeeType | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredEmployees = employeeList.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || employee.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleClickDelete = (id: number) => {
    setSelectedEmployeeId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEmployee = (data: any) => {
    if (data.id) {
      // c'est une modification
      setEmployeeList((prev) =>
        prev.map((emp) => (emp.id === data.id ? { ...emp, ...data } : emp))
      )
      showSuccess(`Modification des informations de ${data?.name} succès`)
    } else {
      // c'est un ajout
      setEmployeeList((prev) => [
        ...prev,
        { ...data, id: Date.now(), status: "active" },
      ])
      showSuccess(`Création de compte pour ${data?.name} succès`)

    }

    setIsDialogOpen(false)
    setSelectedEmployee(null)
  }

  const handleDeleteEmployee = async () => {
    if (selectedEmployeeId === null) return

    // 🔁 Appel API si besoin

    setEmployeeList((prev) => prev.filter((e) => e.id !== selectedEmployeeId))
    setSelectedEmployeeId(null)
    showSuccess(`Suppression succès`)
  }

  const handleToggleStatus = (employee: EmployeeType) => {
    setPendingToggleEmployee(employee)
    setIsConfirmDialogOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!pendingToggleEmployee) return

    const newStatus = pendingToggleEmployee.status === "active" ? "inactive" : "active"

    // 🔁 Requête API ici si nécessaire
    setEmployeeList((prev) =>
      prev.map((e) =>
        e.id === pendingToggleEmployee.id ? { ...e, status: newStatus } : e
      )
    )

    setPendingToggleEmployee(null)
    setIsConfirmDialogOpen(false)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="text-gray-600 mt-1">Gérez votre équipe et leurs plannings</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null)
            setIsDialogOpen(true)
          }}
          className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Employé
        </Button>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employés</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((e) => e.status === "active").length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">RDV ce mois</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.reduce((acc, e) => acc + e.appointmentsThisMonth, 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(employees.reduce((acc, e) => acc + e.rating, 0) / employees.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les postes</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Employés</CardTitle>
          <CardDescription>{filteredEmployees.length} employé(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Spécialités</TableHead>
                  <TableHead>Embauche</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>RDV/Mois</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                        <p className="text-sm text-gray-500">{employee.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.specialties.slice(0, 2).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {employee.specialties.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{employee.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(employee.hireDate).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{employee.schedule}</TableCell>
                    <TableCell className="text-center">{employee.appointmentsThisMonth}</TableCell>

                    {/* 🔁 Toggle avec confirmation */}
                    <TableCell>
                      <Switch
                        key={employee.id + employee.status}
                        checked={employee.status === "active"}
                        onCheckedChange={() => handleToggleStatus(employee)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEmployee(employee)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>


                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleClickDelete(employee.id)}
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
      {/* ✅ Boîte de dialogue de confirmation */}
      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmToggleStatus}
        title="Changer le statut de l’employé"
        description={`Cet employé sera marqué comme ${pendingToggleEmployee?.status === "active" ? "inactif" : "actif"
          }. Voulez-vous continuer ?`}
        confirmLabel="Oui, changer le statut"
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteEmployee}
        title="Supprimer cet employé ?"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cet employé ?"
        toastMessage="Employé supprimé avec succès."
      />

      <AddEmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedEmployee}
        onSubmit={handleSaveEmployee}
        roles={["Coiffeuse", "Esthéticienne", "Manager"]}
        specialties={["Coloration", "Massage", "Onglerie"]}
        mode={selectedEmployee ? "edit" : "add"}
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
