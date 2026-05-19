import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/copyrights
export async function GET() {
  try {
    const copyrights = await prisma.softwareCopyright.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(copyrights);
  } catch (error) {
    console.error("Error fetching copyrights:", error);
    return NextResponse.json({ error: "获取软著失败" }, { status: 500 });
  }
}

// POST /api/copyrights
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, registrationNumber, version, registrationDate } = body;

    const copyright = await prisma.softwareCopyright.create({
      data: {
        name,
        registrationNumber,
        version,
        registrationDate: registrationDate ? new Date(registrationDate) : null,
      },
    });

    return NextResponse.json(copyright, { status: 201 });
  } catch (error) {
    console.error("Error creating copyright:", error);
    return NextResponse.json({ error: "创建软著失败" }, { status: 500 });
  }
}
