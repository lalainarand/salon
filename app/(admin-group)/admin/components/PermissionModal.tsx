"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Permission {
  id: number;
  nom: string;
  groupe: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const PermissionModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSave: (permission: Partial<Permission> & { id?: number }) => void;
}> = ({ open, onOpenChange, permission, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    groupe: "",
    description: "",
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        nom: permission.nom,
        groupe: permission.groupe,
        description: permission.description || "",
      });
    } else {
      setFormData({ nom: "", groupe: "", description: "" });
    }
  }, [permission, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom.trim() || !formData.groupe.trim()) {
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
            {/* Nom */}
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom de la permission *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Voir Tableau de Bord"
                required
              />
            </div>

            {/* Groupe */}
            <div className="grid gap-2">
              <Label htmlFor="groupe">Groupe *</Label>
              <Input
                id="groupe"
                value={formData.groupe}
                onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
                placeholder="Ex: Utilisateurs"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description de la permission..."
                rows={3}
              />
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

export default PermissionModal;
