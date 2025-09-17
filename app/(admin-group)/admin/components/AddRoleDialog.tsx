"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    id?: number
    name: string
    color: string
    description: string
    permissions: string[]
  }) => void
  allPermissions: {
    groupe: string
    permissions: { key: string; label: string }[]
  }[]
  initialData?: {
    id: number
    nom: string
    description: string
    usersCount: number
    permissions: { id: number; nom: string }[]
    couleur: string
    createdAt: string
  } | null
  mode?: "add" | "edit"
}

export default function AddRoleDialog({
  open,
  onOpenChange,
  onSubmit,
  allPermissions,
  initialData,
  mode = "add"
}: AddRoleDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#059669")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // Pré-remplissage des champs et permissions
  useEffect(() => {
    if (initialData) {
      setName(initialData.nom || "")
      setColor(initialData.couleur || "#059669")
      setDescription(initialData.description || "")

      // Extraire les IDs des permissions et les convertir en strings
      const perms = initialData.permissions.map(p => p.id.toString())
      setSelectedPermissions(perms)
    } else {
      setName("")
      setColor("#059669")
      setDescription("")
      setSelectedPermissions([])
    }
  }, [initialData, open])

  // Toggle d'une permission individuelle
  const handlePermissionToggle = (key: string, checked: boolean) => {
    setSelectedPermissions(prev =>
      checked ? [...prev, key] : prev.filter(p => p !== key)
    )
  }

  // Toggle de toutes les permissions d'un groupe
  const handleGroupToggle = (groupe: string, checked: boolean) => {
    const groupPermissions =
      allPermissions.find(g => g.groupe === groupe)?.permissions.map(p => p.key) || []

    setSelectedPermissions(prev => {
      if (checked) {
        const newPerms = groupPermissions.filter(p => !prev.includes(p))
        return [...prev, ...newPerms]
      } else {
        return prev.filter(p => !groupPermissions.includes(p))
      }
    })
  }

  // ✅ Envoi des données (id seulement en modification)
  const handleSubmit = () => {
    const payload = {
      name,
      color,
      description,
      permissions: selectedPermissions,
    }

    if (mode === "edit" && initialData?.id) {
      onSubmit({ ...payload, id: initialData.id })
    } else {
      onSubmit(payload)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier un rôle" : "Créer un nouveau rôle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les détails du rôle existant"
              : "Définissez un nouveau rôle avec ses permissions"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom et couleur */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom du rôle</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <Input
                type="color"
                className="w-full h-10"
                value={color}
                onChange={e => setColor(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description du rôle et de ses responsabilités..."
            />
          </div>

          {/* Permissions */}
          <div className="space-y-6">
            <Label className="text-base font-semibold">Permissions</Label>
            {allPermissions.map(groupe => {
              const groupPermissions = groupe.permissions.map(p => p.key)
              const allSelected = groupPermissions.every(p =>
                selectedPermissions.includes(p)
              )
              const someSelected =
                !allSelected &&
                groupPermissions.some(p => selectedPermissions.includes(p))

              return (
                <div key={groupe.groupe} className="space-y-3 border rounded-lg p-4">
                  {/* Checkbox de groupe */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${groupe.groupe}`}
                      checked={allSelected}
                      onCheckedChange={checked =>
                        handleGroupToggle(groupe.groupe, checked as boolean)
                      }
                      data-indeterminate={someSelected} // état indéterminé
                    />
                    <Label
                      htmlFor={`group-${groupe.groupe}`}
                      className="text-sm font-semibold cursor-pointer"
                    >
                      {groupe.groupe}
                    </Label>
                  </div>

                  {/* Permissions individuelles */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-6">
                    {groupe.permissions.map(permission => (
                      <div key={permission.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.key}
                          checked={selectedPermissions.includes(permission.key)}
                          onCheckedChange={checked =>
                            handlePermissionToggle(permission.key, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={permission.key}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
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
            {mode === "edit" ? "Sauvegarder les modifications" : "Créer le rôle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
