"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClienteForm } from './ClienteForm'
import { Search, Plus, Edit, Trash2, User, Mail, Phone, Calendar, Sparkles } from 'lucide-react'

export function ClienteList() {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [citas, setCitas] = useState([]) // Para calcular última visita

  useEffect(() => {
    fetchClientes()
    fetchCitas() // Cargar todas las citas para hacer los cálculos
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)
    )
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    }
  }

  const fetchCitas = async () => {
    try {
      const response = await fetch('/api/citas')
      const data = await response.json()
      setCitas(data)
    } catch (error) {
      console.error('Error al obtener citas:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const url = selectedCliente 
        ? `/api/clientes/${selectedCliente.id}`
        : '/api/clientes'
      const method = selectedCliente ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchClientes()
        setIsFormOpen(false)
        setSelectedCliente(null)
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (cliente: any) => {
    setSelectedCliente(cliente)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return
    }

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchClientes()
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
    }
  }

  const handleNewCliente = () => {
    setSelectedCliente(null)
    setIsFormOpen(true)
  }

  // 🔧 FUNCIÓN: Calcular total de citas del cliente
  const getTotalCitas = (clienteId: string) => {
    return citas.filter(cita => cita.clienteId === clienteId).length
  }

  // 🔧 FUNCIÓN: Obtener última visita completada
  const getUltimaVisita = (clienteId: string) => {
    // Filtrar solo citas completadas de este cliente
    const citasCompletadas = citas.filter(
      cita => cita.clienteId === clienteId && cita.estado === 'completada'
    )

    // Si no tiene citas completadas
    if (citasCompletadas.length === 0) {
      return null
    }

    // Ordenar por fecha más reciente
    const ordenadas = citasCompletadas.sort((a, b) => {
      const fechaA = new Date(a.fecha)
      const fechaB = new Date(b.fecha)
      return fechaB.getTime() - fechaA.getTime()
    })

    const ultimaCita = ordenadas[0]
    
    // Calcular días desde la última visita
    const fechaVisita = new Date(ultimaCita.fecha)
    const hoy = new Date()
    const diffTime = Math.abs(hoy.getTime() - fechaVisita.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      diasDesde: diffDays,
      servicio: ultimaCita.servicio?.nombre || 'Servicio no especificado'
    }
  }

  // 🔧 FUNCIÓN: Formatear "hace X días"
  const formatearTiempo = (dias: number) => {
    if (dias === 0) return 'Hoy'
    if (dias === 1) return 'Ayer'
    if (dias < 7) return `Hace ${dias} días`
    if (dias < 30) {
      const semanas = Math.floor(dias / 7)
      return `Hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`
    }
    if (dias < 365) {
      const meses = Math.floor(dias / 30)
      return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`
    }
    const años = Math.floor(dias / 365)
    return `Hace ${años} ${años === 1 ? 'año' : 'años'}`
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Gestión de Clientes
              </CardTitle>
              <CardDescription>
                Administra la base de datos de clientes del spa Madangel
              </CardDescription>
            </div>
            <Button 
              onClick={handleNewCliente} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-center">Total Citas</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <User className="w-12 h-12 mb-4 text-gray-400" />
                        <p>No se encontraron clientes</p>
                        <p className="text-sm">Registra tu primer cliente para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente: any) => {
                    const totalCitas = getTotalCitas(cliente.id)
                    const ultimaVisita = getUltimaVisita(cliente.id)

                    return (
                      <TableRow key={cliente.id}>
                        {/* COLUMNA 1: CLIENTE (simplificada - sin dirección) */}
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {cliente.nombre} {cliente.apellido}
                            </div>
                            {cliente.notas && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {cliente.notas}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* COLUMNA 2: CONTACTO (solo Email y Teléfono - sin dirección) */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              {cliente.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              {cliente.telefono}
                            </div>
                          </div>
                        </TableCell>

                        {/* COLUMNA 3: TOTAL CITAS */}
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30">
                            {totalCitas} {totalCitas === 1 ? 'cita' : 'citas'}
                          </span>
                        </TableCell>

                        {/* COLUMNA 4: ÚLTIMA VISITA */}
                        <TableCell>
                          {ultimaVisita ? (
                            <div className="space-y-1">
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                {formatearTiempo(ultimaVisita.diasDesde)}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                                {ultimaVisita.servicio}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin visitas previas</span>
                          )}
                        </TableCell>

                        {/* COLUMNA 5: REGISTRADO */}
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(cliente.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </TableCell>

                        {/* COLUMNA 6: ACCIONES */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(cliente)}
                              className="hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(cliente.id)}
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

      {/* 🔧 NOTA: El ClienteForm debe actualizarse para QUITAR los campos:
          - Dirección
          - Fecha de nacimiento
          Estos datos no son relevantes para clientes */}
      <ClienteForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedCliente(null)
        }}
        onSubmit={handleSubmit}
        cliente={selectedCliente}
        isLoading={isLoading}
      />
    </div>
  )
}
