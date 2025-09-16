"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export interface ServiceFormValues {
  id?: number
  nom: string
  categorie_id: number
  duree_minutes: number
  prix: number
  description: string
}

export interface ServiceType extends ServiceFormValues {
  statut: number
  popularity: number
  categorie?: {
    id: number
    nom: string
    couleur?: string
  }
}

export interface CategoryType {
  id: number
  nom: string
  couleur?: string
}

interface AddServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ServiceFormValues) => void
  categories: CategoryType[]
  mode?: "add" | "edit"
  initialData?: ServiceType | null
}


export const AddServiceDialog = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
  mode = "add",
  initialData,
}: AddServiceDialogProps) => {
  const [formData, setFormData] = useState<ServiceFormValues>({
    nom: "",
    categorie_id: 0,
    duree_minutes: 0,
    prix: 0,
    description: "",
  })

  // ✅ Préremplir en mode "edit"
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nom: initialData.nom || "",
        categorie_id: initialData.categorie_id || 0,
        duree_minutes: initialData.duree_minutes || 0,
        prix: Number(initialData.prix) || 0,
        description: initialData.description || "",
      })
    } else {
      setFormData({
        nom: "",
        categorie_id: 0,
        duree_minutes: 0,
        prix: 0,
        description: "",
      })
    }
  }, [initialData])

  const handleChange = (field: keyof ServiceFormValues, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && field !== "description" ? value.trimStart() : value,
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Modifier le service" : "Créer un nouveau service"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les détails du service sélectionné."
              : "Ajoutez un nouveau service à votre catalogue."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du service</Label>
            <Input
              id="nom"
              placeholder="Ex: Coupe + Brushing"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="categorie_id">Catégorie</Label>
            <Select
              value={formData.categorie_id ? String(formData.categorie_id) : ""}
              onValueChange={(value) => handleChange("categorie_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <Label htmlFor="duree_minutes">Durée (minutes)</Label>
            <Input
              id="duree_minutes"
              type="number"
              placeholder="60"
              value={formData.duree_minutes}
              onChange={(e) => handleChange("duree_minutes", Number(e.target.value))}
            />
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label htmlFor="prix">Prix (Ar)</Label>
            <Input
              id="prix"
              type="number"
              placeholder="45"
              value={formData.prix}
              onChange={(e) => handleChange("prix", Number(e.target.value))}
            />
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description détaillée du service..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Enregistrer les modifications" : "Créer le service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
