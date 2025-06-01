import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        userType: true,
        pincode: true,
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    
    // Create the auth state that exactly matches Zustand persist structure
    const authState = {
      state: {
        user: userWithoutPassword,
        isAuthenticated: true
      },
      version: 0
    };
    
    const response = NextResponse.json(userWithoutPassword);
    
    // Set the cookie on the server side so middleware can access it immediately
    response.cookies.set({
      name: "auth-storage",
      value: JSON.stringify(authState),
      httpOnly: false, // Allow client-side access for Zustand
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });
    
    return response;
    
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}