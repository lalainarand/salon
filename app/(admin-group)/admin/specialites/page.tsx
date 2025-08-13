"use client";

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

// Type pour les spécialités
interface Specialite {
  id: number;
  nom: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Données de test
const initialSpecialites: Specialite[] = [
  {
    id: 1,
    nom: "Cardiologie",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    nom: "Neurologie",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 3,
    nom: "Dermatologie",
    status: "inactive",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 4,
    nom: "Pédiatrie",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

// Modal pour ajout/modification
const SpecialiteModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialite?: Specialite | null;
  onSave: (specialite: Omit<Specialite, "id" | "createdAt" | "updatedAt"> & { id?: number }) => void;
}> = ({ open, onOpenChange, specialite, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (specialite) {
      setFormData({
        nom: specialite.nom,
        status: specialite.status,
      });
    } else {
      setFormData({
        nom: "",
        status: "active",
      });
    }
  }, [specialite, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      toast.error("Veuillez saisir le nom de la spécialité.");
      return;
    }

    const specialiteData = {
      ...formData,
      ...(specialite && { id: specialite.id }),
    };

    onSave(specialiteData);
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
              : "Créez une nouvelle spécialité médicale."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom de la spécialité *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Cardiologie"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status === "active"}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, status: checked ? "active" : "inactive" })
                }
              />
              <Label htmlFor="status">
                Spécialité {formData.status === "active" ? "active" : "inactive"}
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
  const [specialites, setSpecialites] = useState<Specialite[]>(initialSpecialites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialite, setEditingSpecialite] = useState<Specialite | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingToggleSpecialite, setPendingToggleSpecialite] = useState<Specialite | null>(null);
  const [specialiteToDelete, setSpecialiteToDelete] = useState<Specialite | null>(null);

  // Gestion de l'ajout/modification
  const handleSaveSpecialite = (specialiteData: Omit<Specialite, "id" | "createdAt" | "updatedAt"> & { id?: number }) => {
    const now = new Date().toISOString().split('T')[0];
    
    if (specialiteData.id) {
      // Modification
      setSpecialites(prev => prev.map(s => 
        s.id === specialiteData.id 
          ? { ...s, ...specialiteData, updatedAt: now }
          : s
      ));
      toast.success("Spécialité modifiée avec succès.");
    } else {
      // Ajout
      const newSpecialite: Specialite = {
        ...specialiteData,
        id: Math.max(...specialites.map(s => s.id)) + 1,
        createdAt: now,
        updatedAt: now,
      };
      setSpecialites(prev => [...prev, newSpecialite]);
      toast.success("Spécialité ajoutée avec succès.");
    }
    
    setEditingSpecialite(null);
  };

  // Gestion du changement de statut
  const handleToggleStatus = (specialite: Specialite) => {
    setPendingToggleSpecialite(specialite);
    setIsConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (pendingToggleSpecialite) {
      const newStatus = pendingToggleSpecialite.status === "active" ? "inactive" : "active";
      setSpecialites(prev => prev.map(s => 
        s.id === pendingToggleSpecialite.id 
          ? { ...s, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : s
      ));
      toast.success(`Statut de la spécialité "${pendingToggleSpecialite.nom}" changé avec succès.`);
    }
    setPendingToggleSpecialite(null);
    setIsConfirmDialogOpen(false);
  };

  // Gestion de la suppression
  const handleDeleteClick = (specialite: Specialite) => {
    setSpecialiteToDelete(specialite);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSpecialite = () => {
    if (specialiteToDelete) {
      setSpecialites(prev => prev.filter(s => s.id !== specialiteToDelete.id));
      setSpecialiteToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Ouvrir modal pour modification
  const handleEditClick = (specialite: Specialite) => {
    setEditingSpecialite(specialite);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour ajout
  const handleAddClick = () => {
    setEditingSpecialite(null);
    setIsModalOpen(true);
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
            Gérez les spécialités médicales - ajout, modification et suppression
          </p>
        </div>
        <Button 
          onClick={handleAddClick}
          style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
          className="hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Spécialité
        </Button>
      </div>

      {/* Tableau des spécialités */}
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
                  <TableCell className="font-medium">{specialite.id}</TableCell>
                  <TableCell className="font-medium">{specialite.nom}</TableCell>
                  <TableCell>
                    <Switch
                      key={specialite.id + specialite.status}
                      checked={specialite.status === "active"}
                      onCheckedChange={() => handleToggleStatus(specialite)}
                    />
                  </TableCell>
                  <TableCell>{specialite.createdAt}</TableCell>
                  <TableCell>{specialite.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(specialite)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(specialite)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {specialites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune spécialité trouvée.</p>
              <Button 
                onClick={handleAddClick}
                className="mt-4"
                style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
              >
                Ajouter la première spécialité
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal pour ajout/modification */}
      <SpecialiteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        specialite={editingSpecialite}
        onSave={handleSaveSpecialite}
      />

      {/* Dialog de confirmation pour changement de statut */}
      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmToggleStatus}
        title="Changer le statut de la spécialité"
        description={`Cette spécialité sera marquée comme ${
          pendingToggleSpecialite?.status === "active" ? "inactive" : "active"
        }. Voulez-vous continuer ?`}
        confirmLabel="Oui, changer le statut"
      />

      {/* Dialog de confirmation pour suppression */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteSpecialite}
        title="Supprimer cette spécialité ?"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cette spécialité ?"
        toastMessage="Spécialité supprimée avec succès."
      />
    </div>
  );
};

export default SpecialitesPage;