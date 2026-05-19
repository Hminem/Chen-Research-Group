import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/papers - 获取论文列表
export async function GET() {
  try {
    const papers = await prisma.publication.findMany({
      orderBy: { year: "desc" },
    });
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json({ error: "获取论文失败" }, { status: 500 });
  }
}

// POST /api/papers - 创建论文
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authors, journal, year, doi, abstract } = body;

    const paper = await prisma.publication.create({
      data: {
        title,
        authors,
        journal,
        year,
        doi,
        abstract,
      },
    });

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json({ error: "创建论文失败" }, { status: 500 });
  }
}
