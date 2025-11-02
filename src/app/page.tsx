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
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                Administrador
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">
                Citas del Día
              </CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">{stats.totalCitas}</div>
              <p className="text-xs text-pink-600">
                +2% respecto a ayer
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Clientes Hoy
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.clientesHoy}</div>
              <p className="text-xs text-purple-600">
                +5% respecto a la semana pasada
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
              <div className="text-2xl font-bold text-green-900">${stats.ingresosMes}</div>
              <p className="text-xs text-green-600">
                +12% respecto al mes pasado
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
                Todos disponibles
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="citas" className="space-y-6">
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