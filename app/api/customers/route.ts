import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a customer ID with format CUST-XXXXXX
const generateCustId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CUST-${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const { name, phone, pincode } = await request.json();

    const custId = generateCustId();

    const customer = await prisma.customer.create({
      data: {
        custId,
        name,
        phone,
        pincode,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode");

    const where = pincode ? { pincode } : {};

    const customers = await prisma.customer.findMany({
      where,
      include: {
        applications: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}