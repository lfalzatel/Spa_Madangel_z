"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign, Star, BarChart3 } from 'lucide-react'

export function EstadisticasDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
        </CardContent>
      </Card>
    )
  }

  const getEstadoColor = (estado: string) => {
    const colors: { [key: string]: string } = {
      'programada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'no_asistio': 'bg-orange-100 text-orange-800'
    }
    return colors[estado] || 'bg-gray-100 text-gray-800'
  }

  const totalCitasMes = stats.citasPorEstado.reduce((total: number, item: any) => total + item._count.estado, 0)

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">
              Citas de Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">{stats.citasHoy}</div>
            <p className="text-xs text-pink-600">
              {stats.clientesHoy} clientes únicos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.totalClientes}</div>
            <p className="text-xs text-purple-600">
              {stats.clientesHoy} hoy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${stats.ingresosMes.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Servicios Activos
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.serviciosActivos}</div>
            <p className="text-xs text-orange-600">
              {stats.empleadosActivos} empleados activos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de citas del mes */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estado de Citas del Mes
            </CardTitle>
            <CardDescription>
              Distribución de citas por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.citasPorEstado.map((item: any) => {
                const percentage = totalCitasMes > 0 ? (item._count.estado / totalCitasMes) * 100 : 0
                return (
                  <div key={item.estado} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getEstadoColor(item.estado)}>
                        {item.estado.charAt(0).toUpperCase() + item.estado.slice(1).replace('_', ' ')}
                      </Badge>
                      <span className="text-sm font-medium">{item._count.estado} citas</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-gray-500 text-right">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Servicios más populares */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Servicios Más Populares
            </CardTitle>
            <CardDescription>
              Los servicios más solicitados este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.serviciosPopulares.map((servicio: any, index: number) => (
                <div key={servicio.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{servicio.nombre}</div>
                      <div className="text-sm text-gray-500">${servicio.precio.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{servicio.citas}</div>
                    <div className="text-sm text-gray-500">citas</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad de los últimos 7 días */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Actividad de los Últimos 7 Días
          </CardTitle>
          <CardDescription>
            Citas e ingresos diarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.citasPorDia.map((dia: any) => (
              <div key={dia.fecha} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <div className="font-medium">
                    {new Date(dia.fecha).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dia.citas} cita{dia.citas !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    ${dia.ingresos.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">ingresos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}