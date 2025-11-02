"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign, Sparkles } from 'lucide-react'
import { EmpleadoList } from '@/components/empleados/EmpleadoList'
import { ClienteList } from '@/components/clientes/ClienteList'
import { ServicioList } from '@/components/servicios/ServicioList'
import { CitaList } from '@/components/citas/CitaList'
import { EstadisticasDashboard } from '@/components/estadisticas/EstadisticasDashboard'

export default function Home() {
  const [stats, setStats] = useState({
    totalCitas: 0,
    clientesHoy: 0,
    ingresosMes: 0,
    serviciosActivos: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header con gradiente */}
      <header className="mb-8 animate-card-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-purple p-4 rounded-2xl shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold gradient-text-purple">
                    Spa Madangel
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-lg">
                    Sistema de Gestión de Uñas y Belleza
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-purple text-white px-6 py-2 text-base font-semibold shadow-lg border-0">
                  👑 Administrador
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards con gradientes sólidos */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Primary (Azul) */}
          <div className="solid-card primary animate-stats-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Citas del Día</p>
                <h3 className="text-4xl font-bold">{stats.totalCitas}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/70 text-sm">
              {stats.clientesHoy} clientes únicos
            </p>
          </div>

          {/* Card 2 - Success (Verde) */}
          <div className="solid-card success animate-stats-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Clientes Activos</p>
                <h3 className="text-4xl font-bold">{stats.clientesHoy}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/70 text-sm">
              registrados este mes
            </p>
          </div>

          {/* Card 3 - Warning (Amarillo) */}
          <div className="solid-card warning animate-stats-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Ingresos del Mes</p>
                <h3 className="text-4xl font-bold">${stats.ingresosMes.toLocaleString()}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/70 text-sm">
              +12% vs mes anterior
            </p>
          </div>

          {/* Card 4 - Info (Cyan) */}
          <div className="solid-card info animate-stats-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Servicios Activos</p>
                <h3 className="text-4xl font-bold">{stats.serviciosActivos}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/70 text-sm">
              disponibles para reservar
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Principal */}
      <div className="max-w-7xl mx-auto animate-card-fade-in" style={{ animationDelay: '0.5s' }}>
        <Tabs defaultValue="citas" className="space-y-6">
          <TabsList className="bg-white/95 backdrop-blur-sm border border-white/20 p-2 h-auto flex-wrap gap-2 shadow-xl rounded-2xl">
            <TabsTrigger 
              value="citas" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger 
              value="clientes" 
              className="data-[state=active]:bg-gradient-success data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="empleados" 
              className="data-[state=active]:bg-gradient-warning data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Empleados
            </TabsTrigger>
            <TabsTrigger 
              value="servicios" 
              className="data-[state=active]:bg-gradient-info data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
            >
              <Package className="w-5 h-5 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger 
              value="estadisticas" 
              className="data-[state=active]:bg-gradient-purple data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citas" className="space-y-4">
            <CitaList />
          </TabsContent>

          <TabsContent value="clientes" className="space-y-4">
            <ClienteList />
          </TabsContent>

          <TabsContent value="empleados" className="space-y-4">
            <EmpleadoList />
          </TabsContent>

          <TabsContent value="servicios" className="space-y-4">
            <ServicioList />
          </TabsContent>

          <TabsContent value="estadisticas" className="space-y-4">
            <EstadisticasDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
