"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import AddEditCategoryDialog from "@/app/(admin-group)/admin/components/AddEditCategoryDialog"
import { Plus, Search, Edit, Trash2, Tag, Palette } from "lucide-react"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

const categories = [
  {
    id: 1,
    name: "Coiffure",
    description: "Services de coupe, brushing et coiffage",
    color: "#8B4513",
    servicesCount: 8,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Coloration",
    description: "Colorations, mèches, balayages et décolorations",
    color: "#FF6B6B",
    servicesCount: 6,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: 3,
    name: "Barbier",
    description: "Services spécialisés pour hommes",
    color: "#4ECDC4",
    servicesCount: 4,
    status: "active",
    createdAt: "2023-02-10",
  },
  {
    id: 4,
    name: "Soins",
    description: "Soins capillaires et traitements",
    color: "#45B7D1",
    servicesCount: 5,
    status: "active",
    createdAt: "2023-03-05",
  },
  {
    id: 5,
    name: "Maquillage",
    description: "Services de maquillage et beauté",
    color: "#F39C12",
    servicesCount: 3,
    status: "inactive",
    createdAt: "2023-04-20",
  },
  {
    id: 6,
    name: "Épilation",
    description: "Services d'épilation et esthétique",
    color: "#E74C3C",
    servicesCount: 7,
    status: "active",
    createdAt: "2023-05-12",
  },
]

type CategoryType = {
  id?: number
  name: string
  description: string
  color: string
}


const getStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  )
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [categoriesState, setCategoriesState] = useState(categories)
  const [dialogOpenId, setDialogOpenId] = useState<number | null>(null)
  const [dialogDeleteId, setDialogDeleteId] = useState<number | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()
  const [statusMap, setStatusMap] = useState<Map<number, string>>(
    new Map(categories.map((c) => [c.id, c.status]))
  )

  const handleToggleStatus = (categoryId: number) => {
    setStatusMap((prev) => {
      const newMap = new Map(prev)
      const current = newMap.get(categoryId)
      newMap.set(categoryId, current === "active" ? "inactive" : "active")
      return newMap
    })
    setDialogOpenId(null)
  }

  const handleDeleteCategory = async (id: number) => {
    // await axios.delete(`/api/categories/${id}`)
    setCategoriesState((prev) => prev.filter((c) => c.id !== id))
    showSuccess(`Suppression categorie succès`)
  }

  const handleSaveCategory = (data: CategoryType) => {
    if (data.id) {
      // MODIFICATION
      setCategoriesState((prev) =>
        prev.map((cat) => (cat.id === data.id ? { ...cat, ...data } : cat))
      )
      showSuccess(`Modification categorie ${data?.name} succès`)
    } else {
      // AJOUT
      const newCategory = {
        ...data,
        id: Date.now(), // ou géré par backend
        createdAt: new Date().toISOString(),
        servicesCount: 0,
        status: "active",
      }
      setCategoriesState((prev) => [newCategory, ...prev])
      showSuccess(`Création categorie ${data?.name} succès`)
    }
    setIsDialogOpen(false)
  }
  const handleCreateUser = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditUser = (categories: any) => {
    setSelectedCategory(categories)
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
          onClick={handleCreateUser}
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
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
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
                  {[...statusMap.values()].filter((s) => s === "active").length}
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
                  {categories.reduce((acc, c) => acc + c.servicesCount, 0)}
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
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(categories.reduce((acc, c) => acc + c.servicesCount, 0) / categories.length)}
                </p>
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
              category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.description.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((category) => {
            const currentStatus = statusMap.get(category.id) || "inactive"
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(currentStatus)}
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
                      <span className="text-sm text-gray-600">Services</span>
                      <Badge variant="outline">{category.servicesCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Créée le</span>
                      <span className="text-sm">{new Date(category.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(category)}
                      >
                        <Edit className="w-4 h-4" />
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

                <ConfirmDeleteDialog
                  open={dialogDeleteId === category.id}
                  onOpenChange={(open) => !open && setDialogDeleteId(null)}
                  onConfirm={() => handleDeleteCategory(category.id)}
                  title={`Supprimer la catégorie "${category.name}" ?`}
                  description="Cette action est irréversible. Êtes-vous sûr(e) ?"
                  toastMessage="Catégorie supprimée avec succès."
                />

                <ConfirmToggleDialog
                  open={dialogOpenId === category.id}
                  onOpenChange={(open) => setDialogOpenId(open ? category.id : null)}
                  onConfirm={() => handleToggleStatus(category.id)}
                  title="Changer le statut de la catégorie"
                  description={`Souhaitez-vous vraiment ${currentStatus === "active" ? "désactiver" : "activer"
                    } cette catégorie ?`}
                  confirmLabel="Confirmer"
                />
              </Card>
            )

          })}
      </div>
      <AddEditCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedCategory}
        onSubmit={handleSaveCategory}
      />

      {/* Composant de notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000} // 4 secondes
      />

      
    </div>

  )
}
