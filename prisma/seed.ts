import { PrismaClient, StaffRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@newmarketvfd.org";
  const password = "ChangeThisPassword123!";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.staffUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: StaffRole.ADMIN,
      active: true,
    },
    create: {
      email,
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: StaffRole.ADMIN,
      active: true,
    },
  });

  console.log("Admin created");
  console.log(email);
  console.log(password);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });