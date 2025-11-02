"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClienteForm } from './ClienteForm'
import { Search, Plus, Edit, Trash2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export function ClienteList() {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchClientes()
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

  const calculateAge = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return null
    const birth = new Date(fechaNacimiento)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
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
                  <TableHead>Dirección</TableHead>
                  <TableHead>Edad</TableHead>
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
                  filteredClientes.map((cliente: any) => (
                    <TableRow key={cliente.id}>
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
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {cliente.telefono}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.direccion ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-xs">{cliente.direccion}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No registrada</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cliente.fechaNacimiento ? (
                          <div className="flex items-center">
                            <span className="badge-confirmada">
                              <Calendar className="w-3 h-3 mr-1" />
                              {calculateAge(cliente.fechaNacimiento)} años
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No registrada</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(cliente.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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