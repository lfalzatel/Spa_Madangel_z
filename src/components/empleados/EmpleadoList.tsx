"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmpleadoForm } from './EmpleadoForm'
import { Search, Plus, Edit, Trash2, User, Mail, Phone, Star, MapPin, Calendar, Cake } from 'lucide-react'

export function EmpleadoList() {
  const [empleados, setEmpleados] = useState([])
  const [filteredEmpleados, setFilteredEmpleados] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEmpleados()
  }, [])

  useEffect(() => {
    const filtered = empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmpleados(filtered)
  }, [searchTerm, empleados])

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('/api/empleados')
      const data = await response.json()
      setEmpleados(data)
    } catch (error) {
      console.error('Error al obtener empleados:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const url = selectedEmpleado 
        ? `/api/empleados/${selectedEmpleado.id}`
        : '/api/empleados'
      const method = selectedEmpleado ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchEmpleados()
        setIsFormOpen(false)
        setSelectedEmpleado(null)
      }
    } catch (error) {
      console.error('Error al guardar empleado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (empleado: any) => {
    setSelectedEmpleado(empleado)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      return
    }

    try {
      const response = await fetch(`/api/empleados/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEmpleados()
      }
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
    }
  }

  const handleNewEmpleado = () => {
    setSelectedEmpleado(null)
    setIsFormOpen(true)
  }

  // 🔧 FUNCIÓN: Calcular edad del empleado
  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return null
    
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    
    return edad
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Gestión de Empleados
              </CardTitle>
              <CardDescription>
                Administra al personal del spa Madangel
              </CardDescription>
            </div>
            <Button 
              onClick={handleNewEmpleado} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleados..."
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
                  <TableHead>Empleado</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Contratación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpleados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <User className="w-12 h-12 mb-4 text-gray-400" />
                        <p>No se encontraron empleados</p>
                        <p className="text-sm">Crea tu primer empleado para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmpleados.map((empleado: any) => {
                    const edad = calcularEdad(empleado.fechaNacimiento)
                    
                    return (
                      <TableRow key={empleado.id}>
                        {/* COLUMNA 1: EMPLEADO */}
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {empleado.nombre} {empleado.apellido}
                            </div>
                          </div>
                        </TableCell>

                        {/* COLUMNA 2: CONTACTO (Email + Teléfono) */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              {empleado.email}
                            </div>
                            {empleado.telefono && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                {empleado.telefono}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* COLUMNA 3: UBICACIÓN (Dirección) - IMPORTANTE PARA EMPLEADOS */}
                        <TableCell>
                          {empleado.direccion ? (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-xs">{empleado.direccion}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No especificada</span>
                          )}
                        </TableCell>

                        {/* COLUMNA 4: EDAD - IMPORTANTE PARA EMPLEADOS */}
                        <TableCell>
                          {edad !== null ? (
                            <div className="flex items-center text-sm text-gray-700">
                              <Cake className="w-3 h-3 mr-1 text-pink-400" />
                              <span className="font-medium">{edad} años</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No especificada</span>
                          )}
                        </TableCell>

                        {/* COLUMNA 5: ESPECIALIDAD */}
                        <TableCell>
                          {empleado.especialidad ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30">
                              <Star className="w-3 h-3 mr-1" />
                              {empleado.especialidad}
                            </span>
                          ) : (
                            <span className="text-gray-400">No asignada</span>
                          )}
                        </TableCell>

                        {/* COLUMNA 6: ESTADO */}
                        <TableCell>
                          {empleado.activo ? (
                            <span className="badge-completada">Activo</span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-white">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        {/* COLUMNA 7: FECHA CONTRATACIÓN */}
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {new Date(empleado.fechaContratacion).toLocaleDateString('es-ES')}
                          </div>
                        </TableCell>

                        {/* COLUMNA 8: ACCIONES */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(empleado)}
                              className="hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(empleado.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* 🔧 NOTA: El EmpleadoForm debe actualizarse para INCLUIR los campos:
          - Dirección (obligatorio o recomendado)
          - Fecha de nacimiento (para calcular edad)
          Estos datos SÍ son relevantes para empleados */}
      <EmpleadoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedEmpleado(null)
        }}
        onSubmit={handleSubmit}
        empleado={selectedEmpleado}
        isLoading={isLoading}
      />
    </div>
  )
}
