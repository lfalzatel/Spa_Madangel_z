"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ServicioFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  servicio?: any
  isLoading?: boolean
}

export function ServicioForm({ isOpen, onClose, onSubmit, servicio, isLoading }: ServicioFormProps) {
  const [formData, setFormData] = useState({
    nombre: servicio?.nombre || '',
    descripcion: servicio?.descripcion || '',
    duracion: servicio?.duracion?.toString() || '',
    precio: servicio?.precio?.toString() || '',
    categoria: servicio?.categoria || '',
    activo: servicio?.activo ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogTitle>
          <DialogDescription>
            {servicio ? 'Edita la información del servicio' : 'Registra un nuevo servicio en el sistema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Servicio *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Manicura Francesa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría *</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manicura">Manicura</SelectItem>
                <SelectItem value="Pedicura">Pedicura</SelectItem>
                <SelectItem value="Uñas Acrílicas">Uñas Acrílicas</SelectItem>
                <SelectItem value="Uñas de Gel">Uñas de Gel</SelectItem>
                <SelectItem value="Arte en Uñas">Arte en Uñas</SelectItem>
                <SelectItem value="Spa de Manos">Spa de Manos</SelectItem>
                <SelectItem value="Spa de Pies">Spa de Pies</SelectItem>
                <SelectItem value="Tratamientos">Tratamientos</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración (minutos) *</Label>
              <Input
                id="duracion"
                type="number"
                value={formData.duracion}
                onChange={(e) => handleChange('duracion', e.target.value)}
                placeholder="30"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio ($) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                placeholder="25.00"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Describe el servicio..."
              rows={3}
            />
          </div>

          {servicio && (
            <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => handleChange('activo', checked)}
              />
              <Label htmlFor="activo">Servicio activo</Label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (servicio ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}