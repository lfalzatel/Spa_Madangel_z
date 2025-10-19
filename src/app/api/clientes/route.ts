import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clientes = await db.cliente.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, apellido, email, telefono, direccion, fechaNacimiento, notas } = body

    if (!nombre || !apellido || !email || !telefono) {
      return NextResponse.json(
        { error: 'Nombre, apellido, email y teléfono son requeridos' },
        { status: 400 }
      )
    }

    const cliente = await db.cliente.create({
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

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Error al crear cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}