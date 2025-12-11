import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const userPass = await bcrypt.hash("syrel2025", 10);

  const generateId = "RMUID001";
  const user: User = {
    id: generateId,
    fullname: "Lodewijk HF Lantang",
    nik: "320",
    nip: "",
    jk: "Laki - Laki",
    position: "IT",
    email: null,
    phone: null,
    password: userPass,
    photo: null,
    tgl_join: new Date(),
    tgl_leave: null,

    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const generateNIP = "RMID122025001";

  await prisma.user.upsert({
    where: { id: generateId },
    create: { ...user, nip: generateNIP },
    update: {},
  });

  console.log("Seeding succeesfully...");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
