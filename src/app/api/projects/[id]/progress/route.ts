import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/projects/[id]/progress - 添加项目进展
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, progressDate, attachments } = body;

    const progress = await prisma.projectProgress.create({
      data: {
        projectId: id,
        title,
        content,
        progressDate: new Date(progressDate),
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("Error adding progress:", error);
    return NextResponse.json({ error: "添加进展失败" }, { status: 500 });
  }
}
