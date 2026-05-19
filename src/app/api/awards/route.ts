import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/awards
export async function GET() {
  try {
    const awards = await prisma.award.findMany({
      orderBy: { year: "desc" },
    });
    return NextResponse.json(awards);
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json({ error: "获取获奖记录失败" }, { status: 500 });
  }
}

// POST /api/awards
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, competition, level, winners, year, description, imageUrl } = body;

    const award = await prisma.award.create({
      data: {
        name,
        competition,
        level,
        winners,
        year: parseInt(year),
        description,
        imageUrl,
      },
    });

    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json({ error: "创建获奖记录失败" }, { status: 500 });
  }
}
