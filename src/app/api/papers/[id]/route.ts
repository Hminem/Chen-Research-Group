import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/papers/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paper = await prisma.publication.findUnique({
      where: { id },
    });

    if (!paper) {
      return NextResponse.json({ error: "论文不存在" }, { status: 404 });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json({ error: "获取论文失败" }, { status: 500 });
  }
}

// PUT /api/papers/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, authors, journal, year, doi, abstract } = body;

    const paper = await prisma.publication.update({
      where: { id },
      data: { title, authors, journal, year, doi, abstract },
    });

    return NextResponse.json(paper);
  } catch (error) {
    console.error("Error updating paper:", error);
    return NextResponse.json({ error: "更新论文失败" }, { status: 500 });
  }
}

// DELETE /api/papers/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting paper:", error);
    return NextResponse.json({ error: "删除论文失败" }, { status: 500 });
  }
}
