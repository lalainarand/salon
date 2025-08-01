"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Tag, Palette } from "lucide-react"

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

const getStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  )
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">Organisez vos services par catégories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle catégorie pour organiser vos services</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input placeholder="Ex: Coiffure, Coloration..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea placeholder="Description de la catégorie..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <div className="flex items-center gap-3">
                  <Input type="color" className="w-16 h-10" defaultValue="#8B4513" />
                  <span className="text-sm text-gray-600">Choisissez une couleur pour identifier la catégorie</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">Créer la catégorie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  {categories.filter((c) => c.status === "active").length}
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

      {/* Search */}
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
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
                {getStatusBadge(category.status)}
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
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vue Tableau</CardTitle>
          <CardDescription>{filteredCategories.length} catégorie(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: category.color }}></div>
                        <span className="text-sm text-gray-600">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.servicesCount}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
