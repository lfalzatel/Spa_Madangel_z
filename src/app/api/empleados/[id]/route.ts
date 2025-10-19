import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empleado = await db.empleado.findUnique({
      where: { id: params.id }
    })

    if (!empleado) {
      return NextResponse.json(
        { error: 'Empleado no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(empleado)
  } catch (error) {
    console.error('Error al obtener empleado:', error)
    return NextResponse.json(
      { error: 'Error al obtener empleado' },
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
    const { nombre, apellido, email, telefono, especialidad, activo } = body

    const empleado = await db.empleado.update({
      where: { id: params.id },
      data: {
        nombre,
        apellido,
        email,
        telefono,
        especialidad,
        activo
      }
    })

    return NextResponse.json(empleado)
  } catch (error) {
    console.error('Error al actualizar empleado:', error)
    return NextResponse.json(
      { error: 'Error al actualizar empleado' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.empleado.update({
      where: { id: params.id },
      data: { activo: false }
    })

    return NextResponse.json({ message: 'Empleado eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar empleado:', error)
    return NextResponse.json(
      { error: 'Error al eliminar empleado' },
      { status: 500 }
    )
  }
}