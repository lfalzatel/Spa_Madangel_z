import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await db.cliente.findUnique({
      where: { id: params.id },
      include: {
        citas: {
          include: {
            servicio: true,
            empleado: true
          },
          orderBy: { fecha: 'desc' }
        }
      }
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al obtener cliente:', error)
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
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
    const { nombre, apellido, email, telefono, direccion, fechaNacimiento, notas } = body

    const cliente = await db.cliente.update({
      where: { id: params.id },
      data: {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        notas
      }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cliente.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}