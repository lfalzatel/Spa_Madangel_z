// 📁 src/components/servicios/ServicioForm.tsx (ACTUALIZADO)
// Formulario actualizado para usar categorías dinámicas

"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tag, Loader2 } from 'lucide-react'

interface ServicioFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  servicio: any | null
  isLoading: boolean
}

export function ServicioForm({ isOpen, onClose, onSubmit, servicio, isLoading }: ServicioFormProps) {
  const [categorias, setCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      categoriaId: '', // ✨ Cambiado de 'categoria' a 'categoriaId'
      duracion: 30,
      precio: 0,
      activo: true
    }
  })

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias()
  }, [])

  // Cargar datos del servicio al editar
  useEffect(() => {
    if (servicio) {
      console.log('Cargando datos del servicio:', servicio)
      
      setValue('nombre', servicio.nombre)
      setValue('descripcion', servicio.descripcion || '')
      // ✨ Importante: usar categoriaId si existe, sino usar categoria.id si es un objeto
      setValue('categoriaId', servicio.categoriaId || servicio.categoria?.id || '')
      setValue('duracion', servicio.duracion)
      setValue('precio', servicio.precio)
      setValue('activo', servicio.activo)
    } else {
      reset({
        nombre: '',
        descripcion: '',
        categoriaId: '',
        duracion: 30,
        precio: 0,
        activo: true
      })
    }
  }, [servicio, setValue, reset])

  const fetchCategorias = async () => {
    setLoadingCategorias(true)
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    } finally {
      setLoadingCategorias(false)
    }
  }

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  const getColorGradient = (color: string) => {
    const colorStyles: { [key: string]: string } = {
      'pink': 'from-pink-500 to-rose-500',
      'purple': 'from-purple-500 to-indigo-500',
      'blue': 'from-blue-500 to-cyan-500',
      'green': 'from-green-500 to-emerald-500',
      'orange': 'from-orange-500 to-amber-500',
      'cyan': 'from-cyan-500 to-teal-500',
      'indigo': 'from-indigo-500 to-blue-500',
      'red': 'from-red-500 to-pink-500',
      'gray': 'from-gray-500 to-slate-500'
    }
    return colorStyles[color] || colorStyles['gray']
  }

  const selectedCategoriaId = watch('categoriaId')
  const selectedCategoria = categorias.find((c: any) => c.id === selectedCategoriaId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre del Servicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="ej: Corte de cabello clásico"
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
              placeholder="Descripción breve del servicio"
              rows={3}
              {...register('descripcion')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoriaId">
              <Tag className="w-4 h-4 inline mr-1" />
              Categoría <span className="text-red-500">*</span>
            </Label>
            {loadingCategorias ? (
              <div className="flex items-center justify-center p-4 border rounded-md">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Cargando categorías...
              </div>
            ) : categorias.length === 0 ? (
              <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-sm">
                <p className="font-medium text-yellow-800">No hay categorías disponibles</p>
                <p className="text-yellow-600 mt-1">
                  Por favor, crea al menos una categoría antes de agregar servicios.
                </p>
              </div>
            ) : (
              <>
                <Select
                  value={selectedCategoriaId}
                  onValueChange={(value) => setValue('categoriaId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria: any) => {
                      const gradient = getColorGradient(categoria.color)
                      return (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                            {categoria.nombre}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {selectedCategoria && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getColorGradient(selectedCategoria.color)} text-white shadow-md`}>
                      {selectedCategoria.nombre}
                    </span>
                  </div>
                )}
                {errors.categoriaId && (
                  <span className="text-sm text-red-500">{errors.categoriaId.message}</span>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duracion">
                Duración (minutos) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duracion"
                type="number"
                min="5"
                step="5"
                {...register('duracion', { 
                  required: 'La duración es requerida',
                  valueAsNumber: true,
                  min: { value: 5, message: 'Mínimo 5 minutos' }
                })}
              />
              {errors.duracion && (
                <span className="text-sm text-red-500">{errors.duracion.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">
                Precio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                {...register('precio', { 
                  required: 'El precio es requerido',
                  valueAsNumber: true,
                  min: { value: 0, message: 'El precio debe ser positivo' }
                })}
              />
              {errors.precio && (
                <span className="text-sm text-red-500">{errors.precio.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={watch('activo')}
              onCheckedChange={(checked) => setValue('activo', checked)}
            />
            <Label htmlFor="activo">
              {watch('activo') ? 'Servicio activo' : 'Servicio inactivo'}
            </Label>
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
              disabled={isLoading || loadingCategorias || categorias.length === 0}
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
