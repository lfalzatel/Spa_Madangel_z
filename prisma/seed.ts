// ============================================================================
// SEED DE SERVICIOS PARA SPA MADANGEL
// Prisma Seed Script
// Precios: Rionegro, Antioquia, Colombia (COP)
// ============================================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const servicios = [
  // ========== MANICURA Y UÑAS ==========
  {
    id: 'srv_001',
    nombre: 'Manicure Clásico',
    descripcion: 'Limpieza, corte, limado, y esmalte regular.',
    duracion: 45,
    precio: 25000.00,
    categoria: 'Manicura',
    activo: true
  },
  {
    id: 'srv_002',
    nombre: 'Manicura en Gel',
    descripcion: 'Esmalte en gel de larga duración con diseño básico.',
    duracion: 60,
    precio: 55000.00,
    categoria: 'Uñas de Gel',
    activo: true
  },
  {
    id: 'srv_003',
    nombre: 'Esmalte Semipermanente',
    descripcion: 'Esmalte de larga duración (2–3 semanas).',
    duracion: 90,
    precio: 45000.00,
    categoria: 'Manicura',
    activo: true
  },
  {
    id: 'srv_004',
    nombre: 'Acrílicas Completas',
    descripcion: 'Aplicación de uñas acrílicas con esmalte.',
    duracion: 95,
    precio: 135000.00,
    categoria: 'Uñas Acrílicas',
    activo: true
  },
  {
    id: 'srv_005',
    nombre: 'Refuerzo de Uñas en Gel',
    descripcion: 'Relleno y mantenimiento de uñas en gel para mantener su look y durabilidad.',
    duracion: 45,
    precio: 40000.00,
    categoria: 'Uñas de Gel',
    activo: true
  },
  {
    id: 'srv_006',
    nombre: 'Retiro de Esmalte (Semipermanente/Gel)',
    descripcion: 'Remoción segura de esmalte semipermanente o gel sin dañar la uña natural.',
    duracion: 30,
    precio: 15000.00,
    categoria: 'Manicura',
    activo: true
  },
  {
    id: 'srv_007',
    nombre: 'Diseño Francés',
    descripcion: 'El clásico y elegante diseño de uñas francesas, con esmalte semipermanente.',
    duracion: 60,
    precio: 50000.00,
    categoria: 'Arte en Uñas',
    activo: true
  },
  {
    id: 'srv_008',
    nombre: 'Decoración de Uñas (Nail Art)',
    descripcion: 'Diseños personalizados con decoraciones (piedras, stickers, purpurina, etc.).',
    duracion: 60,
    precio: 35000.00,
    categoria: 'Arte en Uñas',
    activo: true
  },
  {
    id: 'srv_009',
    nombre: 'Tratamiento de Cutículas',
    descripcion: 'Hidratación y cuidado profundo de la cutícula para mejorar la salud de la uña.',
    duracion: 20,
    precio: 18000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_010',
    nombre: 'Mascarilla de Manos',
    descripcion: 'Tratamiento hidratante y nutritivo para suavizar y rejuvenecer las manos.',
    duracion: 15,
    precio: 20000.00,
    categoria: 'Spa de Manos',
    activo: true
  },

  // ========== PEDICURA Y PIES ==========
  {
    id: 'srv_011',
    nombre: 'Pedicure Clásica',
    descripcion: 'Limpieza, corte, limado y esmalte regular para pies.',
    duracion: 50,
    precio: 31000.00,
    categoria: 'Pedicura',
    activo: true
  },
  {
    id: 'srv_012',
    nombre: 'Pedicure Spa',
    descripcion: 'Pedicura con masaje y exfoliación.',
    duracion: 75,
    precio: 75000.00,
    categoria: 'Spa de Pies',
    activo: true
  },
  {
    id: 'srv_013',
    nombre: 'Pedicure Terapéutica',
    descripcion: 'Tratamiento enfocado en problemas comunes como callosidades, durezas y hongos.',
    duracion: 90,
    precio: 85000.00,
    categoria: 'Spa de Pies',
    activo: true
  },

  // ========== CEJAS Y PESTAÑAS ==========
  {
    id: 'srv_014',
    nombre: 'Diseño de Cejas (Brow Shaping)',
    descripcion: 'Perfilado profesional de cejas con pinza, hilo o cera según la forma del rostro.',
    duracion: 30,
    precio: 20000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_015',
    nombre: 'Ondulación de Pestañas (Lash Lifting)',
    descripcion: 'Ondulación de pestañas naturales con tinte para mayor curvatura y definición, sin extensiones.',
    duracion: 45,
    precio: 94000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_016',
    nombre: 'Pestañas Tecnológicas (Tech Lashes)',
    descripcion: 'Extensiones de pestañas con efecto 3D, volumen ruso o Black Velvet para un look impactante.',
    duracion: 90,
    precio: 150000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_017',
    nombre: 'Microblading',
    descripcion: 'Micropigmentación semipermanente para diseñar y rellenar las cejas con un efecto hiperrealista de pelo a pelo.',
    duracion: 120,
    precio: 180000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_018',
    nombre: 'Tinte de Cejas y Pestañas',
    descripcion: 'Aplicación de tinte profesional para dar color y definición a las cejas y/o pestañas.',
    duracion: 25,
    precio: 25000.00,
    categoria: 'Tratamientos',
    activo: true
  },

  // ========== FACIALES Y SPA ==========
  {
    id: 'srv_019',
    nombre: 'Limpieza Facial Profunda',
    descripcion: 'Extracción de impurezas, exfoliación, mascarilla personalizada y protección solar.',
    duracion: 75,
    precio: 70000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_020',
    nombre: 'Hidratación Facial',
    descripcion: 'Tratamiento con activos hidratantes para piel seca o deshidratada.',
    duracion: 60,
    precio: 55000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_021',
    nombre: 'Mascarilla Facial Personalizada',
    descripcion: 'Aplicación de una mascarilla específica según las necesidades de tu piel (anti-acné, iluminadora, anti-edad, etc.).',
    duracion: 30,
    precio: 35000.00,
    categoria: 'Tratamientos',
    activo: true
  },
  {
    id: 'srv_022',
    nombre: 'Masaje Descontracturante',
    descripcion: 'Masaje profundo enfocado en liberar nudos musculares y tensión acumulada.',
    duracion: 60,
    precio: 70000.00,
    categoria: 'Tratamientos',
    activo: true
  },

  // ========== PAQUETES ESPECIALES ==========
  {
    id: 'srv_023',
    nombre: 'Paquete Novia Especial',
    descripcion: 'Incluye: Manicura en Gel, Pedicure Spa y Diseño de Cejas. La preparación perfecta para tu día especial.',
    duracion: 240,
    precio: 180000.00,
    categoria: 'Otros',
    activo: true
  },
  {
    id: 'srv_024',
    nombre: 'Paquete Día de Spa',
    descripcion: 'Incluye: Pedicure Spa, Limpieza Facial Profunda y Mascarilla de Manos. Un día completo de relax.',
    duracion: 180,
    precio: 160000.00,
    categoria: 'Otros',
    activo: true
  }
]

async function main() {
  console.log('🌱 Iniciando seed de servicios...')

  // Usar upsert para evitar duplicados
  for (const servicio of servicios) {
    await prisma.servicio.upsert({
      where: { id: servicio.id },
      update: servicio,
      create: servicio
    })
    console.log(`✅ ${servicio.nombre} - $${servicio.precio.toLocaleString('es-CO')}`)
  }

  console.log('🎉 Seed completado exitosamente!')
  console.log(`📊 Total de servicios: ${servicios.length}`)
  
  // Mostrar resumen por categoría
  const categorias = await prisma.servicio.groupBy({
    by: ['categoria'],
    _count: true
  })
  
  console.log('\n📋 Servicios por categoría:')
  categorias.forEach(cat => {
    console.log(`   ${cat.categoria}: ${cat._count} servicios`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })