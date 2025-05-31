
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActionType, AppStatus } from "@/types";

// Generate app IDs
const generateTempAppId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `TEMP-${random}`;
};

const generateAppId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `LOS-APP-${random}`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, formData, userId, comment } = await request.json();
    const { id } = params;

    let updateData: any = {};
    let actionType: ActionType;
    let activityComment = comment;

    switch (action) {
      case "save":
        updateData = {
          formData,
          tempAppId: generateTempAppId(),
        };
        actionType = ActionType.SAVED;
        activityComment = "Application form saved";
        break;

      case "submit":
        updateData = {
          formData,
          appId: generateAppId(),
          status: AppStatus.FORM_SUBMITTED,
        };
        actionType = ActionType.SUBMITTED;
        activityComment = "Application form submitted";
        break;

      case "approve":
        // Check if customer KYC is verified
        const appForApproval = await prisma.application.findUnique({
          where: { id },
          include: { customer: true },
        });
        
        if (!appForApproval?.customer.kycVerified) {
          return NextResponse.json(
            { error: "Customer KYC not verified" },
            { status: 400 }
          );
        }

        updateData = { status: AppStatus.LOAN_APPROVED };
        actionType = ActionType.APPROVED;
        activityComment = comment || "Loan application approved";
        break;

      case "reject":
        updateData = { status: AppStatus.LOAN_REJECTED };
        actionType = ActionType.REJECTED;
        activityComment = comment || "Loan application rejected";
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    });

    // Add activity log
    await prisma.activityLog.create({
      data: {
        applicationId: id,
        actionType,
        comment: activityComment,
        performedBy: userId,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
