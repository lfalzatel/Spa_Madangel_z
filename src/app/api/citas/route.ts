import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    const clienteId = searchParams.get('clienteId')
    const empleadoId = searchParams.get('empleadoId')

    let whereClause: any = {}

    if (fecha) {
      const fechaObj = new Date(fecha)
      const startOfDay = new Date(fechaObj.setHours(0, 0, 0, 0))
      const endOfDay = new Date(fechaObj.setHours(23, 59, 59, 999))
      whereClause.fecha = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    if (clienteId) {
      whereClause.clienteId = clienteId
    }

    if (empleadoId) {
      whereClause.empleadoId = empleadoId
    }

    const citas = await db.cita.findMany({
      where: whereClause,
      include: {
        cliente: true,
        empleado: true,
        servicio: true
      },
      orderBy: [
        { fecha: 'asc' },
        { horaInicio: 'asc' }
      ]
    })
    
    return NextResponse.json(citas)
  } catch (error) {
    console.error('Error al obtener citas:', error)
    return NextResponse.json(
      { error: 'Error al obtener citas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clienteId, empleadoId, servicioId, fecha, horaInicio, notas } = body

    if (!clienteId || !empleadoId || !servicioId || !fecha || !horaInicio) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Obtener el servicio para calcular duración y precio
    const servicio = await db.servicio.findUnique({
      where: { id: servicioId }
    })

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    // Calcular hora fin
    const [hours, minutes] = horaInicio.split(':').map(Number)
    const startTime = new Date()
    startTime.setHours(hours, minutes, 0, 0)
    const endTime = new Date(startTime.getTime() + servicio.duracion * 60000)
    const horaFin = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`

    // Verificar disponibilidad
    const existingCita = await db.cita.findFirst({
      where: {
        empleadoId,
        fecha: new Date(fecha),
        OR: [
          {
            AND: [
              { horaInicio: { lte: horaInicio } },
              { horaFin: { gt: horaInicio } }
            ]
          },
          {
            AND: [
              { horaInicio: { lt: horaFin } },
              { horaFin: { gte: horaFin } }
            ]
          }
        ],
        estado: { not: 'cancelada' }
      }
    })

    if (existingCita) {
      return NextResponse.json(
        { error: 'El empleado ya tiene una cita en ese horario' },
        { status: 409 }
      )
    }

    const cita = await db.cita.create({
      data: {
        clienteId,
        empleadoId,
        servicioId,
        fecha: new Date(fecha),
        horaInicio,
        horaFin,
        notas,
        total: servicio.precio
      },
      include: {
        cliente: true,
        empleado: true,
        servicio: true
      }
    })

    return NextResponse.json(cita, { status: 201 })
  } catch (error) {
    console.error('Error al crear cita:', error)
    return NextResponse.json(
      { error: 'Error al crear cita' },
      { status: 500 }
    )
  }
}