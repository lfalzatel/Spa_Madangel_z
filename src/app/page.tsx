"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign, CheckCircle, CalendarPlus, BriefcaseBusiness, XCircle  } from 'lucide-react'
import { EmpleadoList } from '@/components/empleados/EmpleadoList'
import { ClienteList } from '@/components/clientes/ClienteList'
import { ServicioList } from '@/components/servicios/ServicioList'
import { CitaList } from '@/components/citas/CitaList'
import { EstadisticasDashboard } from '@/components/estadisticas/EstadisticasDashboard'

export default function Home() {
  const [stats, setStats] = useState({
  citasHoy: 0,
  citasPendientes: 0,
  citasCompletadas: 0,
  serviciosActivos: 0
})
const [isLoading, setIsLoading] = useState(true)
const [activeTab, setActiveTab] = useState('citas')
// Estado para controlar el modal de nueva cita
const [triggerNewCita, setTriggerNewCita] = useState(0)
const [citaFilter, setCitaFilter] = useState(null) // ✅ añadido
  

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

  // Función para abrir modal de nueva cita
  const handleNuevaCita = () => {
    // Cambiar a tab de citas si no está ahí
    if (activeTab !== 'citas') {
      setActiveTab('citas')
    }
    // Incrementar para trigger el modal
    setTriggerNewCita(prev => prev + 1)
  }
const handleCardClick = (filterType) => {
  setCitaFilter(filterType)
  setActiveTab('citas')
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
      {/* HEADER PRINCIPAL MODERNO */}
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
                  <BriefcaseBusiness className="w-10 h-10 text-white" />
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
              
              {/* Badge y botón Nueva Cita FIJO */}
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white backdrop-blur-sm border-white/30 px-4 py-2 text-sm"
                >
                  Administrador
                </Badge>
                
                {/* BOTÓN NUEVA CITA - SIEMPRE VISIBLE */}
                <Button 
                  onClick={handleNuevaCita}
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Nueva Cita
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards - CLICKEABLES */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Tarjeta 1: Citas del Día - CLICKEABLE */}
          <Card 
            className="bg-white/80 backdrop-blur-sm border-pink-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleCardClick('hoy')}>
            <CardHeader className="solid-card primary animate-stats-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-white/80">
                Citas de Hoy</p>
              </CardTitle>
              <Calendar className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mt-2">
              {isLoading ? '...' : stats.citasHoy}
            </div>
            <p className="text-xs text-white/70 mt-1">
                Click para ver las citas de hoy
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Citas pendientes */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 cursor-pointer hover:shadow-lg transition-all"  
          onClick={() => handleCardClick('pendientes')}>
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
          </Card>

          {/* Tarjeta 3: Citas Canceladas - CLICKEABLE (reemplaza Ingresos del Mes) */}
          <Card 
            className="bg-white/80 backdrop-blur-sm border-red-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleCardClick('canceladas')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Citas Canceladas
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.citasCanceladas}</div>
              <p className="text-xs text-red-600">
                Click para ver cancelaciones
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta 4: Citas Completadas - CLICKEABLE */}
          <Card 
            className="bg-white/80 backdrop-blur-sm border-green-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleCardClick('completadas')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Citas Completadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.citasCompletadas}</div>
              <p className="text-xs text-green-600">
                Click para ver completadas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="citas" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger value="clientes" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="empleados" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4 mr-2" />
              Empleados
            </TabsTrigger>
            <TabsTrigger value="servicios" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger value="estadisticas" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citas" className="space-y-4">
            <CitaList filterType={citaFilter} onClearFilter={() => setCitaFilter(null)} />
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
