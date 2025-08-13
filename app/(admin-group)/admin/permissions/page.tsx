"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// Type pour les permissions
interface Permission {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
  module: string;
  createdAt: string;
  updatedAt: string;
}

// Données de test
const initialPermissions: Permission[] = [
  {
    id: 1,
    name: "Créer utilisateur",
    description: "Permission pour créer de nouveaux utilisateurs",
    status: "active",
    module: "Utilisateurs",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Modifier utilisateur",
    description: "Permission pour modifier les informations des utilisateurs",
    status: "active",
    module: "Utilisateurs",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 3,
    name: "Supprimer utilisateur",
    description: "Permission pour supprimer des utilisateurs",
    status: "inactive",
    module: "Utilisateurs",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

// Modal pour ajout/modification
const PermissionModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSave: (permission: Omit<Permission, "id" | "createdAt" | "updatedAt"> & { id?: number }) => void;
}> = ({ open, onOpenChange, permission, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    module: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        status: permission.status,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        module: "",
        status: "active",
      });
    }
  }, [permission, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.module.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const permissionData = {
      ...formData,
      ...(permission && { id: permission.id }),
    };

    onSave(permissionData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle style={{ color: "rgb(150,180,125)" }}>
            {permission ? "Modifier la permission" : "Ajouter une permission"}
          </DialogTitle>
          <DialogDescription>
            {permission 
              ? "Modifiez les informations de cette permission." 
              : "Créez une nouvelle permission pour le système."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la permission *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Créer utilisateur"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="module">Module *</Label>
              <Input
                id="module"
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                placeholder="Ex: Utilisateurs"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la permission..."
                rows={3}
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
                Permission {formData.status === "active" ? "active" : "inactive"}
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
              {permission ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal
const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingTogglePermission, setPendingTogglePermission] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  // Gestion de l'ajout/modification
  const handleSavePermission = (permissionData: Omit<Permission, "id" | "createdAt" | "updatedAt"> & { id?: number }) => {
    const now = new Date().toISOString().split('T')[0];
    
    if (permissionData.id) {
      // Modification
      setPermissions(prev => prev.map(p => 
        p.id === permissionData.id 
          ? { ...p, ...permissionData, updatedAt: now }
          : p
      ));
      toast.success("Permission modifiée avec succès.");
    } else {
      // Ajout
      const newPermission: Permission = {
        ...permissionData,
        id: Math.max(...permissions.map(p => p.id)) + 1,
        createdAt: now,
        updatedAt: now,
      };
      setPermissions(prev => [...prev, newPermission]);
      toast.success("Permission ajoutée avec succès.");
    }
    
    setEditingPermission(null);
  };

  // Gestion du changement de statut
  const handleToggleStatus = (permission: Permission) => {
    setPendingTogglePermission(permission);
    setIsConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (pendingTogglePermission) {
      const newStatus = pendingTogglePermission.status === "active" ? "inactive" : "active";
      setPermissions(prev => prev.map(p => 
        p.id === pendingTogglePermission.id 
          ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
      toast.success(`Statut de la permission "${pendingTogglePermission.name}" changé avec succès.`);
    }
    setPendingTogglePermission(null);
    setIsConfirmDialogOpen(false);
  };

  // Gestion de la suppression
  const handleDeleteClick = (permission: Permission) => {
    setPermissionToDelete(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePermission = () => {
    if (permissionToDelete) {
      setPermissions(prev => prev.filter(p => p.id !== permissionToDelete.id));
      setPermissionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Ouvrir modal pour modification
  const handleEditClick = (permission: Permission) => {
    setEditingPermission(permission);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour ajout
  const handleAddClick = () => {
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "rgb(150,180,125)" }}>
            Gestion des Permissions
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les permissions du système - ajout, modification et suppression
          </p>
        </div>
        <Button 
          onClick={handleAddClick}
          style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
          className="hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Permission
        </Button>
      </div>

      {/* Tableau des permissions */}
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
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.id}</TableCell>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.module}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {permission.description || "Aucune description"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      key={permission.id + permission.status}
                      checked={permission.status === "active"}
                      onCheckedChange={() => handleToggleStatus(permission)}
                    />
                  </TableCell>
                  <TableCell>{permission.createdAt}</TableCell>
                  <TableCell>{permission.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(permission)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(permission)}
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

          {permissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune permission trouvée.</p>
              <Button 
                onClick={handleAddClick}
                className="mt-4"
                style={{ backgroundColor: "rgb(150,180,125)", color: "white" }}
              >
                Ajouter la première permission
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal pour ajout/modification */}
      <PermissionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        permission={editingPermission}
        onSave={handleSavePermission}
      />

      {/* Dialog de confirmation pour changement de statut */}
      <ConfirmToggleDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmToggleStatus}
        title="Changer le statut de la permission"
        description={`Cette permission sera marquée comme ${
          pendingTogglePermission?.status === "active" ? "inactive" : "active"
        }. Voulez-vous continuer ?`}
        confirmLabel="Oui, changer le statut"
      />

      {/* Dialog de confirmation pour suppression */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeletePermission}
        title="Supprimer cette permission ?"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cette permission ?"
        toastMessage="Permission supprimée avec succès."
      />
    </div>
  );
};

export default PermissionsPage;