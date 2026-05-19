import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/news/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json({ error: "新闻不存在" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}

// PUT /api/news/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, summary, content, category, coverImage, isPublished } = body;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        category,
        coverImage,
        isPublished,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "更新新闻失败" }, { status: 500 });
  }
}

// DELETE /api/news/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "删除新闻失败" }, { status: 500 });
  }
}
