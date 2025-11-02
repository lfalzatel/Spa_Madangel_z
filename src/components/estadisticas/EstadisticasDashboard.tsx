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
            <Card key={i} className="animate-pulse bg-white/80">
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
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
        </CardContent>
      </Card>
    )
  }

  const getEstadoClass = (estado: string) => {
    const badges: { [key: string]: string } = {
      'programada': 'badge-pendiente',
      'completada': 'badge-completada',
      'cancelada': 'badge-cancelada',
      'confirmada': 'badge-confirmada',
      'no_asistio': 'badge-cancelada'
    }
    return badges[estado] || 'badge-pendiente'
  }

  const totalCitasMes = stats.citasPorEstado.reduce((total: number, item: any) => total + item._count.estado, 0)

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales con solid-card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="solid-card primary animate-stats-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-white/80">
              Citas de Hoy
            </p>
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.citasHoy}</div>
          <p className="text-xs text-white/70 mt-1">
            {stats.clientesHoy} clientes únicos
          </p>
        </div>

        <div className="solid-card purple animate-stats-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-white/80">
              Total Clientes
            </p>
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalClientes}</div>
          <p className="text-xs text-white/70 mt-1">
            {stats.clientesHoy} hoy
          </p>
        </div>

        <div className="solid-card success animate-stats-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-white/80">
              Ingresos del Mes
            </p>
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">${stats.ingresosMes.toFixed(2)}</div>
          <p className="text-xs text-white/70 mt-1">
            Total acumulado
          </p>
        </div>

        <div className="solid-card warning animate-stats-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-white/80">
              Servicios Activos
            </p>
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.serviciosActivos}</div>
          <p className="text-xs text-white/70 mt-1">
            {stats.empleadosActivos} empleados activos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de citas del mes */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/40 animate-card-fade-in" style={{ animationDelay: '0.5s' }}>
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
                      <span className={getEstadoClass(item.estado)}>
                        {item.estado.charAt(0).toUpperCase() + item.estado.slice(1).replace('_', ' ')}
                      </span>
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
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/40 animate-card-fade-in" style={{ animationDelay: '0.6s' }}>
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
                <div key={servicio.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold">
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
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/40 animate-card-fade-in" style={{ animationDelay: '0.7s' }}>
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
            {stats.citasPorDia.map((dia: any, index: number) => (
              <div key={dia.fecha} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
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