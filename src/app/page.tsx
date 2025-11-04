"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, UserCheck, Package, TrendingUp, Clock, DollarSign, XCircle, CheckCircle } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-pink-800">
                Spa Madangel
              </h1>
              <p className="text-pink-600 mt-2">
                Sistema de Gestión de Uñas y Belleza
              </p>
            </div>
            <div className="flex items-center gap-2">
            <button onclick="{handleNewCita}" class="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all">
                <plus class="w-4 h-4 mr-2">
                Nueva Cita
              </plus></button>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                Administrador
              </Badge>
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
            onClick={() => handleCardClick('hoy')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">
                Citas del Día
              </CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">{stats.citasHoy}</div>
              <p className="text-xs text-pink-600">
                Click para ver las citas de hoy
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Citas pendientes */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 cursor-pointer hover:shadow-lg transition-all"  
          onClick={() => handleCardClick('pendientes')}>
            <cardheader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <cardtitle class="text-sm font-medium text-purple-700">
                Citas Pendientes
              </cardtitle>
              <clock class="h-4 w-4 text-purple-600">
            </clock></cardheader>
            <cardcontent>
              <div class="text-2xl font-bold text-purple-900">{stats.citasPendientes}</div>
              <p class="text-xs text-purple-600">
                Click para ver citas pendientes
              </p>
            </cardcontent>
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
