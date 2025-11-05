// 📁 src/app/api/servicios/route.ts (ACTUALIZADO)
// API actualizada para usar categorías dinámicas

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const servicios = await db.servicio.findMany({
      where: { activo: true },
      include: {
        categoria: true // ✨ Incluir datos de la categoría
      },
      orderBy: { 
        categoria: {
          orden: 'asc'
        }
      }
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
    const { nombre, descripcion, duracion, precio, categoriaId } = body

    if (!nombre || !duracion || !precio || !categoriaId) {
      return NextResponse.json(
        { error: 'Nombre, duración, precio y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const categoria = await db.categoria.findUnique({
      where: { id: categoriaId }
    })

    if (!categoria) {
      return NextResponse.json(
        { error: 'La categoría seleccionada no existe' },
        { status: 400 }
      )
    }

    const servicio = await db.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: parseInt(duracion),
        precio: parseFloat(precio),
        categoriaId // ✨ Ahora usa categoriaId en lugar de categoria
      },
      include: {
        categoria: true
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
