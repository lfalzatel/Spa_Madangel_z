// 📁 src/app/api/categorias/route.ts
// API para gestión de Categorías de Servicios

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categorias = await db.categoria.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: {
        _count: {
          select: { servicios: true }
        }
      }
    })
    
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion, color, icono, orden } = body

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una categoría con ese nombre
    const existente = await db.categoria.findUnique({
      where: { nombre }
    })

    if (existente) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }

    const categoria = await db.categoria.create({
      data: {
        nombre,
        descripcion,
        color: color || 'gray',
        icono,
        orden: orden || 0
      }
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    )
  }
}
