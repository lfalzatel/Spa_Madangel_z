// 📁 src/components/categorias/CategoriaList.tsx
// Componente para gestionar categorías de servicios

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CategoriaForm } from './CategoriaForm'
import { Search, Plus, Edit, Trash2, Tag, Package, Palette } from 'lucide-react'

export function CategoriaList() {
  const [categorias, setCategorias] = useState([])
  const [filteredCategorias, setFilteredCategorias] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [])

  useEffect(() => {
    const filtered = categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategorias(filtered)
  }, [searchTerm, categorias])

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const url = selectedCategoria 
        ? `/api/categorias/${selectedCategoria.id}`
        : '/api/categorias'
      const method = selectedCategoria ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchCategorias()
        setIsFormOpen(false)
        setSelectedCategoria(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar categoría')
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      alert('Error al guardar categoría')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (categoria: any) => {
    setSelectedCategoria(categoria)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string, serviciosCount: number) => {
    if (serviciosCount > 0) {
      alert(`No se puede eliminar esta categoría porque tiene ${serviciosCount} servicio(s) asociado(s)`)
      return
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return
    }

    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCategorias()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar categoría')
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('Error al eliminar categoría')
    }
  }

  const handleNewCategoria = () => {
    setSelectedCategoria(null)
    setIsFormOpen(true)
  }

  const getColorBadge = (color: string) => {
    const colorStyles: { [key: string]: { gradient: string, shadow: string } } = {
      'pink': { 
        gradient: 'bg-gradient-to-r from-pink-500 to-rose-500', 
        shadow: 'shadow-pink-500/30' 
      },
      'purple': { 
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-500', 
        shadow: 'shadow-purple-500/30' 
      },
      'blue': { 
        gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
        shadow: 'shadow-blue-500/30' 
      },
      'green': { 
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-500', 
        shadow: 'shadow-green-500/30' 
      },
      'orange': { 
        gradient: 'bg-gradient-to-r from-orange-500 to-amber-500', 
        shadow: 'shadow-orange-500/30' 
      },
      'cyan': { 
        gradient: 'bg-gradient-to-r from-cyan-500 to-teal-500', 
        shadow: 'shadow-cyan-500/30' 
      },
      'indigo': { 
        gradient: 'bg-gradient-to-r from-indigo-500 to-blue-500', 
        shadow: 'shadow-indigo-500/30' 
      },
      'red': { 
        gradient: 'bg-gradient-to-r from-red-500 to-pink-500', 
        shadow: 'shadow-red-500/30' 
      },
      'gray': { 
        gradient: 'bg-gradient-to-r from-gray-500 to-slate-500', 
        shadow: 'shadow-gray-500/30' 
      }
    }
    
    const style = colorStyles[color] || colorStyles['gray']
    return style
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Gestión de Categorías
              </CardTitle>
              <CardDescription>
                Administra las categorías de servicios del spa
              </CardDescription>
            </div>
            <Button 
              onClick={handleNewCategoria} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <Tag className="w-12 h-12 mb-4 text-gray-400" />
                        <p>No se encontraron categorías</p>
                        <p className="text-sm">Crea tu primera categoría para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategorias.map((categoria: any) => {
                    const colorStyle = getColorBadge(categoria.color)
                    return (
                      <TableRow key={categoria.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{categoria.nombre}</div>
                            {categoria.descripcion && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {categoria.descripcion}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorStyle.gradient} text-white shadow-md ${colorStyle.shadow}`}>
                            <Palette className="w-3 h-3 mr-1" />
                            {categoria.color}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Package className="w-3 h-3 mr-1 text-gray-400" />
                            {categoria._count?.servicios || 0} servicio(s)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{categoria.orden}</Badge>
                        </TableCell>
                        <TableCell>
                          {categoria.activo ? (
                            <Badge variant="default" className="bg-green-500">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(categoria)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(categoria.id, categoria._count?.servicios || 0)}
                              disabled={categoria._count?.servicios > 0}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoriaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedCategoria(null)
        }}
        onSubmit={handleSubmit}
        categoria={selectedCategoria}
        isLoading={isLoading}
      />
    </div>
  )
}
