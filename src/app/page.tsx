"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign, CheckCircle, Plus, CalendarPlus, UserPlus, Briefcase } from 'lucide-react'
import { EmpleadoList } from '@/components/empleados/EmpleadoList'
import { ClienteList } from '@/components/clientes/ClienteList'
import { ServicioList } from '@/components/servicios/ServicioList'
import { CitaList } from '@/components/citas/CitaList'
import { EstadisticasDashboard } from '@/components/estadisticas/EstadisticasDashboard'

export default function Home() {
  const [stats, setStats] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    ingresosMes: 0,
    citasCompletadasMes: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('citas')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/citas')
      const citas = await response.json()

      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      
      const manana = new Date(hoy)
      manana.setDate(manana.getDate() + 1)

      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)

      const citasHoy = citas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha)
        fechaCita.setHours(0, 0, 0, 0)
        return fechaCita.getTime() === hoy.getTime()
      }).length

      const citasPendientes = citas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha)
        fechaCita.setHours(0, 0, 0, 0)
        return (cita.estado === 'programada' || cita.estado === 'confirmada') && 
               fechaCita >= hoy
      }).length

      const ingresosMes = citas
        .filter((cita: any) => {
          const fechaCita = new Date(cita.fecha)
          return cita.estado === 'completada' && 
                 fechaCita >= inicioMes && 
                 fechaCita <= finMes
        })
        .reduce((total: number, cita: any) => total + (cita.total || 0), 0)

      const citasCompletadasMes = citas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha)
        return cita.estado === 'completada' && 
               fechaCita >= inicioMes && 
               fechaCita <= finMes
      }).length

      setStats({
        citasHoy,
        citasPendientes,
        ingresosMes,
        citasCompletadasMes
      })
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener el botón de acción según el tab activo
  const getActionButton = () => {
    const buttons = {
      citas: {
        label: 'Nueva Cita',
        icon: <CalendarPlus className="w-4 h-4 mr-2" />,
        onClick: () => {/* Trigger nueva cita */}
      },
      
      estadisticas: null
    }

    return buttons[activeTab as keyof typeof buttons]
  }

  const actionButton = getActionButton()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 p-4 md:p-6">
      {/* 🆕 HEADER PRINCIPAL MODERNO */}
      <header className="mb-8 animate-card-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-8 shadow-2xl">
            {/* Efectos decorativos */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            {/* Contenido del header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Spa Madangel
                  </h1>
                  <p className="text-white/90 text-base">
                    Sistema de Gestión de Uñas y Belleza
                  </p>
                </div>
              </div>
              
              {/* Badge y botón de acción */}
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white backdrop-blur-sm border-white/30 px-4 py-2 text-sm"
                >
                  Administrador
                </Badge>
                
                {/* Botón de acción contextual */}
                {actionButton && (
                  <Button 
                    onClick={actionButton.onClick}
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    {actionButton.icon}
                    {actionButton.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. CITAS DE HOY */}
          <div className="solid-card primary animate-stats-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Citas de Hoy
              </p>
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {isLoading ? '...' : stats.citasHoy}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Agendadas para hoy
            </p>
          </div>

          {/* 2. CITAS PENDIENTES */}
          <div className="solid-card warning animate-stats-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Citas Pendientes
              </p>
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {isLoading ? '...' : stats.citasPendientes}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Por atender (hoy y futuras)
            </p>
          </div>

          {/* 3. INGRESOS DEL MES */}
          <div className="solid-card success animate-stats-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Ingresos del Mes
              </p>
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {isLoading ? '...' : `$${stats.ingresosMes.toLocaleString('es-CO')}`}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Solo citas completadas
            </p>
          </div>

          {/* 4. CITAS COMPLETADAS DEL MES */}
          <div className="solid-card purple animate-stats-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white/80">
                Completadas Este Mes
              </p>
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {isLoading ? '...' : stats.citasCompletadasMes}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Servicios finalizados
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto animate-card-fade-in" style={{ animationDelay: '0.3s' }}>
        <Tabs 
          defaultValue="citas" 
          className="space-y-6"
          onValueChange={(value) => setActiveTab(value)}
        >
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