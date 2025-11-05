// 🔧 EJEMPLO: EmpleadoForm.tsx - CON dirección y fecha de nacimiento
// Los empleados necesitan información completa para gestión laboral

"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmpleadoFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  empleado: any | null
  isLoading: boolean
}

// 🎨 Lista de especialidades disponibles
const ESPECIALIDADES = [
  'Manicura',
  'Pedicura',
  'Uñas Acrílicas',
  'Uñas de Gel',
  'Arte en Uñas',
  'Spa de Manos',
  'Spa de Pies',
  'Tratamientos',
  'Diseño',
  'Masajes'
]

export function EmpleadoForm({ isOpen, onClose, onSubmit, empleado, isLoading }: EmpleadoFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '', // 🔥 NUEVO: Importante para empleados
      fechaNacimiento: '', // 🔥 NUEVO: Importante para empleados
      fechaContratacion: new Date().toISOString().split('T')[0],
      especialidad: '',
      activo: true
    }
  })

  useEffect(() => {
    if (empleado) {
      console.log('Cargando datos del empleado:', empleado)
      
      setValue('nombre', empleado.nombre)
      setValue('apellido', empleado.apellido)
      setValue('email', empleado.email)
      setValue('telefono', empleado.telefono || '')
      setValue('direccion', empleado.direccion || '')
      setValue('fechaNacimiento', empleado.fechaNacimiento ? empleado.fechaNacimiento.split('T')[0] : '')
      setValue('fechaContratacion', empleado.fechaContratacion.split('T')[0])
      setValue('especialidad', empleado.especialidad || '')
      setValue('activo', empleado.activo)
    } else {
      reset({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        fechaContratacion: new Date().toISOString().split('T')[0],
        especialidad: '',
        activo: true
      })
    }
  }, [empleado, setValue, reset])

  const handleFormSubmit = (data: any) => {
    // Validación adicional: debe ser mayor de 18 años
    const hoy = new Date()
    const nacimiento = new Date(data.fechaNacimiento)
    const edad = hoy.getFullYear() - nacimiento.getFullYear()
    
    if (edad < 18) {
      alert('El empleado debe ser mayor de 18 años')
      return
    }
    
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {empleado ? '✏️ Editar Empleado' : '➕ Nuevo Empleado'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Juan"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...register('apellido', { required: 'El apellido es obligatorio' })}
                placeholder="Pérez"
              />
              {errors.apellido && (
                <p className="text-sm text-red-500 mt-1">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              placeholder="juan.perez@madangel.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono', {
                pattern: {
                  value: /^[0-9]{10,}$/,
                  message: 'Debe tener al menos 10 dígitos'
                }
              })}
              placeholder="3001234567"
            />
            {errors.telefono && (
              <p className="text-sm text-red-500 mt-1">{errors.telefono.message}</p>
            )}
          </div>

          {/* 🔥 DIRECCIÓN - NUEVO CAMPO PARA EMPLEADOS */}
          <div>
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              {...register('direccion', {
                required: 'La dirección es obligatoria',
                minLength: {
                  value: 10,
                  message: 'La dirección debe tener al menos 10 caracteres'
                }
              })}
              placeholder="Calle 123 #45-67, Barrio Centro"
            />
            {errors.direccion && (
              <p className="text-sm text-red-500 mt-1">{errors.direccion.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Necesaria para documentación laboral y contacto de emergencia
            </p>
          </div>

          {/* 🔥 FECHA DE NACIMIENTO - NUEVO CAMPO PARA EMPLEADOS */}
          <div>
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              {...register('fechaNacimiento', {
                required: 'La fecha de nacimiento es obligatoria',
                validate: (value) => {
                  const hoy = new Date()
                  const nacimiento = new Date(value)
                  const edad = hoy.getFullYear() - nacimiento.getFullYear()
                  return edad >= 18 || 'Debe ser mayor de 18 años'
                }
              })}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.fechaNacimiento && (
              <p className="text-sm text-red-500 mt-1">{errors.fechaNacimiento.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Se usará para calcular edad y recordar cumpleaños
            </p>
          </div>

          {/* Fecha de Contratación */}
          <div>
            <Label htmlFor="fechaContratacion">Fecha de Contratación *</Label>
            <Input
              id="fechaContratacion"
              type="date"
              {...register('fechaContratacion', {
                required: 'La fecha de contratación es obligatoria'
              })}
            />
            {errors.fechaContratacion && (
              <p className="text-sm text-red-500 mt-1">{errors.fechaContratacion.message}</p>
            )}
          </div>

          {/* 🎨 ESPECIALIDAD - AHORA CON SELECT DROPDOWN */}
          <div>
            <Label htmlFor="especialidad">Especialidad *</Label>
            <Select 
              value={watch('especialidad')} 
              onValueChange={(value) => setValue('especialidad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                {ESPECIALIDADES.map((especialidad) => (
                  <SelectItem key={especialidad} value={especialidad}>
                    {especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.especialidad && (
              <p className="text-sm text-red-500 mt-1">{errors.especialidad.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Área de expertise del empleado
            </p>
          </div>

          {/* Estado Activo/Inactivo */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="activo" className="font-medium">
                Empleado Activo
              </Label>
              <p className="text-sm text-gray-500">
                {watch('activo') ? 'Disponible para asignar citas' : 'No disponible'}
              </p>
            </div>
            <Switch
              id="activo"
              checked={watch('activo')}
              onCheckedChange={(checked) => setValue('activo', checked)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
            >
              {isLoading ? 'Guardando...' : empleado ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 📝 CAMBIOS REALIZADOS:
// 
// ✅ AGREGADOS:
// - Campo "Dirección" (obligatorio, mínimo 10 caracteres)
//   * Necesaria para documentación laboral
//   * Útil para contacto de emergencia
//   * Requerida para aspectos legales
//
// - Campo "Fecha de Nacimiento" (obligatorio, debe ser mayor de 18 años)
//   * Calcula automáticamente la edad en la tabla
//   * Útil para recordatorios de cumpleaños
//   * Importante para gestión de personal
//
// 🎨 MODIFICADO:
// - Campo "Especialidad" ahora es un SELECT desplegable
//   * Lista predefinida de especialidades
//   * Sincronizada con los colores de badges en la lista
//   * Evita errores de tipeo
//   * Interfaz más profesional y consistente
//
// 🔒 VALIDACIONES AGREGADAS:
// - Dirección: mínimo 10 caracteres
// - Fecha de nacimiento: debe ser mayor de 18 años
// - Fecha de nacimiento: no puede ser futura
//
// 💡 BENEFICIOS:
// - Información completa del empleado
// - Cumplimiento de requisitos legales y administrativos
// - Mejor gestión de recursos humanos
// - Documentación completa para nómina y contratos
// - Especialidades estandarizadas y consistentes
