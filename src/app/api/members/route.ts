import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/members - 获取成员列表
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "获取成员失败" }, { status: 500 });
  }
}

// POST /api/members - 创建成员
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, researchDirection, bio, email, displayOrder } = body;

    const member = await prisma.member.create({
      data: {
        name,
        title,
        researchDirection,
        bio,
        email,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "创建成员失败" }, { status: 500 });
  }
}
