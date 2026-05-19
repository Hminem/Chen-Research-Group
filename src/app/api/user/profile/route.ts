import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/profile - 获取当前用户信息
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        member: true,
        submissions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 不返回密码
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}

// PUT /api/user/profile - 更新当前用户信息
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { name, studentId } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        studentId,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
