import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const assembly = await prisma.assembly.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(assembly)
  } catch (error) {
    console.error('Error creating assembly:', error)
    return NextResponse.json(
      { error: 'Failed to create assembly' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const assemblies = await prisma.assembly.findMany({
      where: {
        userId: userId || undefined,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(assemblies)
  } catch (error) {
    console.error('Error fetching assemblies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assemblies' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const assembly = await prisma.assembly.findUnique({
      where: { id },
    })

    if (!assembly) {
      return NextResponse.json({ error: 'Assembly not found' }, { status: 404 })
    }

    if (assembly.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedAssembly = await prisma.assembly.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedAssembly)
  } catch (error) {
    console.error('Error updating assembly:', error)
    return NextResponse.json(
      { error: 'Failed to update assembly' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing assembly ID' }, { status: 400 })
  }

  try {
    const assembly = await prisma.assembly.findUnique({
      where: { id },
    })

    if (!assembly) {
      return NextResponse.json({ error: 'Assembly not found' }, { status: 404 })
    }

    if (assembly.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.assembly.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assembly:', error)
    return NextResponse.json(
      { error: 'Failed to delete assembly' },
      { status: 500 }
    )
  }
} 