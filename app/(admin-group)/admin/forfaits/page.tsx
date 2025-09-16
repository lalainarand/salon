"use client"

import api from "@/lib/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import { Switch } from "@/components/ui/switch"
import AddPackageDialog from "@/app/(admin-group)/admin/components/AddPackageDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

export interface ServiceOption {
  id: number
  nom: string
}

export interface PackageType {
  id: number
  nom: string
  prix: number
  services: ServiceOption[]
  statut: boolean
}

export default function ForfaitPage() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [services, setServices] = useState<ServiceOption[]>([])
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openToggleDialog, setOpenToggleDialog] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<PackageType | null>(null)
  const [packageToToggle, setPackageToToggle] = useState<PackageType | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  // Récupération des services depuis l'API
  const fetchServices = async () => {
    try {
      const { data } = await api.get("/api/services")
      setServices(data)
    } catch (err) {
      console.error("Erreur lors de la récupération des services:", err)
    }
  }

  // Récupération des forfaits depuis l'API
  const fetchForfaits = async () => {
    try {
      const { data } = await api.get("/api/forfaits")
      setPackages(data)
    } catch (err) {
      console.error("Erreur lors de la récupération des forfaits:", err)
    }
  }

  useEffect(() => {
    fetchServices()
    fetchForfaits()
  }, [])

  const handleDeleteClick = (pkg: PackageType) => {
    setPackageToDelete(pkg)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return
    try {
      await api.delete(`/api/forfaits/${packageToDelete.id}`)
      setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id))
      showSuccess("Forfait supprimé avec succès.")
    } catch (err) {
      console.error("Erreur lors de la suppression :", err)
    } finally {
      setOpenDeleteDialog(false)
      setPackageToDelete(null)
    }
  }

  const handleToggleClick = (pkg: PackageType) => {
    setPackageToToggle(pkg)
    setOpenToggleDialog(true)
  }

  const handleConfirmToggle = async () => {
    if (!packageToToggle) return
    try {
      const { data } = await api.put(`/api/forfaits/changestatus/${packageToToggle.id}`)
      setPackages((prev) =>
        prev.map((p) => (p.id === packageToToggle.id ? { ...p, statut: data.statut } : p))
      )
      showSuccess("Statut du forfait changé avec succès.")
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err)
    } finally {
      setOpenToggleDialog(false)
      setPackageToToggle(null)
    }
  }

  const handleSave = async (pkgData: Omit<PackageType, "id" | "active">) => {
    try {
      // Construire payload à envoyer à l'API
      const payload = {
        ...pkgData,
        services: pkgData.services.map((s: any) => s.id), // envoyer seulement les IDs
      }

      if (selectedPackage) {
        // 🔹 Mise à jour
        console.log("Données envoyées pour modification :", {
          id: selectedPackage.id,
          ...payload,
        })

        const { data } = await api.put(`/api/forfaits/${selectedPackage.id}`, payload)

        setPackages((prev) =>
          prev.map((p) => (p.id === selectedPackage.id ? data : p))
        )
        showSuccess("Forfait mis à jour avec succès.")
      } else {
        // 🔹 Création
        const creationPayload = { ...payload, statut: true }
        console.log("Données envoyées pour création :", creationPayload)

        const { data } = await api.post(`/api/forfaits`, creationPayload)

        console.log("Réponse API création :", data)

        setPackages((prev) => [data, ...prev])
        showSuccess("Nouveau forfait créé avec succès.")
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err)
    } finally {
      setOpenDialog(false)
      setSelectedPackage(null)
    }
  }


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Forfaits</h1>
          <p className="text-gray-600">Créez et gérez les packs de services</p>
        </div>
        <Button
          className="bg-[rgb(156,183,132)] hover:bg-[rgb(156,183,132)]/90"
          onClick={() => {
            setSelectedPackage(null)
            setOpenDialog(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Nouveau Forfait
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{pkg.nom}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={pkg.statut}
                    onCheckedChange={() => handleToggleClick(pkg)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setOpenDialog(true)
                    }}
                  >
                    <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(pkg)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="mt-1 text-sm text-gray-600">
                Prix : {pkg.prix}Ar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pkg.services.map((s) => (
                  <Badge key={s.id} variant="secondary" className="text-xs">
                    {s.nom}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddPackageDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSave}
        initialData={selectedPackage}
        mode={selectedPackage ? "edit" : "add"}
        allServices={services}
      />

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce forfait ?"
        description="Cette action est définitive."
        toastMessage="Forfait supprimé avec succès."
      />

      <ConfirmToggleDialog
        open={openToggleDialog}
        onOpenChange={setOpenToggleDialog}
        onConfirm={handleConfirmToggle}
        title="Changer le statut du forfait"
        description="Voulez-vous vraiment changer le statut de ce forfait ?"
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  )
}
