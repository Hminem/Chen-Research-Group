import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/patents/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patent = await prisma.patent.findUnique({ where: { id } });

    if (!patent) {
      return NextResponse.json({ error: "专利不存在" }, { status: 404 });
    }

    return NextResponse.json(patent);
  } catch (error) {
    console.error("Error fetching patent:", error);
    return NextResponse.json({ error: "获取专利失败" }, { status: 500 });
  }
}

// PUT /api/patents/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, patentNumber, patentType, status, applicationDate, authorizationDate, inventors } = body;

    const patent = await prisma.patent.update({
      where: { id },
      data: {
        name,
        patentNumber,
        patentType,
        status,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        authorizationDate: authorizationDate ? new Date(authorizationDate) : null,
        inventors,
      },
    });

    return NextResponse.json(patent);
  } catch (error) {
    console.error("Error updating patent:", error);
    return NextResponse.json({ error: "更新专利失败" }, { status: 500 });
  }
}

// DELETE /api/patents/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.patent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patent:", error);
    return NextResponse.json({ error: "删除专利失败" }, { status: 500 });
  }
}
