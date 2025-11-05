import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const servicios = await db.servicio.findMany({
      where: { activo: true },
      orderBy: { categoria: 'asc' }
    })
    
    return NextResponse.json(servicios)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion, duracion, precio, categoria } = body

    if (!nombre || !duracion || !precio || !categoria) {
      return NextResponse.json(
        { error: 'Nombre, duración, precio y categoría son requeridos' },
        { status: 400 }
      )
    }

    const servicio = await db.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: parseInt(duracion),
        precio: parseFloat(precio),
        categoria
      }
    })

    return NextResponse.json(servicio, { status: 201 })
  } catch (error) {
    console.error('Error al crear servicio:', error)
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    )
  }
}