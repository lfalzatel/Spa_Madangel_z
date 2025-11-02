"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CitaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  cita?: any
  isLoading?: boolean
}

export function CitaForm({ isOpen, onClose, onSubmit, cita, isLoading }: CitaFormProps) {
  const [formData, setFormData] = useState({
    clienteId: '',
    empleadoId: '',
    servicioId: '',
    fecha: '',
    horaInicio: '',
    notas: '',
    estado: 'programada'
  })

  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [servicios, setServicios] = useState([])

  // ✅ FIX 1: Cargar datos de la cita cuando el modal se abre para editar
  useEffect(() => {
    if (cita) {
      setFormData({
        clienteId: cita.clienteId || '',
        empleadoId: cita.empleadoId || '',
        servicioId: cita.servicioId || '',
        fecha: cita.fecha ? new Date(cita.fecha).toISOString().split('T')[0] : '',
        horaInicio: cita.horaInicio || '',
        notas: cita.notas || '',
        estado: cita.estado || 'programada'
      })
    } else {
      // Si no hay cita (nueva cita), resetear el formulario
      setFormData({
        clienteId: '',
        empleadoId: '',
        servicioId: '',
        fecha: '',
        horaInicio: '',
        notas: '',
        estado: 'programada'
      })
    }
  }, [cita, isOpen]) // Se ejecuta cuando cambia la cita o cuando se abre el modal

  useEffect(() => {
    fetchClientes()
    fetchEmpleados()
    fetchServicios()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    }
  }

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('/api/empleados')
      const data = await response.json()
      setEmpleados(data)
    } catch (error) {
      console.error('Error al obtener empleados:', error)
    }
  }

  const fetchServicios = async () => {
    try {
      const response = await fetch('/api/servicios')
      const data = await response.json()
      setServicios(data)
    } catch (error) {
      console.error('Error al obtener servicios:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {cita ? 'Editar Cita' : 'Nueva Cita'}
          </DialogTitle>
          <DialogDescription>
            {cita ? 'Edita la información de la cita' : 'Programa una nueva cita en el sistema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              <Select value={formData.clienteId} onValueChange={(value) => handleChange('clienteId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente: any) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="empleadoId">Empleado *</Label>
              <Select value={formData.empleadoId} onValueChange={(value) => handleChange('empleadoId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {empleados.map((empleado: any) => (
                    <SelectItem key={empleado.id} value={empleado.id}>
                      {empleado.nombre} {empleado.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicioId">Servicio *</Label>
            <Select value={formData.servicioId} onValueChange={(value) => handleChange('servicioId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {servicios.map((servicio: any) => (
                  <SelectItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - ${servicio.precio.toFixed(2)} ({servicio.duracion}min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                // ✅ FIX 2: Solo aplica min cuando es una cita NUEVA (no al editar)
                min={!cita ? new Date().toISOString().split('T')[0] : undefined}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora Inicio *</Label>
              <Select value={formData.horaInicio} onValueChange={(value) => handleChange('horaInicio', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {cita && (
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programada">Programada</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="no_asistio">No Asistió</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              placeholder="Notas especiales de la cita..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              {isLoading ? 'Guardando...' : (cita ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}