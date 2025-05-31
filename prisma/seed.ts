
import { PrismaClient, UserType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create dummy users
  await prisma.user.createMany({
    data: [
      {
        username: 'user1',
        password: '123',
        userType: UserType.SALES_MAKER,
        pincode: '111111',
      },
      {
        username: 'user2',
        password: '123',
        userType: UserType.SALES_CHECKER,
        pincode: '222222',
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
