import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode");
    const custId = searchParams.get("custId");
    const phone = searchParams.get("phone");

    // Single customer by custId
    if (custId) {
      const customer = await prisma.customer.findUnique({
        where: { custId },
        include: {
          applications: {
            select: {
              id: true,
              leadId: true,
              status: true,
              loanType: true,
              createdAt: true,
            },
          },
        },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(customer);
    }

    // Single customer by phone
    if (phone) {
      const customer = await prisma.customer.findFirst({
        where: { phone },
        include: {
          applications: {
            select: {
              id: true,
              leadId: true,
              status: true,
              loanType: true,
              createdAt: true,
            },
          },
        },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(customer);
    }

    // Multiple customers by pincode
    if (pincode) {
      const customers = await prisma.customer.findMany({
        where: { pincode },
        include: {
          applications: {
            select: {
              id: true,
              leadId: true,
              status: true,
              loanType: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(customers);
    }

    // If no query parameters, return empty array
    return NextResponse.json([]);

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, pincode, aadharNumber, panNumber } = body;

    // Validate required fields
    if (!name || !phone || !pincode || !aadharNumber || !panNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if customer with this phone already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: { phone },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this phone number already exists" },
        { status: 409 }
      );
    }

    // Check if customer with this Aadhar already exists
    if (aadharNumber) {
      const existingAadhar = await prisma.customer.findFirst({
        where: { aadharNumber },
      });

      if (existingAadhar) {
        return NextResponse.json(
          { error: "Customer with this Aadhar number already exists" },
          { status: 409 }
        );
      }
    }

    // Check if customer with this PAN already exists
    if (panNumber) {
      const existingPan = await prisma.customer.findFirst({
        where: { panNumber },
      });

      if (existingPan) {
        return NextResponse.json(
          { error: "Customer with this PAN number already exists" },
          { status: 409 }
        );
      }
    }

    // Generate customer ID
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { createdAt: "desc" },
      select: { custId: true },
    });

    let nextCustNumber = 1;
    if (lastCustomer && lastCustomer.custId) {
      const match = lastCustomer.custId.match(/CUST(\d+)/);
      if (match) {
        nextCustNumber = parseInt(match[1]) + 1;
      }
    }

    const custId = `CUST${nextCustNumber.toString().padStart(6, "0")}`;

    // Create customer
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}