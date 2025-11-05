// 📁 src/app/api/citas/[id]/route.ts (ACTUALIZADO)
// API actualizada para operaciones individuales de citas

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener una cita específica
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
        servicio: {
          include: {
            categoria: true  // ✨ Incluir categoría
          }
        }
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

// PUT - Actualizar cita
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { clienteId, empleadoId, servicioId, fecha, horaInicio, notas, estado } = body

    // Verificar si la cita existe
    const citaExistente = await db.cita.findUnique({
      where: { id: params.id }
    })

    if (!citaExistente) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    // Si se cambió el servicio, recalcular hora de fin y precio
    let horaFin = citaExistente.horaFin
    let total = citaExistente.total

    if (servicioId && servicioId !== citaExistente.servicioId) {
      const servicio = await db.servicio.findUnique({
        where: { id: servicioId }
      })

      if (!servicio) {
        return NextResponse.json(
          { error: 'Servicio no encontrado' },
          { status: 404 }
        )
      }

      const horaInicioActual = horaInicio || citaExistente.horaInicio
      const [horas, minutos] = horaInicioActual.split(':').map(Number)
      const totalMinutos = horas * 60 + minutos + servicio.duracion
      horaFin = `${Math.floor(totalMinutos / 60).toString().padStart(2, '0')}:${(totalMinutos % 60).toString().padStart(2, '0')}`
      total = servicio.precio
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
        servicio: {
          include: {
            categoria: true  // ✨ Incluir categoría
          }
        }
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

// DELETE - Eliminar (o cancelar) cita
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // En lugar de eliminar, cambiar estado a 'cancelada'
    const cita = await db.cita.update({
      where: { id: params.id },
      data: { estado: 'cancelada' },
      include: {
        cliente: true,
        empleado: true,
        servicio: {
          include: {
            categoria: true  // ✨ Incluir categoría
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Cita cancelada exitosamente',
      cita 
    })
  } catch (error) {
    console.error('Error al cancelar cita:', error)
    return NextResponse.json(
      { error: 'Error al cancelar cita' },
      { status: 500 }
    )
  }
}