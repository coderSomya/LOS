// app/api/applications/[id]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppStatus } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { personalDetails, goldLoanDetails, accountDetails, userId, leadId } = body;

    // Validate required fields
    if (!personalDetails || !goldLoanDetails || !accountDetails) {
      return NextResponse.json(
        { error: 'All form sections must be completed' },
        { status: 400 }
      );
    }

    // Start a transaction to save all data and update status
    const result = await prisma.$transaction(async (tx) => {
      // Update application
      const application = await tx.application.update({
        where: { id },
        data: {
          status: AppStatus.FORM_SUBMITTED,
          submittedAt: new Date(),
          submittedBy: userId,
          lastUpdated: new Date(),
          lastUpdatedBy: userId,
        },
      });

      // Save all form sections
      await tx.personalDetails.upsert({
        where: { applicationId: id },
        create: {
          applicationId: id,
          ...personalDetails,
        },
        update: personalDetails,
      });

      await tx.goldLoanDetails.upsert({
        where: { applicationId: id },
        create: {
          applicationId: id,
          ...goldLoanDetails,
        },
        update: goldLoanDetails,
      });

      await tx.accountDetails.upsert({
        where: { applicationId: id },
        create: {
          applicationId: id,
          ...accountDetails,
        },
        update: accountDetails,
      });

      // Create activity log
      await tx.activityLog.create({
        data: {
          applicationId: id,
          userId,
          actionType: 'SUBMITTED',
          action: 'Application submitted',
          comment: 'Gold loan application submitted for review',
          performedBy: userId,
          details: {
            leadId,
            loanAmount: goldLoanDetails.loanAmount,
            tenor: goldLoanDetails.tenor,
          },
        },
      });

      return application;
    });

    return NextResponse.json({ 
      success: true, 
      application: result,
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}