"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CitaForm } from './CitaForm'
import { Search, Edit, Trash2, Calendar, Clock, User, DollarSign, Filter, AlertCircle, CalendarClock, History, X } from 'lucide-react'

interface CitaListProps {
  triggerNewCita?: number
  filterType?: string | null  // 'hoy', 'canceladas', 'completadas'
  onClearFilter?: () => void
}

export function CitaList({ triggerNewCita = 0, filterType = null, onClearFilter }: CitaListProps) {
  const [citas, setCitas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCitas()
  }, [dateFilter])

  useEffect(() => {
    if (triggerNewCita > 0) {
      handleNewCita()
    }
  }, [triggerNewCita])

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
      'no_asistio': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-500 text-white shadow-md'
    }
    return badges[estado] || 'badge-pendiente'
  }

  const formatearFechaConDia = (fechaString: string) => {
    const fechaSolo = fechaString.split('T')[0]
    const [year, month, day] = fechaSolo.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    
    return {
      diaSemana: dias[date.getDay()],
      fecha: `${day}/${month}/${year}`
    }
  }

  // 🔥 FUNCIÓN: Filtrar citas según el tipo
  const filtrarCitasPorTipo = () => {
    const ahora = new Date()
    ahora.setHours(0, 0, 0, 0)
    
    // Filtrar por búsqueda primero
    let citasFiltradas = citas.filter(cita =>
      cita.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Aplicar filtro por tipo si existe
    if (filterType === 'hoy') {
      // Mostrar solo citas de hoy
      const hoyStr = ahora.toISOString().split('T')[0]
      citasFiltradas = citasFiltradas.filter(cita => 
        cita.fecha.split('T')[0] === hoyStr
      )
    } else if (filterType === 'canceladas') {
      // Mostrar canceladas y no_asistio
      citasFiltradas = citasFiltradas.filter(cita => 
        cita.estado === 'cancelada' || cita.estado === 'no_asistio'
      )
    } else if (filterType === 'completadas') {
      // Mostrar solo completadas
      citasFiltradas = citasFiltradas.filter(cita => 
        cita.estado === 'completada'
      )
    }

    // Separar en próximas e historial si no hay filtro específico
    if (!filterType) {
      const proximas = citasFiltradas.filter(cita => {
        const fechaCita = new Date(cita.fecha.split('T')[0])
        return fechaCita >= ahora
      }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

      const historial = citasFiltradas.filter(cita => {
        const fechaCita = new Date(cita.fecha.split('T')[0])
        return fechaCita < ahora
      }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

      return { proximas, historial, filtered: null }
    } else {
      // Si hay filtro, ordenar por fecha más reciente
      citasFiltradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      return { proximas: [], historial: [], filtered: citasFiltradas }
    }
  }

  const { proximas, historial, filtered } = filtrarCitasPorTipo()

  // Determinar el título según el filtro
  const getTituloFiltro = () => {
    if (filterType === 'hoy') return 'Citas del Día'
    if (filterType === 'canceladas') return 'Citas Canceladas y No Asistió'
    if (filterType === 'completadas') return 'Citas Completadas'
    return null
  }

  // Componente de tabla reutilizable
  const TablaCitas = ({ citas, titulo, icono }: { citas: any[], titulo: string, icono: React.ReactNode }) => (
    <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icono}
            {titulo}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({citas.length} {citas.length === 1 ? 'cita' : 'citas'})
            </span>
          </CardTitle>
          {filterType && onClearFilter && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearFilter}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar filtro
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Fecha y Hora</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Empleado</TableHead>
                <TableHead className="font-semibold">Servicio</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500">
                      <Calendar className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No hay citas</p>
                      <p className="text-sm mt-2">
                        {filterType 
                          ? `No hay citas ${getTituloFiltro()?.toLowerCase()}` 
                          : 'No hay citas en esta categoría'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                citas.map((cita: any) => {
                  const { diaSemana, fecha } = formatearFechaConDia(cita.fecha)
                  const precioGuardado = cita.total
                  const precioActual = cita.servicio.precio
                  const preciosDiferentes = precioGuardado !== precioActual
                  
                  return (
                    <TableRow key={cita.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                            {diaSemana}
                          </div>
                          <div className="text-sm text-gray-600 pl-5">
                            {fecha}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 pl-5">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            {cita.horaInicio} - {cita.horaFin}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {cita.cliente.nombre} {cita.cliente.apellido}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700">
                            {cita.empleado.nombre} {cita.empleado.apellido}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{cita.servicio.nombre}</div>
                          <div className="text-sm text-gray-500">
                            {cita.servicio.duracion} min
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-base font-semibold text-green-600">
                            <DollarSign className="w-4 h-4" />
                            {precioActual.toLocaleString('es-CO')}
                          </div>
                          {preciosDiferentes && (
                            <div className="group relative">
                              <AlertCircle className="w-4 h-4 text-orange-500 cursor-help" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                                  Precio guardado en cita: ${precioGuardado.toLocaleString('es-CO')}
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className={getEstadoClass(cita.estado)}>
                          {cita.estado === 'no_asistio' ? 'No Asistió' : 
                           cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cita)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cita.id)}
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
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
  )

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, empleado o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
              <Filter className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40 border-0 bg-transparent focus:ring-0 p-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar citas filtradas o divididas */}
      {filtered ? (
        <TablaCitas 
          citas={filtered} 
          titulo={getTituloFiltro() || 'Citas'} 
          icono={<CalendarClock className="w-5 h-5 text-blue-500" />}
        />
      ) : (
        <>
          <TablaCitas 
            citas={proximas} 
            titulo="Próximas Citas" 
            icono={<CalendarClock className="w-5 h-5 text-blue-500" />}
          />
          <TablaCitas 
            citas={historial} 
            titulo="Historial" 
            icono={<History className="w-5 h-5 text-gray-500" />}
          />
        </>
      )}

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
