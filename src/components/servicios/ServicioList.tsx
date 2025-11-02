"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ServicioForm } from './ServicioForm'
import { Search, Plus, Edit, Trash2, Package, Clock, DollarSign, Tag } from 'lucide-react'

export function ServicioList() {
  const [servicios, setServicios] = useState([])
  const [filteredServicios, setFilteredServicios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchServicios()
  }, [])

  useEffect(() => {
    const filtered = servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredServicios(filtered)
  }, [searchTerm, servicios])

  const fetchServicios = async () => {
    try {
      const response = await fetch('/api/servicios')
      const data = await response.json()
      setServicios(data)
    } catch (error) {
      console.error('Error al obtener servicios:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const url = selectedServicio 
        ? `/api/servicios/${selectedServicio.id}`
        : '/api/servicios'
      const method = selectedServicio ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchServicios()
        setIsFormOpen(false)
        setSelectedServicio(null)
      }
    } catch (error) {
      console.error('Error al guardar servicio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (servicio: any) => {
    setSelectedServicio(servicio)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return
    }

    try {
      const response = await fetch(`/api/servicios/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchServicios()
      }
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
    }
  }

  const handleNewServicio = () => {
    setSelectedServicio(null)
    setIsFormOpen(true)
  }

  const getCategoryBadge = (categoria: string) => {
    const badges: { [key: string]: { gradient: string, shadow: string } } = {
      'Manicura': { 
        gradient: 'bg-gradient-to-r from-pink-500 to-rose-500', 
        shadow: 'shadow-pink-500/30' 
      },
      'Pedicura': { 
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-500', 
        shadow: 'shadow-purple-500/30' 
      },
      'Uñas Acrílicas': { 
        gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
        shadow: 'shadow-blue-500/30' 
      },
      'Uñas de Gel': { 
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-500', 
        shadow: 'shadow-green-500/30' 
      },
      'Arte en Uñas': { 
        gradient: 'bg-gradient-to-r from-orange-500 to-amber-500', 
        shadow: 'shadow-orange-500/30' 
      },
      'Spa de Manos': { 
        gradient: 'bg-gradient-to-r from-cyan-500 to-teal-500', 
        shadow: 'shadow-cyan-500/30' 
      },
      'Spa de Pies': { 
        gradient: 'bg-gradient-to-r from-indigo-500 to-blue-500', 
        shadow: 'shadow-indigo-500/30' 
      },
      'Tratamientos': { 
        gradient: 'bg-gradient-to-r from-red-500 to-pink-500', 
        shadow: 'shadow-red-500/30' 
      },
      'Otros': { 
        gradient: 'bg-gradient-to-r from-gray-500 to-slate-500', 
        shadow: 'shadow-gray-500/30' 
      }
    }
    
    const style = badges[categoria] || badges['Otros']
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.gradient} text-white shadow-md ${style.shadow}`}>
        <Tag className="w-3 h-3 mr-1" />
        {categoria}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Gestión de Servicios
              </CardTitle>
              <CardDescription>
                Administra los servicios del spa Madangel
              </CardDescription>
            </div>
            <Button 
              onClick={handleNewServicio} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
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
                  <TableHead>Servicio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <Package className="w-12 h-12 mb-4 text-gray-400" />
                        <p>No se encontraron servicios</p>
                        <p className="text-sm">Crea tu primer servicio para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServicios.map((servicio: any) => (
                    <TableRow key={servicio.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{servicio.nombre}</div>
                          {servicio.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {servicio.descripcion}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(servicio.categoria)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          {servicio.duracion} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {servicio.precio.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {servicio.activo ? (
                          <span className="badge-completada">Activo</span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-white">
                            Inactivo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(servicio)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(servicio.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ServicioForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedServicio(null)
        }}
        onSubmit={handleSubmit}
        servicio={selectedServicio}
        isLoading={isLoading}
      />
    </div>
  )
}