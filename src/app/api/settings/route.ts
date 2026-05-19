import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "获取设置失败" }, { status: 500 });
  }
}

// PUT /api/settings - 批量更新设置
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = body.settings as Array<{ key: string; value: string }>;

    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "更新设置失败" }, { status: 500 });
  }
}
