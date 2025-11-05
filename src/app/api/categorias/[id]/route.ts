// 📁 src/app/api/categorias/[id]/route.ts
// API para actualizar y eliminar categorías específicas

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener una categoría específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoria = await db.categoria.findUnique({
      where: { id: params.id },
      include: {
        servicios: true,
        _count: {
          select: { servicios: true }
        }
      }
    })

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nombre, descripcion, color, icono, orden, activo } = body

    // Verificar si la categoría existe
    const categoriaExistente = await db.categoria.findUnique({
      where: { id: params.id }
    })

    if (!categoriaExistente) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
    if (nombre && nombre !== categoriaExistente.nombre) {
      const nombreDuplicado = await db.categoria.findUnique({
        where: { nombre }
      })

      if (nombreDuplicado) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese nombre' },
          { status: 400 }
        )
      }
    }

    const categoria = await db.categoria.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
        color,
        icono,
        orden,
        activo
      }
    })

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar (desactivar) categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar si hay servicios asociados
    const serviciosCount = await db.servicio.count({
      where: { categoriaId: params.id }
    })

    if (serviciosCount > 0) {
      return NextResponse.json(
        { 
          error: 'No se puede eliminar la categoría porque tiene servicios asociados',
          serviciosCount 
        },
        { status: 400 }
      )
    }

    // En lugar de eliminar, desactivamos la categoría
    const categoria = await db.categoria.update({
      where: { id: params.id },
      data: { activo: false }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Categoría desactivada exitosamente',
      categoria 
    })
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    )
  }
}
