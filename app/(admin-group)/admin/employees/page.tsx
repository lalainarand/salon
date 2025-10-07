"use client"

import api from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import { can } from "@/lib/permissions";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddEmployeeDialog from "@/app/(admin-group)/admin/components/EmployeeFormDialog";
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, UserCheck, Calendar, Star } from "lucide-react";
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog";

type Role = {
  id: number;
  nom: string;
  couleur?: string;
  description?: string;
};

type Specialty = {
  id: number;
  nom: string;
  created_at?: string;
  updated_at?: string;
};

type EmployeeType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role | null;
  specialties: Specialty[];
  hireDate: string;
  schedule: string;
  rating: number;
  appointmentsThisMonth: number;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { notification, showSuccess, hideNotification } = useSuccessNotification();
  const { user } = useUser();


  // Fetch roles
  const fetchRoles = async () => {
    try {
      const { data } = await api.get("/api/users/roles");
      setRoles(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des roles:", err);
    }
  };

  // Fetch specialties
  const fetchSpecialties = async () => {
    try {
      const { data } = await api.get("/api/specialite");
      setSpecialties(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des spécialités:", err);
    }
  };

  // Fetch employees
  const fetchEmployees = async (page = 1) => {
    try {
      const { data } = await api.get(`/api/employees/list?page=${page}`);
      setEmployees(data.data ?? []);
      setCurrentPage(data.currentPage ?? 1);
      setTotalPages(data.lastPage ?? 1);
    } catch (err) {
      console.error("Erreur lors de la récupération des employés:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchSpecialties();
    fetchEmployees();
  }, []);

  // Filtrage
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || emp.role?.id === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteEmployee = async () => {
    if (!selectedEmployeeId) return;

    try {
      const { data } = await api.delete(`/api/employes/${selectedEmployeeId}`);
      console.log('suppression employé', selectedEmployeeId, data);

      // Mettre à jour la liste locale
      setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployeeId));
      setSelectedEmployeeId(null);

      showSuccess("Employé supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'employé :", err);
      // Tu peux aussi afficher une notification d'erreur ici si tu as un composant pour ça
    }
  };


  const handleSaveEmployee = async (data: any) => {
    try {
      if (data.id) {
        // Edition d'un employé
        await api.post(`/api/employees/edit/${data.id}`, data);
        console.log('Modification de employé', data);
        showSuccess(`Modification des informations de ${data.name} succès`);
      } else {
        // Création d'un nouvel employé
        console.log('Création de employé', data);
        await api.post("/api/employees/store", data);
        showSuccess(`Création de compte pour ${data.name} succès`);
      }

      // Rafraîchir la liste après succès
      fetchEmployees(currentPage);

      // Fermer le dialogue
      setIsDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde de l'employé :", err);
      // Afficher éventuellement une notification d'erreur
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="text-gray-600 mt-1">Gérez votre équipe et leurs plannings</p>
        </div>
        {can(user, "Créer Employés") && (
          <Button
            onClick={() => {
              setSelectedEmployee(null);
              setIsDialogOpen(true);
            }}
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Employé
          </Button>
        )}

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

            <Select
              value={roleFilter.toString()}
              onValueChange={(value) =>
                setRoleFilter(value === "all" ? "all" : parseInt(value))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les postes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les postes</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.nom}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                        <p className="text-sm text-gray-500">{employee.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.role?.nom}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.specialties.slice(0, 2).map((s) => (
                            <Badge key={s.id} variant="secondary" className="text-xs">
                              {s.nom}
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {can(user, "Modifier Employés") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                            </Button>
                          )}

                          {can(user, "Supprimer Employés") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedEmployeeId(employee.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                disabled={currentPage === 1}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchEmployees(currentPage - 1)}
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
                  onClick={() => fetchEmployees(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchEmployees(currentPage + 1)}
              >
                →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
        roles={roles}
        specialties={specialties}
        mode={selectedEmployee ? "edit" : "add"}
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  );
}
