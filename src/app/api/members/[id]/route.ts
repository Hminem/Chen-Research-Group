import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/members/[id] - 获取单个成员
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        publications: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "成员不存在" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "获取成员失败" }, { status: 500 });
  }
}

// PUT /api/members/[id] - 更新成员
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, title, researchDirection, bio, email, displayOrder, isGraduated, graduationYear } = body;

    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        title,
        researchDirection,
        bio,
        email,
        displayOrder,
        isGraduated,
        graduationYear,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "更新成员失败" }, { status: 500 });
  }
}

// DELETE /api/members/[id] - 删除成员
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "删除成员失败" }, { status: 500 });
  }
}
