import { PrismaClient, User } from "@prisma/client";
import moment from "moment";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export async function generateUserId() {
  const prefix = "RMUID";
  const padLength = 3; // jumlah digit angka

  // Ambil record terakhir berdasarkan ID (urut desc)
  const lastRecord = await prisma.user.count({});

  // Format ulang dengan leading zero
  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateUserNIP(user: User) {
  const prefix = "RMID";
  const padLength = 3; // jumlah digit angka

  // Ambil record terakhir berdasarkan ID (urut desc)
  const lastRecord = await prisma.user.count({});

  // Format ulang dengan leading zero
  const newId = `${prefix}${moment(user.tgl_join).format("MMYYYY")}${String(
    lastRecord + 1
  ).padStart(padLength, "0")}`;

  return newId;
}
