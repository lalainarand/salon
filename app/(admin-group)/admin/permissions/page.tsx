"use client";

import api from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import { can } from "@/lib/permissions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog";
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog";
import PermissionModal from "@/app/(admin-group)/admin/components/PermissionModal";
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"


// Type API
interface Permission {
  id: number;
  nom: string;
  groupe: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const { notification, showSuccess, hideNotification } = useSuccessNotification()
  const { user } = useUser();


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Récupérer les permissions avec pagination
  const fetchPermissions = async (page = 1) => {
    try {
      const { data } = await api.get(`/api/permission?page=${page}`);
      console.log('Données reçues permission:', data);
      setPermissions(data.data.data);
      setCurrentPage(data.data.current_page);
      setTotalPages(data.data.last_page);
    } catch (error) {
      console.error("Erreur lors du fetch des permissions :", error);
      toast.error("Impossible de charger les permissions.");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Ajouter / Modifier
  const handleSavePermission = async (permissionData: Partial<Permission> & { id?: number }) => {
    try {
      if (permissionData.id) {
        // Update
        await api.put(`/api/permission/${permissionData.id}`, permissionData);
        showSuccess(`Permission modifié avec succès`);
      } else {
        // Create
        await api.post(`/api/permission`, permissionData);
        showSuccess(`Permission ajouté avec succès`);
      }
      fetchPermissions(currentPage);
    } catch (error) {
      console.error("Erreur sauvegarde permission:", error);
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  // Supprimer
  const handleDeletePermission = async () => {
    if (!permissionToDelete) return;
    try {
      await api.delete(`/api/permission/${permissionToDelete.id}`);
      fetchPermissions(currentPage);
    } catch (error) {
    } finally {
      setPermissionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "rgb(150,180,125)" }}>
            Gestion des Permissions
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les permissions du système - ajout, modification et suppression
          </p>
        </div>
        {can(user, "Créer Permissions") && (
          <Button
            onClick={() => {
              setEditingPermission(null);
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Permission
          </Button>
        )}

      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "rgb(150,180,125)" }}>
            Liste des Permissions ({permissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Groupe</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell>{permission.nom}</TableCell>
                  <TableCell>{permission.groupe}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {permission.description || "—"}
                  </TableCell>
                  <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(permission.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      {can(user, "Modifier Permissions") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingPermission(permission);
                            setIsModalOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                        </Button>
                      )}

                      {can(user, "Supprimer Permissions") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPermissionToDelete(permission);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          {permissions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>Aucune permission trouvée.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              disabled={currentPage === 1}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => fetchPermissions(currentPage - 1)}
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
                onClick={() => fetchPermissions(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              disabled={currentPage === totalPages}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => fetchPermissions(currentPage + 1)}
            >
              →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal ajout / modif */}
      <PermissionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        permission={editingPermission}
        onSave={handleSavePermission}
      />

      {/* Suppression */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeletePermission}
        title="Supprimer cette permission ?"
        description="Cette action est irréversible."
        toastMessage="Permission supprimée avec succès."
      />

      {/* (tu peux réactiver ConfirmToggleDialog si tu ajoutes un champ `status`) */}
      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={() => { }}
        title="Changer le statut"
        description="Bientôt disponible"
        confirmLabel="Confirmer"
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000} // 4 secondes
      />
    </div>
  );
};

export default PermissionsPage;
