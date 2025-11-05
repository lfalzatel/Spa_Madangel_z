import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cita = await db.cita.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        empleado: true,
        servicio: true
      }
    })

    if (!cita) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(cita)
  } catch (error) {
    console.error('Error al obtener cita:', error)
    return NextResponse.json(
      { error: 'Error al obtener cita' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { clienteId, empleadoId, servicioId, fecha, horaInicio, estado, notas } = body

    // Si se cambia el servicio, recalcular duración y precio
    let horaFin = body.horaFin
    let total = body.total

    if (servicioId && servicioId !== body.servicioId) {
      const servicio = await db.servicio.findUnique({
        where: { id: servicioId }
      })

      if (servicio) {
        const [hours, minutes] = horaInicio.split(':').map(Number)
        const startTime = new Date()
        startTime.setHours(hours, minutes, 0, 0)
        const endTime = new Date(startTime.getTime() + servicio.duracion * 60000)
        horaFin = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`
        total = servicio.precio
      }
    }

    const cita = await db.cita.update({
      where: { id: params.id },
      data: {
        clienteId,
        empleadoId,
        servicioId,
        fecha: fecha ? new Date(fecha) : undefined,
        horaInicio,
        horaFin,
        estado,
        notas,
        total
      },
      include: {
        cliente: true,
        empleado: true,
        servicio: true
      }
    })

    return NextResponse.json(cita)
  } catch (error) {
    console.error('Error al actualizar cita:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cita' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cita.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Cita eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar cita:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cita' },
      { status: 500 }
    )
  }
}