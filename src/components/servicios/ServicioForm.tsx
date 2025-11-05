// 🔧 EJEMPLO: ServicioForm.tsx - Con useEffect para cargar datos al editar
// Este es un ejemplo de cómo debe estructurarse el formulario para que
// cargue correctamente los datos cuando se edita un servicio

"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface ServicioFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  servicio: any | null // Puede ser null cuando es nuevo servicio
  isLoading: boolean
}

export function ServicioForm({ isOpen, onClose, onSubmit, servicio, isLoading }: ServicioFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      categoria: 'Otros',
      duracion: 30,
      precio: 0,
      activo: true
    }
  })

  // 🔥 CRÍTICO: Este useEffect es lo que carga los datos al editar
  useEffect(() => {
    if (servicio) {
      // Si hay un servicio seleccionado, llenar el formulario con sus datos
      console.log('Cargando datos del servicio:', servicio)
      
      setValue('nombre', servicio.nombre)
      setValue('descripcion', servicio.descripcion || '')
      setValue('categoria', servicio.categoria)
      setValue('duracion', servicio.duracion)
      setValue('precio', servicio.precio)
      setValue('activo', servicio.activo)
    } else {
      // Si no hay servicio (nuevo), resetear el formulario
      reset({
        nombre: '',
        descripcion: '',
        categoria: 'Otros',
        duracion: 30,
        precio: 0,
        activo: true
      })
    }
  }, [servicio, setValue, reset]) // Dependencias importantes

  const categorias = [
    'Manicura',
    'Pedicura',
    'Uñas Acrílicas',
    'Uñas de Gel',
    'Arte en Uñas',
    'Spa de Manos',
    'Spa de Pies',
    'Tratamientos',
    'Otros'
  ]

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {servicio ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre del Servicio */}
          <div>
            <Label htmlFor="nombre">Nombre del Servicio *</Label>
            <Input
              id="nombre"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              placeholder="Ej: Manicura Francesa"
            />
            {errors.nombre && (
              <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Describe el servicio..."
              rows={3}
            />
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria">Categoría *</Label>
            <Select
              value={watch('categoria')}
              onValueChange={(value) => setValue('categoria', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-red-500 mt-1">{errors.categoria.message}</p>
            )}
          </div>

          {/* Duración y Precio en la misma fila */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duración */}
            <div>
              <Label htmlFor="duracion">Duración (min) *</Label>
              <Input
                id="duracion"
                type="number"
                {...register('duracion', {
                  required: 'La duración es obligatoria',
                  min: { value: 1, message: 'Mínimo 1 minuto' }
                })}
                placeholder="30"
              />
              {errors.duracion && (
                <p className="text-sm text-red-500 mt-1">{errors.duracion.message}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <Label htmlFor="precio">Precio ($) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                {...register('precio', {
                  required: 'El precio es obligatorio',
                  min: { value: 0, message: 'El precio no puede ser negativo' }
                })}
                placeholder="25000"
              />
              {errors.precio && (
                <p className="text-sm text-red-500 mt-1">{errors.precio.message}</p>
              )}
            </div>
          </div>

          {/* Estado Activo/Inactivo */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="activo" className="font-medium">
                Servicio Activo
              </Label>
              <p className="text-sm text-gray-500">
                {watch('activo') ? 'Visible para los clientes' : 'Oculto de la vista'}
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
              {isLoading ? 'Guardando...' : servicio ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 📝 NOTAS IMPORTANTES:
// 
// 1. El useEffect con dependencias [servicio, setValue, reset] es CRÍTICO
//    - Se ejecuta cada vez que cambia el prop 'servicio'
//    - Si servicio existe, llena el formulario
//    - Si servicio es null, resetea el formulario
//
// 2. Para Select de react-hook-form, usa watch() y setValue() en lugar de register()
//    - watch('categoria') obtiene el valor actual
//    - setValue('categoria', value) actualiza el valor
//
// 3. Para Switch, usa watch() y onCheckedChange con setValue()
//    - Similar al Select
//
// 4. El console.log ayuda a debuggear si los datos se están cargando correctamente
//
// 5. Validaciones importantes:
//    - Nombre: obligatorio
//    - Categoría: obligatorio
//    - Duración: obligatorio, mínimo 1
//    - Precio: obligatorio, no negativo
