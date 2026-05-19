import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/algorithms
export async function GET() {
  try {
    const algorithms = await prisma.algorithm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(algorithms);
  } catch (error) {
    console.error("Error fetching algorithms:", error);
    return NextResponse.json({ error: "获取算法失败" }, { status: 500 });
  }
}

// POST /api/algorithms
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, useCases, readmeContent } = body;

    const algorithm = await prisma.algorithm.create({
      data: {
        name,
        description,
        useCases,
        readmeContent,
      },
    });

    return NextResponse.json(algorithm, { status: 201 });
  } catch (error) {
    console.error("Error creating algorithm:", error);
    return NextResponse.json({ error: "创建算法失败" }, { status: 500 });
  }
}
