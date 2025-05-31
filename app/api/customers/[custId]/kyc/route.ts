
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActionType } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { custId: string } }
) {
  try {
    const { verified, userId } = await request.json();
    const { custId } = params;

    const customer = await prisma.customer.update({
      where: { custId },
      data: { kycVerified: verified },
    });

    // Add activity logs for all applications of this customer
    const applications = await prisma.application.findMany({
      where: { customerId: customer.id },
    });

    for (const app of applications) {
      await prisma.activityLog.create({
        data: {
          applicationId: app.id,
          actionType: ActionType.KYC_VERIFIED,
          comment: verified ? "KYC verified" : "KYC verification revoked",
          performedBy: userId,
        },
      });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error updating KYC:", error);
    return NextResponse.json(
      { error: "Failed to update KYC" },
      { status: 500 }
    );
  }
}
