"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 p-4 md:p-6">
      {/* Header */}
      <header className="mb-8 animate-card-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Spa Madangel
              </h1>
              <p className="text-blue-200 mt-2">
                Sistema de Gestión de Uñas y Belleza
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                Administrador
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards - Usando las nuevas clases solid-card */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="solid-card primary animate-stats-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Citas del Día
              </p>
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">{stats.totalCitas}</div>
            <p className="text-xs text-white/70 mt-1">
              +2% respecto a ayer
            </p>
          </div>

          <div className="solid-card purple animate-stats-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Clientes Hoy
              </p>
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">{stats.clientesHoy}</div>
            <p className="text-xs text-white/70 mt-1">
              +5% respecto a la semana pasada
            </p>
          </div>

          <div className="solid-card success animate-stats-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Ingresos del Mes
              </p>
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">${stats.ingresosMes}</div>
            <p className="text-xs text-white/70 mt-1">
              +12% respecto al mes pasado
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
              Todos disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto animate-card-fade-in" style={{ animationDelay: '0.3s' }}>
        <Tabs defaultValue="citas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger 
              value="citas" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 transition-all duration-300 text-white/70"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger 
              value="clientes" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 transition-all duration-300 text-white/70"
            >
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="empleados" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 transition-all duration-300 text-white/70"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Empleados
            </TabsTrigger>
            <TabsTrigger 
              value="servicios" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 transition-all duration-300 text-white/70"
            >
              <Package className="w-4 h-4 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger 
              value="estadisticas" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 transition-all duration-300 text-white/70"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
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