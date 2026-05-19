import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/copyrights/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const copyright = await prisma.softwareCopyright.findUnique({ where: { id } });

    if (!copyright) {
      return NextResponse.json({ error: "软著不存在" }, { status: 404 });
    }

    return NextResponse.json(copyright);
  } catch (error) {
    console.error("Error fetching copyright:", error);
    return NextResponse.json({ error: "获取软著失败" }, { status: 500 });
  }
}

// PUT /api/copyrights/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, registrationNumber, version, registrationDate } = body;

    const copyright = await prisma.softwareCopyright.update({
      where: { id },
      data: {
        name,
        registrationNumber,
        version,
        registrationDate: registrationDate ? new Date(registrationDate) : null,
      },
    });

    return NextResponse.json(copyright);
  } catch (error) {
    console.error("Error updating copyright:", error);
    return NextResponse.json({ error: "更新软著失败" }, { status: 500 });
  }
}

// DELETE /api/copyrights/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.softwareCopyright.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting copyright:", error);
    return NextResponse.json({ error: "删除软著失败" }, { status: 500 });
  }
}
