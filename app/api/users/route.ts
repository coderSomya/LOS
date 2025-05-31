
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { username, password, userType, pincode } = await request.json();
    
    const user = await prisma.user.create({
      data: {
        username,
        password,
        userType,
        pincode,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        userType: true,
        pincode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
