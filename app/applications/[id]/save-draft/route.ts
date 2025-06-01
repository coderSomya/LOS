// app/api/applications/[id]/save-draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { personalDetails, goldLoanDetails, accountDetails, userId } = body;

    // Start a transaction to save all related data
    const result = await prisma.$transaction(async (tx) => {
      // Update application status
      const application = await tx.application.update({
        where: { id },
        data: {
          status: 'DRAFT',
          lastUpdated: new Date(),
          lastUpdatedBy: userId,
        },
      });

      // Upsert PersonalDetails
      if (personalDetails) {
        await tx.personalDetails.upsert({
          where: { applicationId: id },
          create: {
            applicationId: id,
            ...personalDetails,
          },
          update: personalDetails,
        });
      }

      // Upsert GoldLoanDetails
      if (goldLoanDetails) {
        await tx.goldLoanDetails.upsert({
          where: { applicationId: id },
          create: {
            applicationId: id,
            ...goldLoanDetails,
          },
          update: goldLoanDetails,
        });
      }

      // Upsert AccountDetails
      if (accountDetails) {
        await tx.accountDetails.upsert({
          where: { applicationId: id },
          create: {
            applicationId: id,
            ...accountDetails,
          },
          update: accountDetails,
        });
      }

      // Create activity log
      await tx.activityLog.create({
        data: {
          applicationId: id,
          userId,
          actionType: 'SAVED',
          action: 'Draft saved',
          performedBy: userId,
          details: {
            sections: {
              personalDetails: !!personalDetails,
              goldLoanDetails: !!goldLoanDetails,
              accountDetails: !!accountDetails,
            },
          },
        },
      });

      return application;
    });

    return NextResponse.json({ 
      success: true, 
      application: result,
      message: 'Draft saved successfully' 
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}