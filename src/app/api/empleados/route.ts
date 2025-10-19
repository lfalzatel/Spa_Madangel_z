import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const empleados = await db.empleado.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(empleados)
  } catch (error) {
    console.error('Error al obtener empleados:', error)
    return NextResponse.json(
      { error: 'Error al obtener empleados' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, apellido, email, telefono, especialidad } = body

    if (!nombre || !apellido || !email) {
      return NextResponse.json(
        { error: 'Nombre, apellido y email son requeridos' },
        { status: 400 }
      )
    }

    const empleado = await db.empleado.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        especialidad
      }
    })

    return NextResponse.json(empleado, { status: 201 })
  } catch (error) {
    console.error('Error al crear empleado:', error)
    return NextResponse.json(
      { error: 'Error al crear empleado' },
      { status: 500 }
    )
  }
}