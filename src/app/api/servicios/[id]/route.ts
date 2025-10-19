import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const servicio = await db.servicio.findUnique({
      where: { id: params.id }
    })

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(servicio)
  } catch (error) {
    console.error('Error al obtener servicio:', error)
    return NextResponse.json(
      { error: 'Error al obtener servicio' },
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
    const { nombre, descripcion, duracion, precio, categoria, activo } = body

    const servicio = await db.servicio.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
        duracion: parseInt(duracion),
        precio: parseFloat(precio),
        categoria,
        activo
      }
    })

    return NextResponse.json(servicio)
  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.servicio.update({
      where: { id: params.id },
      data: { activo: false }
    })

    return NextResponse.json({ message: 'Servicio eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    )
  }
}