"use client"

import api from "@/lib/api"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import AddEditCategoryDialog from "@/app/(admin-group)/admin/components/AddEditCategoryDialog"
import { Plus, Search, Edit, Trash2, Tag, Palette } from "lucide-react"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

type CategoryType = {
  id: number
  nom: string
  description: string
  couleur: string
  statut: number // 1 = actif, 0 = inactif
  created_at: string
  updated_at: string
}

const getStatusBadge = (statut: number) => {
  return statut === 1 ? (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  )
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [categoriesState, setCategoriesState] = useState<CategoryType[]>([])
  const [dialogOpenId, setDialogOpenId] = useState<number | null>(null)
  const [dialogDeleteId, setDialogDeleteId] = useState<number | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  // Charger depuis API
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/categories/index")
      setCategoriesState(data)
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Toggle statut
  const handleToggleStatus = async (category: CategoryType) => {
    try {
      await api.put(`/api/categories/change/${category.id}`, {
        statut: category.statut === 1 ? 0 : 1,
      })
      showSuccess(`Statut de "${category.nom}" mis à jour avec succès`)
      fetchCategories()
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err)
    }
    setDialogOpenId(null)
  }

  // Suppression
  const handleDeleteCategory = async (id: number) => {
    try {
      await api.delete(`/api/categories/${id}`)
      setCategoriesState((prev) => prev.filter((c) => c.id !== id))
      showSuccess("Suppression catégorie succès")
    } catch (err) {
      console.error("Erreur lors de la suppression :", err)
    }
    setDialogDeleteId(null)
  }

  // Sauvegarde (ajout / modif)
  const handleSaveCategory = async (data: Partial<CategoryType>) => {
    if (data.id) {
      // MODIFICATION
      try {
        await api.put(`/api/categories/${data.id}`, data)
        showSuccess(`Modification catégorie ${data.nom} succès`)
        fetchCategories()
      } catch (err) {
        console.error("Erreur lors de la modification :", err)
      }
    } else {
      // AJOUT
      try {
        await api.post("/api/categories", data)
        showSuccess(`Création catégorie ${data.nom} succès`)
        fetchCategories()
      } catch (err) {
        console.error("Erreur lors de la création :", err)
      }
    }
    setIsDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: CategoryType) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">Organisez vos services par catégories</p>
        </div>
        <Button
          onClick={handleCreateCategory}
          className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Catégorie
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{categoriesState.length}</p>
              </div>
              <Tag className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Catégories Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categoriesState.filter((c) => c.statut === 1).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* Ici, si l’API renvoie pas les servicesCount il faut l’ajouter */}
                  {0}
                </p>
              </div>
              <Palette className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moy. Services/Cat.</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">=</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesState
          .filter(
            (category) =>
              category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: category.couleur }}
                    ></div>
                    <CardTitle className="text-lg">{category.nom}</CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(category.statut)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialogOpenId(category.id)}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      Changer
                    </Button>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Créée le</span>
                    <span className="text-sm">
                      {new Date(category.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDialogDeleteId(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>

              {/* Dialog suppression */}
              <ConfirmDeleteDialog
                open={dialogDeleteId === category.id}
                onOpenChange={(open) => !open && setDialogDeleteId(null)}
                onConfirm={() => handleDeleteCategory(category.id)}
                title={`Supprimer la catégorie "${category.nom}" ?`}
                description="Cette action est irréversible. Êtes-vous sûr(e) ?"
                toastMessage="Catégorie supprimée avec succès."
              />

              {/* Dialog toggle statut */}
              <ConfirmToggleDialog
                open={dialogOpenId === category.id}
                onOpenChange={(open) => setDialogOpenId(open ? category.id : null)}
                onConfirm={() => handleToggleStatus(category)}
                title="Changer le statut de la catégorie"
                description={`Souhaitez-vous vraiment ${
                  category.statut === 1 ? "désactiver" : "activer"
                } cette catégorie ?`}
                confirmLabel="Confirmer"
              />
            </Card>
          ))}
      </div>

      {/* Modal ajout / modif */}
      <AddEditCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedCategory}
        onSubmit={handleSaveCategory}
      />

      {/* Notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  )
}
