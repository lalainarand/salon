"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    category: string
    duration: number
    price: number
    description: string
  }) => void
  categories: string[]
}

export default function AddServiceDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: AddServiceDialogProps) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    duration: 0,
    price: 0,
    description: "",
  })

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(form)
    onOpenChange(false)
    setForm({
      name: "",
      category: "",
      duration: 0,
      price: 0,
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau service</DialogTitle>
          <DialogDescription>Ajoutez un nouveau service à votre catalogue</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              placeholder="Ex: Coupe + Brushing"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input
              type="number"
              placeholder="60"
              value={form.duration}
              onChange={(e) => handleChange("duration", parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              type="number"
              placeholder="45"
              value={form.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value))}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Description détaillée du service..."
              value={form.description}
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
            Créer le service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
