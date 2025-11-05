// 📁 src/components/categorias/CategoriaForm.tsx
// Formulario para crear y editar categorías

"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Palette, Tag } from 'lucide-react'

interface CategoriaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  categoria: any | null
  isLoading: boolean
}

export function CategoriaForm({ isOpen, onClose, onSubmit, categoria, isLoading }: CategoriaFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      color: 'gray',
      icono: '',
      orden: 0,
      activo: true
    }
  })

  useEffect(() => {
    if (categoria) {
      setValue('nombre', categoria.nombre)
      setValue('descripcion', categoria.descripcion || '')
      setValue('color', categoria.color)
      setValue('icono', categoria.icono || '')
      setValue('orden', categoria.orden)
      setValue('activo', categoria.activo)
    } else {
      reset({
        nombre: '',
        descripcion: '',
        color: 'gray',
        icono: '',
        orden: 0,
        activo: true
      })
    }
  }, [categoria, setValue, reset])

  const colores = [
    { value: 'pink', label: 'Rosa', gradient: 'from-pink-500 to-rose-500' },
    { value: 'purple', label: 'Morado', gradient: 'from-purple-500 to-indigo-500' },
    { value: 'blue', label: 'Azul', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'green', label: 'Verde', gradient: 'from-green-500 to-emerald-500' },
    { value: 'orange', label: 'Naranja', gradient: 'from-orange-500 to-amber-500' },
    { value: 'cyan', label: 'Cyan', gradient: 'from-cyan-500 to-teal-500' },
    { value: 'indigo', label: 'Índigo', gradient: 'from-indigo-500 to-blue-500' },
    { value: 'red', label: 'Rojo', gradient: 'from-red-500 to-pink-500' },
    { value: 'gray', label: 'Gris', gradient: 'from-gray-500 to-slate-500' }
  ]

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  const selectedColor = watch('color')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {categoria 
              ? 'Modifica los datos de la categoría' 
              : 'Agrega una nueva categoría de servicios'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="ej: Peinados, Cortes de Cabello, Manicura"
              {...register('nombre', { required: 'El nombre es requerido' })}
            />
            {errors.nombre && (
              <span className="text-sm text-red-500">{errors.nombre.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Breve descripción de la categoría"
              rows={3}
              {...register('descripcion')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">
              <Palette className="w-4 h-4 inline mr-1" />
              Color del Badge
            </Label>
            <Select
              value={selectedColor}
              onValueChange={(value) => setValue('color', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colores.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.gradient}`} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colores.find(c => c.value === selectedColor)?.gradient} text-white shadow-md`}>
                Vista previa
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icono">
              Icono (opcional)
              <span className="text-xs text-gray-500 ml-2">Nombre del icono de Lucide</span>
            </Label>
            <Input
              id="icono"
              placeholder="ej: Scissors, Sparkles, Star"
              {...register('icono')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orden">Orden de visualización</Label>
              <Input
                id="orden"
                type="number"
                min="0"
                {...register('orden', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="activo"
                  checked={watch('activo')}
                  onCheckedChange={(checked) => setValue('activo', checked)}
                />
                <Label htmlFor="activo" className="text-sm font-normal">
                  {watch('activo') ? 'Activa' : 'Inactiva'}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
              {isLoading ? 'Guardando...' : categoria ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
