"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface CategoryType {
  id?: number
  name: string
  description: string
  color: string
}

interface AddEditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CategoryType) => void
  initialData?: CategoryType | null
}

export default function AddEditCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
}: AddEditCategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryType>({
    name: "",
    description: "",
    color: "#8B4513",
  })

  useEffect(() => {
    if (initialData) setFormData(initialData)
    else setFormData({ name: "", description: "", color: "#8B4513" })
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  const isEdit = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-sm fixed inset-0 z-40" />
        <DialogContent className="max-w-lg bg-white z-50">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modifiez les informations de la catégorie."
                : "Ajoutez une nouvelle catégorie pour organiser vos services."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Coiffure, Coloration..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de la catégorie..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <Input
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-16 h-10"
                />
                <span className="text-sm text-gray-600">Choisissez une couleur pour identifier la catégorie</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90" onClick={handleSubmit}>
              {isEdit ? "Enregistrer les modifications" : "Créer la catégorie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
