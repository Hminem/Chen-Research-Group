import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/patents
export async function GET() {
  try {
    const patents = await prisma.patent.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(patents);
  } catch (error) {
    console.error("Error fetching patents:", error);
    return NextResponse.json({ error: "获取专利失败" }, { status: 500 });
  }
}

// POST /api/patents
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, patentNumber, patentType, status, applicationDate, authorizationDate, inventors } = body;

    const patent = await prisma.patent.create({
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

    return NextResponse.json(patent, { status: 201 });
  } catch (error) {
    console.error("Error creating patent:", error);
    return NextResponse.json({ error: "创建专利失败" }, { status: 500 });
  }
}
