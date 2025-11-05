// 📁 scripts/seed-categorias.ts
// Script para crear las categorías iniciales en la base de datos

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categoriasIniciales = [
  {
    nombre: 'Manicura',
    descripcion: 'Servicios de cuidado y embellecimiento de manos',
    color: 'pink',
    orden: 1
  },
  {
    nombre: 'Pedicura',
    descripcion: 'Servicios de cuidado y embellecimiento de pies',
    color: 'purple',
    orden: 2
  },
  {
    nombre: 'Uñas Acrílicas',
    descripcion: 'Aplicación y diseño de uñas acrílicas',
    color: 'blue',
    orden: 3
  },
  {
    nombre: 'Uñas de Gel',
    descripcion: 'Aplicación y diseño de uñas de gel',
    color: 'green',
    orden: 4
  },
  {
    nombre: 'Arte en Uñas',
    descripcion: 'Diseños artísticos y decoración de uñas',
    color: 'orange',
    orden: 5
  },
  {
    nombre: 'Spa de Manos',
    descripcion: 'Tratamientos de spa y relajación para manos',
    color: 'cyan',
    orden: 6
  },
  {
    nombre: 'Spa de Pies',
    descripcion: 'Tratamientos de spa y relajación para pies',
    color: 'indigo',
    orden: 7
  },
  {
    nombre: 'Tratamientos',
    descripcion: 'Tratamientos especiales y terapéuticos',
    color: 'red',
    orden: 8
  },
  // ✨ NUEVA CATEGORÍA SOLICITADA
  {
    nombre: 'Peinados',
    descripcion: 'Cortes de cabello, peinados y estilismo capilar',
    color: 'indigo',
    orden: 9
  },
  {
    nombre: 'Otros',
    descripcion: 'Otros servicios del spa',
    color: 'gray',
    orden: 10
  }
]

async function main() {
  console.log('🌱 Iniciando seed de categorías...')
  
  for (const categoria of categoriasIniciales) {
    try {
      const categoriaCreada = await prisma.categoria.upsert({
        where: { nombre: categoria.nombre },
        update: {},
        create: categoria
      })
      console.log(`✅ Categoría "${categoriaCreada.nombre}" creada/actualizada`)
    } catch (error) {
      console.error(`❌ Error al crear categoría "${categoria.nombre}":`, error)
    }
  }
  
  console.log('✨ Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
