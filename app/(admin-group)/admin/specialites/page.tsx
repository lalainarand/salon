"use client";

import api from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import { can } from "@/lib/permissions";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog";
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog";
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification";

interface Specialite {
  id: number;
  nom: string;
  statut: number;
  created_at: string;
  updated_at: string;
}

// Modal d’ajout / édition
const SpecialiteModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialite?: Specialite | null;
  onSave: (specialite: Partial<Specialite>) => void;
}> = ({ open, onOpenChange, specialite, onSave }) => {
  const [formData, setFormData] = useState({ nom: "", statut: 1 });


  useEffect(() => {
    if (specialite) {
      setFormData({ nom: specialite.nom, statut: specialite.statut });
    } else {
      setFormData({ nom: "", statut: 1 });
    }
  }, [specialite, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast.error("Veuillez saisir le nom de la spécialité.");
      return;
    }
    onSave({ ...formData, id: specialite?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle style={{ color: "rgb(150,180,125)" }}>
            {specialite ? "Modifier la spécialité" : "Ajouter une spécialité"}
          </DialogTitle>
          <DialogDescription>
            {specialite
              ? "Modifiez les informations de cette spécialité."
              : "Créez une nouvelle spécialité."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom de la spécialité *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Brushing"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.statut === 1}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, statut: checked ? 1 : 0 })
                }
              />
              <Label htmlFor="status">
                Spécialité {formData.statut === 1 ? "active" : "inactive"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
              className="hover:opacity-90"
            >
              {specialite ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal
const SpecialitesPage: React.FC = () => {
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialite, setEditingSpecialite] = useState<Specialite | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingToggleSpecialite, setPendingToggleSpecialite] = useState<Specialite | null>(null);
  const [specialiteToDelete, setSpecialiteToDelete] = useState<Specialite | null>(null);
  const { notification, showSuccess, hideNotification } = useSuccessNotification();
  const { user } = useUser();


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Charger les spécialités
  const fetchSpecialites = async (page = 1) => {
    try {
      const { data } = await api.get("/api/specialite/indexpaginate", {
        params: { page, per_page: itemsPerPage },
      });
      setSpecialites(data.data || data);
      setTotalPages(data.last_page || 1);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      toast.error("Erreur lors de la récupération des spécialités");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSpecialites(currentPage);
  }, []);

  // Sauvegarde (ajout / modification)
  const handleSaveSpecialite = async (specialiteData: Partial<Specialite>) => {
    try {
      if (specialiteData.id) {
        await api.put(`/api/specialite/${specialiteData.id}`, specialiteData);
        showSuccess("Spécialité modifiée avec succès.");
      } else {
        await api.post(`/api/specialite`, specialiteData);
        showSuccess("Spécialité ajoutée avec succès.");
      }
      fetchSpecialites(currentPage);
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Changement de statut
  const confirmToggleStatus = async () => {
    if (pendingToggleSpecialite) {
      try {
        await api.put(`/api/specialite/change/${pendingToggleSpecialite.id}`, {
          ...pendingToggleSpecialite,
          statut: pendingToggleSpecialite.statut === 1 ? 0 : 1,
        });
        showSuccess("Statut changé avec succès.");
        fetchSpecialites(currentPage);
      } catch {
        toast.error("Erreur lors du changement de statut");
      }
    }
    setPendingToggleSpecialite(null);
    setIsConfirmDialogOpen(false);
  };

  // Suppression
  const handleDeleteSpecialite = async () => {
    if (specialiteToDelete) {
      try {
        await api.delete(`/api/specialite/${specialiteToDelete.id}`);
        showSuccess("Spécialité supprimée avec succès.");
        fetchSpecialites(currentPage);
      } catch {
        toast.error("Erreur lors de la suppression");
      }
      setSpecialiteToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "rgb(150,180,125)" }}>
            Gestion des Spécialités
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les spécialités - ajout, modification et suppression
          </p>
        </div>
        {can(user, "Créer Specialites") && (
          <Button
            onClick={() => {
              setEditingSpecialite(null);
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
            className="hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter Spécialité
          </Button>
        )}

      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "rgb(150,180,125)" }}>
            Liste des Spécialités ({specialites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialites.map((specialite) => (
                <TableRow key={specialite.id}>
                  <TableCell>{specialite.id}</TableCell>
                  <TableCell>{specialite.nom}</TableCell>
                  <TableCell>
                    <Switch
                      checked={specialite.statut === 1}
                      onCheckedChange={() => {
                        setPendingToggleSpecialite(specialite);
                        setIsConfirmDialogOpen(true);
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(specialite.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(specialite.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      {can(user, "Modifier Specialites") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingSpecialite(specialite);
                            setIsModalOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                        </Button>
                      )}

                      {can(user, "Supprimer Specialites") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSpecialiteToDelete(specialite);
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

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              disabled={currentPage === 1}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => fetchSpecialites(currentPage - 1)}
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
                onClick={() => fetchSpecialites(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              disabled={currentPage === totalPages}
              style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
              onClick={() => fetchSpecialites(currentPage + 1)}
            >
              →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs & Notifications */}
      <SpecialiteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        specialite={editingSpecialite}
        onSave={handleSaveSpecialite}
      />

      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmToggleStatus}
        title="Changer le statut de la spécialité"
        description="Voulez-vous vraiment changer le statut de cette spécialité ?"
        confirmLabel="Oui, changer"
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteSpecialite}
        title="Supprimer cette spécialité ?"
        description="Cette action est irréversible."
        toastMessage="Spécialité supprimée avec succès."
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  );
};

export default SpecialitesPage;
