import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Citas de hoy
    const citasHoy = await db.cita.count({
      where: {
        fecha: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Clientes únicos hoy
    const clientesHoy = await db.cita.groupBy({
      by: ['clienteId'],
      where: {
        fecha: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Ingresos del mes
    const citasMes = await db.cita.findMany({
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        estado: 'completada'
      }
    })

    const ingresosMes = citasMes.reduce((total, cita) => total + cita.total, 0)

    // Servicios activos
    const serviciosActivos = await db.servicio.count({
      where: { activo: true }
    })

    // Empleados activos
    const empleadosActivos = await db.empleado.count({
      where: { activo: true }
    })

    // Total clientes
    const totalClientes = await db.cliente.count()

    // Citas por estado
    const citasPorEstado = await db.cita.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      },
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Servicios más populares
    const serviciosPopulares = await db.cita.groupBy({
      by: ['servicioId'],
      _count: {
        servicioId: true
      },
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        estado: 'completada'
      },
      orderBy: {
        _count: {
          servicioId: 'desc'
        }
      },
      take: 5
    })

    // Obtener detalles de servicios populares
    const serviciosPopularesDetalles = await Promise.all(
      serviciosPopulares.map(async (item) => {
        const servicio = await db.servicio.findUnique({
          where: { id: item.servicioId }
        })
        return {
          ...servicio,
          citas: item._count.servicioId
        }
      })
    )

    // Citas de los últimos 7 días
    const hace7Dias = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const citasUltimos7Dias = await db.cita.findMany({
      where: {
        fecha: {
          gte: hace7Dias,
          lte: endOfDay
        }
      },
      select: {
        fecha: true,
        total: true,
        estado: true
      },
      orderBy: {
        fecha: 'asc'
      }
    })

    // Agrupar por día
    const citasPorDia = citasUltimos7Dias.reduce((acc: any, cita) => {
      const dia = cita.fecha.toISOString().split('T')[0]
      if (!acc[dia]) {
        acc[dia] = { fecha: dia, citas: 0, ingresos: 0 }
      }
      acc[dia].citas += 1
      if (cita.estado === 'completada') {
        acc[dia].ingresos += cita.total
      }
      return acc
    }, {})

    const stats = {
      citasHoy,
      clientesHoy: clientesHoy.length,
      ingresosMes,
      serviciosActivos,
      empleadosActivos,
      totalClientes,
      citasPorEstado,
      serviciosPopulares: serviciosPopularesDetalles,
      citasPorDia: Object.values(citasPorDia)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}