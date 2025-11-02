"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CitaForm } from './CitaForm'
import { Search, Plus, Edit, Trash2, Calendar, Clock, User, DollarSign, Filter } from 'lucide-react'

export function CitaList() {
  const [citas, setCitas] = useState([])
  const [filteredCitas, setFilteredCitas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('') // Sin fecha por defecto
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCitas()
  }, [dateFilter])

  useEffect(() => {
    const filtered = citas.filter(cita =>
      cita.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCitas(filtered)
  }, [searchTerm, citas])

  const fetchCitas = async () => {
    try {
      const url = dateFilter ? `/api/citas?fecha=${dateFilter}` : '/api/citas'
      const response = await fetch(url)
      const data = await response.json()
      setCitas(data)
    } catch (error) {
      console.error('Error al obtener citas:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const url = selectedCita 
        ? `/api/citas/${selectedCita.id}`
        : '/api/citas'
      const method = selectedCita ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchCitas()
        setIsFormOpen(false)
        setSelectedCita(null)
      }
    } catch (error) {
      console.error('Error al guardar cita:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (cita: any) => {
    setSelectedCita(cita)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      return
    }

    try {
      const response = await fetch(`/api/citas/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCitas()
      }
    } catch (error) {
      console.error('Error al eliminar cita:', error)
    }
  }

  const handleNewCita = () => {
    setSelectedCita(null)
    setIsFormOpen(true)
  }

  const getEstadoClass = (estado: string) => {
    const badges: { [key: string]: string } = {
      'programada': 'badge-pendiente',
      'completada': 'badge-completada',
      'cancelada': 'badge-cancelada',
      'confirmada': 'badge-confirmada',
      'no_asistio': 'badge-cancelada'
    }
    return badges[estado] || 'badge-pendiente'
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Gestión de Citas
              </CardTitle>
              <CardDescription>
                Administra las citas del spa Madangel
              </CardDescription>
            </div>
            <Button onClick={handleNewCita} className="bg-gradient-primary text-white hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar citas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40"
                placeholder="Filtrar por fecha"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <Calendar className="w-12 h-12 mb-4 text-gray-400" />
                        <p>No se encontraron citas</p>
                        <p className="text-sm">
                          {dateFilter 
                            ? 'No hay citas para la fecha seleccionada' 
                            : 'Selecciona una fecha o programa tu primera cita'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCitas.map((cita: any) => (
                    <TableRow key={cita.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {new Date(cita.fecha).toLocaleDateString('es-ES')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            {cita.horaInicio} - {cita.horaFin}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1 text-gray-400" />
                          {cita.cliente.nombre} {cita.cliente.apellido}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1 text-gray-400" />
                          {cita.empleado.nombre} {cita.empleado.apellido}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cita.servicio.nombre}</div>
                          <div className="text-sm text-gray-500">
                            {cita.servicio.duracion} min
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="w-3 h-3 mr-1 text-green-600" />
                          {cita.total.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getEstadoClass(cita.estado)}>
                          {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1).replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cita)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cita.id)}
                            className="text-red-600 hover:text-red-700"
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

      <CitaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedCita(null)
        }}
        onSubmit={handleSubmit}
        cita={selectedCita}
        isLoading={isLoading}
      />
    </div>
  )
}