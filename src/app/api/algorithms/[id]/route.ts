import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/algorithms/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const algorithm = await prisma.algorithm.findUnique({ where: { id } });

    if (!algorithm) {
      return NextResponse.json({ error: "算法不存在" }, { status: 404 });
    }

    return NextResponse.json(algorithm);
  } catch (error) {
    console.error("Error fetching algorithm:", error);
    return NextResponse.json({ error: "获取算法失败" }, { status: 500 });
  }
}

// PUT /api/algorithms/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, useCases, readmeContent } = body;

    const algorithm = await prisma.algorithm.update({
      where: { id },
      data: {
        name,
        description,
        useCases,
        readmeContent,
      },
    });

    return NextResponse.json(algorithm);
  } catch (error) {
    console.error("Error updating algorithm:", error);
    return NextResponse.json({ error: "更新算法失败" }, { status: 500 });
  }
}

// DELETE /api/algorithms/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.algorithm.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting algorithm:", error);
    return NextResponse.json({ error: "删除算法失败" }, { status: 500 });
  }
}
