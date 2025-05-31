
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActionType, AppStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { customerId, pincode, loanType, userId, leadId } = await request.json();
    
    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }
    
    const application = await prisma.application.create({
      data: {
        leadId,
        customerId,
        pincode,
        loanType,
        status: AppStatus.DRAFT,
      },
      include: {
        customer: true,
      },
    });

    // Add activity log
    await prisma.activityLog.create({
      data: {
        applicationId: application.id,
        actionType: ActionType.CREATED,
        comment: "Application created",
        performedBy: userId,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode");

    const where = pincode ? { pincode } : {};

    const applications = await prisma.application.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
