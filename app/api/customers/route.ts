
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a customer ID with format CUST-XXXXXX
const generateCustomerId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CUST-${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const { name, phone, pincode, aadharNumber, panNumber } = await request.json();
    
    const custId = generateCustomerId();
    
    const customer = await prisma.customer.create({
      data: {
        custId,
        name,
        phone,
        pincode,
        aadharNumber,
        panNumber,
        kycVerified: false,
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
