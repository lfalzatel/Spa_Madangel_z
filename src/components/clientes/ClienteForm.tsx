// 🔧 EJEMPLO: ClienteForm.tsx - SIN dirección ni fecha de nacimiento
// Los clientes solo necesitan: nombre, apellido, email, teléfono, notas

"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ClienteFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  cliente: any | null
  isLoading: boolean
}

export function ClienteForm({ isOpen, onClose, onSubmit, cliente, isLoading }: ClienteFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      notas: ''
    }
  })

  useEffect(() => {
    if (cliente) {
      console.log('Cargando datos del cliente:', cliente)
      
      setValue('nombre', cliente.nombre)
      setValue('apellido', cliente.apellido)
      setValue('email', cliente.email)
      setValue('telefono', cliente.telefono)
      setValue('notas', cliente.notas || '')
    } else {
      reset({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        notas: ''
      })
    }
  }, [cliente, setValue, reset])

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {cliente ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre y Apellido en la misma fila */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="María"
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
                placeholder="González"
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
              placeholder="maria@ejemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono', {
                required: 'El teléfono es obligatorio',
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

          {/* Notas (Opcional) */}
          <div>
            <Label htmlFor="notas">Notas (Opcional)</Label>
            <Textarea
              id="notas"
              {...register('notas')}
              placeholder="Preferencias, alergias, observaciones..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: Alérgica al acetón, prefiere colores pasteles
            </p>
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
              {isLoading ? 'Guardando...' : cliente ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 📝 CAMBIOS REALIZADOS:
// 
// ❌ ELIMINADOS:
// - Campo "Dirección" (no relevante para clientes)
// - Campo "Fecha de Nacimiento" (muchos clientes no quieren compartirlo)
// 
// ✅ MANTENIDOS:
// - Nombre (obligatorio)
// - Apellido (obligatorio)
// - Email (obligatorio, con validación)
// - Teléfono (obligatorio, con validación de 10+ dígitos)
// - Notas (opcional, para preferencias o alergias)
//
// 💡 BENEFICIOS:
// - Formulario más simple y rápido
// - Respeta la privacidad del cliente
// - Solo pide información esencial para el servicio
// - Reduce fricción en el proceso de registro
